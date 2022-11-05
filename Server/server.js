require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = __dirname + "/views/";
const app = express();
const {
  sequelize,
  Food,
  User,
  Refreshtoken,
  Cart,
  Order,
  Orderdetails,
  Reminder,
  Transaction,
} = require("./models");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { access } = require("fs");
const moment = require("moment");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const { OutOfStockError } = require("./ErrorClasses/OutOfStockError.js");
const { QueryTypes } = require("sequelize");

const filterStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./views/FoodPictures");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const upload = multer({ storage: filterStorageEngine });

const authenticateToken = (strict, req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null && strict == true) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    if (strict) {
      return res.sendStatus(401);
    } else {
      next();
    }
  }
};

const authenticateTokenStrict = (req, res, next) => {
  authenticateToken(true, req, res, next);
};

const authenticateTokenSoft = (req, res, next) => {
  authenticateToken(false, req, res, next);
};

app.use(cookieParser());
app.use(express.static(path));
var corsOptions = {
  origin: "http://localhost:8080",
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require("./models");
const { now } = require("moment");
const { strict } = require("assert");

app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

app.post("/register", async (req, res) => {
  try {
    bcrypt.hash(req.body.pass, saltRounds, async (err, hash) => {
      let newUser = { ...req.body };
      newUser.pass = hash;
      newUser.role = "user";
      const user = await User.create(newUser);
      return res.status(201).send();
    });
  } catch (err) {
    return res.status(400).json(err);
  }
});

app.post("/login", async (req, res) => {
  let loginUser;
  try {
    loginUser = await User.findOne({ where: { email: req.body.email } });
  } catch (err) {
    res.status(400);
    return res.json(err);
  }
  if (loginUser !== null) {
    bcrypt.compare(req.body.pass, loginUser.pass, async (err, result) => {
      if (result) {
        const accessToken = jwt.sign(
          {
            id: loginUser.id,
            role: loginUser.role,
            name: loginUser.firstName,
            email: loginUser.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "120s" }
        );
        const refreshToken = jwt.sign(
          {
            id: loginUser.id,
            role: loginUser.role,
            name: loginUser.firstName,
            email: loginUser.email,
          },
          process.env.REFRESH_TOKEN_SECRET
        );

        await Refreshtoken.create({
          userId: loginUser.id,
          token: refreshToken,
        });
        const cartInfo = await Cart.findAll({
          where: { userId: loginUser.id },
        });
        res
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
          })
          .json({
            accessToken: accessToken,
            name: loginUser.firstName,
            id: loginUser.id,
            expireTime: Date.now() + 120 * 1000,
            cartInfo,
            role: loginUser.role,
          })
          .send();
      } else {
        return res.status(401).send("Email or password are incorrect");
      }
    });
  }
});

app.get("/accounting", authenticateTokenStrict, async (req, res) => {
  let startDate = moment(req.query.start);
  let endDate = moment(req.query.end);
  let queryText = `SELECT Transactions.id, Foods.name, turn, oper, Transactions.createdAt, OrderId, (select FoodId from Reminders where Reminders.id = Transactions.ReminderId) as foodId  FROM Transactions
  JOIN Foods ON Foods.id = foodId 
  WHERE Transactions.createdAt >= :start AND Transactions.createdAt <= :end`;
  if (req.query.name) {
    queryText += ` AND name LIKE :name`;
  }
  if (startDate.isValid && endDate.isValid) {
    const [results, metadata] = await sequelize.query(queryText, {
      replacements: {
        start: startDate.format(),
        end: endDate.format(),
        name: `%${req.query.name}%`,
        type: QueryTypes.SELECT,
      },
    });

    if (results === undefined) {
      results = [];
    } else if (!Array.isArray(results)) {
      results = [results];
    }

    const finalResults = results.map((el) => {
      let { id, name, turn, oper, createdAt, OrderId } = el;
      return {
        id,
        name,
        turn,
        oper,
        createdAt: moment(createdAt).format("DD/MM/YYYY, h:mm a"),
        OrderId,
      };
    });
    return res.json(finalResults);
  } else {
    return res.status(400).json("Invalid dates");
  }
});

app.post("/transaction", authenticateTokenStrict, async (req, res) => {
  try {
    const result = await sequelize.transaction(async (t) => {
      await Reminder.registerTransaction(
        t,
        req.body.updateQtyFoodId,
        req.body.updateQtyQuantity,
        "ADD/UPD"
      );
      return res.json("OK");
    });
  } catch (err) {
    if (err.name == "OutOfStockError") {
      return res.status(400).json(err.message);
    } else {
      return res.status(400).json("An error occured...");
    }
  }
});

app.delete("/transaction", authenticateToken, async (req, res) => {
  const transaction = await Transaction.findByPk(req.body.transactionId);
  if (transaction.OrderId === null) {
    await Transaction.destroy({ where: { id: req.body.transactionId } });
    return res.json("OK");
  } else {
    return res
      .status(400)
      .json("Transactions associated with orders are forbidden to delete");
  }
});

app.get("/reminder", authenticateToken, async (req, res) => {
  let results, metadata;
  [results, metadata] = await sequelize.query(
    `SELECT FoodId,(SELECT name FROM Foods WHERE Foods.id=Reminders.FoodId) as foodName, reminder FROM Reminders`
  );
  return res.json(results);
});

app.post("/reminder", authenticateToken, async (req, res) => {
  const reminder = await Reminder.findOne({
    where: { FoodId: req.body.foodId },
  });
  if (reminder !== null) {
    return res.sendStatus(200);
  }
  const findFood = await Food.findOne({where:{id:req.body.foodId}});
  if (findFood !== null) {
    const newReminder =  await Reminder.create({
      reminder: 0,
      FoodId: req.body.foodId,
    });
    return res.json(newReminder);
  } else {
    return res.sendStatus(400);
  }
});

app.delete("/reminder", authenticateToken, async (req, res) => {
  const reminder = await Reminder.findOne({where:{FoodId:req.body.foodId}});
  if (reminder !== null) {
    await reminder.destroy();
    return res.sendStatus(200);
  } else {
    return res.sendStatus(400);
  }
});

app.post(
  "/foodcards",
  [authenticateTokenStrict, upload.single("image")],
  async (req, res) => {
    if (req.file) {
      let imagePath = `./views/FoodPictures/${req.file.filename}`;
      let resizedImagePath = `FoodPictures/pic-${Date.now()}.jpg`;
      sharp(imagePath)
        .resize(300, 400, { fit: "contain", background: "white" })
        .toFile(`./views/${resizedImagePath}`)
        .then(async function (outputBuffer) {
          fs.unlinkSync(imagePath);
          const newFood = await Food.create({
            name: req.body.name,
            price: req.body.price,
            img: resizedImagePath,
          });

          return res.json(newFood);
        });
    } else {
      const newFood = await Food.create({
        name: req.body.name,
        price: req.body.price,
        img: "FoodPictures/noPic.jpg",
      });
      return res.json(newFood);
    }
  }
);

app.put(
  "/foodcards",
  [authenticateTokenStrict, upload.single("image")],
  async function (req, res) {
    let foodCard = await Food.findByPk(req.body.id);
    if (req.body.deleteImage) {
      fs.unlinkSync(`./views/${foodCard.img}`);
      foodCard.img = "FoodPictures/noPic.jpg";
      await foodCard.save();
      return res.json(foodCard);
    }
    if (req.file) {
      let imagePath = `./views/FoodPictures/${req.file.filename}`;
      let resizedImagePath = `FoodPictures/pic-${Date.now()}.jpg`;
      await sharp(imagePath)
        .resize(300, 400, { fit: "contain", background: "white" })
        .toFile(`./views/${resizedImagePath}`);
      fs.unlinkSync(imagePath);
      foodCard.img = resizedImagePath;
      await foodCard.save();
    } else {
      if ("active" in req.body) {
        foodCard.active = req.body.active;
      }
      foodCard.name = req.body.name;
      foodCard.price = req.body.price;
      await foodCard.save();
    }
    return res.json(foodCard);
  }
);

app.delete("/foodcards", authenticateTokenStrict, async function (req, res) {
  if (req.user.role == "admin") {
    try {
      await Reminder.destroy({
        where: {
          FoodId: req.body.id,
        },
      });
      await Food.destroy({
        where: {
          id: req.body.id,
        },
      });
      return res.sendStatus(200);
    } catch (e) {
      return res.status(422).json({
        err: "Failed to delete a Food Card, beacuse it is added in users cart.",
      });
    }
  }
  return res.sendStatus(403);
});

app.get("/foodcards/:id?", authenticateTokenSoft, async function (req, res) {
  if (req.user && req.user.role == "admin") {
    if (req.params.id) {
      Food.findByPk(req.params.id).then((r) => {
        return res.json(r);
      });
    } else {
      Food.findAll({
        include: [
          {
            model: Reminder,
            attributes: ["id"],
          },
        ],
      }).then((r) => {
        let arr = [];
        arr = r.map((element) => element.get());
        return res.json(arr);
      });
    }
  } else {
    Food.findAll({ where: { active: true } }).then((r) => {
      let arr = [];
      arr = r.map((element) => element.get());
      return res.json(arr);
    });
  }
});

app.post("/cart", authenticateTokenStrict, async function (req, res) {
  const food = await Food.findOne({ where: { id: req.body.id } });
  let cartItem = await Cart.findOne({
    where: { userId: req.user.id, name: food.name },
  });
  if (food != null) {
    if (cartItem == null) {
      cartItem = await Cart.create({
        userId: req.user.id,
        name: food.name,
        price: food.price,
        quantity: req.body.quantity,
        FoodId: req.body.id,
      });
    } else {
      cartItem.quantity += req.body.quantity;
      await cartItem.save();
    }
  }
  const cartItemQuantity = await Cart.count({ where: { userId: req.user.id } });
  return res.json({ id: cartItem.id, items: cartItemQuantity });
});

app.get("/cart", authenticateTokenStrict, async function (req, res) {
  const cartData = await Cart.findAll({ where: { userId: req.user.id } });
  return res.json({ cartData });
});
app.put("/cart", authenticateTokenStrict, async function (req, res) {
  if (req.body.qty < 1) {
    return res.sendStatus(403);
  }
  const cartItem = await Cart.findByPk(req.body.id);

  if (cartItem.userId == req.user.id) {
    cartItem.quantity = req.body.qty;
    await cartItem.save();
    return res.sendStatus(200);
  } else {
    return res.sendStatus(403);
  }
});

app.delete("/cart", authenticateTokenStrict, async function (req, res) {
  const cartItem = await Cart.findByPk(req.body.id);
  if (cartItem.userId == req.user.id) {
    await cartItem.destroy();
    return res.sendStatus(200);
  } else {
    return res.sendStatus(403);
  }
});

app.get("/orderhistory", authenticateTokenStrict, async function (req, res) {
  let orderItems;
  if (req.query.start == undefined || req.query.end == undefined) {
    return res
      .sendStatus(400)
      .json({ err: "Start and End dates must be provided" });
  }
  let filterData = {
    createdAt: {
      [Op.between]: [new Date(req.query.start), new Date(req.query.end)],
    },
  };
  if (req.query.name) {
    filterData[Op.or] = [
      {
        firstName: {
          [Op.like]: `${req.query.name}%`,
        },
      },
      {
        secondName: {
          [Op.like]: `${req.query.name}%`,
        },
      },
    ];
  }
  let additionalButtons;
  if (req.user.role == "admin") {
    orderItems = await Order.findAll({
      where: filterData,
      include: Orderdetails,
    });
    additionalButtons = true;
  } else {
    filterData.UserId = req.user.id;
    orderItems = await Order.findAll({
      where: filterData,
      include: Orderdetails,
    });
    additionalButtons = false;
  }

  return res.json({ orderItems, additionalButtons });
});

app.put("/order", authenticateTokenStrict, async function (req, res) {
  const statuses = ["Pending", "Preparing", "Delivering", "Finished"];
  const order = await Order.findByPk(req.body.orderId);
  let statusIndex = statuses.indexOf(order.status);
  if (statusIndex == -1) {
    return res.json({ status: order.status });
  }
  if (req.user.role == "admin") {
    if (req.body.button == "back") {
      if (statusIndex > 0) {
        order.status = statuses[statusIndex - 1];
      }
    }
    if (req.body.button == "forward") {
      if (statusIndex < 3) {
        order.status = statuses[statusIndex + 1];
      }
    }
  }
  if (req.body.button == "cancel" && statusIndex < 2) {
    order.status = "Canceled";
  }
  await order.save();
  return res.json({ status: order.status });
});

app.post("/order", authenticateTokenStrict, async function (req, res) {
  let order;
  const orderDetails = await Cart.findAll({
    where: { userId: req.user.id },
    attributes: { exclude: ["createdAt", "updatedAt", "id"] },
  });
  if (orderDetails.length == 0) {
    return res
      .status(400)
      .json({ errors: [{ message: "The cart is empty", path: "cart" }] });
  }
  try {
    const result = await sequelize.transaction(async (t) => {
      order = await Order.create(
        {
          firstName: req.body.firstName,
          secondName: req.body.secondName,
          city: req.body.city,
          street: req.body.street,
          building: req.body.building,
          appartments: req.body.appartments,
          phoneNumber: req.body.phoneNumber,
          cardHolder: req.body.cardHolder,
          cardNumber: req.body.cardNumber,
          cvv: req.body.cvv,
          status: "Pending",
          deliveryTime: req.body.deliveryTime,
          UserId: req.user.id,
        },
        { transaction: t }
      );
      let ordded = orderDetails.map((obj) => {
        let el = obj.dataValues;
        delete el.userId;
        el.OrderId = order.id;
        el.foodName = el.name;
        delete el.name;
        return el;
      });
      await Cart.destroy({
        where: {
          userId: req.user.id,
        },
        transaction: t,
      });
      await Orderdetails.bulkCreate(ordded, { transaction: t });
      let errorItems = [];
      for (let item of ordded) {
        try {
          await Reminder.registerTransaction(
            t,
            item.FoodId,
            -item.quantity,
            "SELL",
            order.id
          );
        } catch (e) {
          errorItems.push(e.message);
        }
      }
      if (errorItems.length) {
        throw new OutOfStockError(
          `Required quantities are unavailable for the following item(s): ${errorItems.join(
            ", "
          )}`
        );
      }
      return res.json("OK");
    });
  } catch (err) {
    if (err.name == "OutOfStockError") {
      return res.status(400).json(err.message);
    } else {
      return res.status(400).json("An error occured...");
    }
  }
});

app.post("/token", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  if (Refreshtoken.findOne({ where: { token: refreshToken } })) {
    console.log("Token exists");
  } else {
    console.log("Token doesn't exists");
    return res.sendStatus(401);
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { name: user.name, email: user.email, id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "120s" }
    );
    res.json({
      id: user.id,
      name: user.name,
      accessToken,
      expireTime: Date.now() + 120 * 1000,
      role: user.role,
    });
  });
});

app.delete("/logout/:id", authenticateTokenStrict, async (req, res) => {
  await Refreshtoken.destroy({ where: { userId: req.params.id } });
  res.clearCookie("refreshToken");
  res.sendStatus(204);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  await sequelize.authenticate();
  console.log("DB connected.");
  console.log(`Server is running on port ${PORT}.`);
});
