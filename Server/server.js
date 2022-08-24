require('dotenv').config(); 
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = __dirname + "/views/";
const app = express();
const {sequelize, Foods, User, Refreshtoken, Cart,Order,Orderdetails} = require ('./models')
const { Op } = require("sequelize"); 
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt=require('jsonwebtoken');
const { access } = require('fs');
const moment = require('moment');


app.use(express.static(path));
var corsOptions = {
  origin: "http://localhost:8080",
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require("./models");
const { now } = require('moment');
// const { where } = require('sequelize/types');
Cart.belongsTo(Foods)
//





app.get("/", function (req, res) {
  res.sendFile(path + "index.html");
});

app.post("/register", async (req, res)=> {
  try {
    bcrypt.hash(req.body.pass, saltRounds, async(err, hash)=> {
      let newUser = {...req.body} 
      newUser.pass=hash
      newUser.role = "user"
      const user = await User.create(newUser)
      return res.status(201).send()
    });
    
  } catch ( err ) {
    return res.status ( 400 ).json(err)
  }
});
app.post("/login", async (req, res)=> {
  let loginUser;
  try{
    loginUser = await User.findOne({ where: { email: req.body.email } });

  }catch(err){
    res.status(400)
    return res.json(err)
  }
  if(loginUser!==null){
    bcrypt.compare(req.body.pass, loginUser.pass, async (err, result) => {
      if(result){
        const accessToken = jwt.sign( {id:loginUser.id,  role:loginUser.role, name: loginUser.firstName, email:loginUser.email}, process.env.ACCESS_TOKEN_SECRET ,{expiresIn:'120s'})
        const refreshToken = jwt.sign( {id:loginUser.id, role:loginUser.role, name: loginUser.firstName, email:loginUser.email, }, process.env.REFRESH_TOKEN_SECRET )

        await Refreshtoken.create({userId:loginUser.id, token:refreshToken })
        res.json({
          accessToken:accessToken,
          refreshToken:refreshToken, 
          name:loginUser.firstName, 
          id:loginUser.id,
          expireTime:Date.now()+(120*1000)
        });
        }else{
          return res.status(401).send('Email or password are incorrect');
        }})
      }
    });
    
    app.get("/foodcards", function (req, res) {
      Foods.findAll().then((r)=>{
        let arr = []
        arr = r.map(element => element.get())
        res.json(arr);
        
      });
    });
    
    
    app.post("/cart", [authenticateToken, isExistingUser] ,async function(req,res){
      const food = await Foods.findOne({where:{id:req.body.id}})
      let cartItem = await Cart.findOne({where:{userId:req.user.id,name:food.name}})
      if(food!=null){
        if(cartItem==null){
          cartItem = await Cart.create({
            userId:req.user.id,
            name:food.name,
            price:food.price,
            quantity:req.body.quantity,
            FoodId:req.body.id
          })
        }else{
          cartItem.quantity+= req.body.quantity;
          await cartItem.save()
        }
      }
      const cartItemQuantity = await Cart.count({where:{userId:req.user.id}})
      return res.json({id:cartItem.id,items:cartItemQuantity})
    })
    
    
    app.put("/cart",[authenticateToken, isExistingUser],async function(req,res){
      if(req.body.qty<1){
        return res.sendStatus(403)
      }
      const cartItem = await Cart.findByPk(req.body.id)

      if(cartItem.userId==req.user.id){
        cartItem.quantity = req.body.qty
        await cartItem.save()
        return res.sendStatus(200)
      }else{
        return res.sendStatus(403)
      }
    })
    app.delete("/cart",[authenticateToken, isExistingUser],async function(req,res){
      const cartItem = await Cart.findByPk(req.body.id)
      if(cartItem.userId==req.user.id){
        await cartItem.destroy();
        return res.sendStatus(200)
      }else{
        return res.sendStatus(403)
      }
    })
    app.get("/cart",[authenticateToken, isExistingUser],async function(req,res){
      const cartData = await Cart.findAll({where:{userId:req.user.id}})
      return res.json({cartData});
    })

    app.get("/orderhistory",[authenticateToken, isExistingUser],async function(req,res){
      let orderItems;
      if(req.query.start==undefined || req.query.end==undefined){
        return res.sendStatus(400).json({err:"Start and End dates must be provided"})
      }
      let filterData = {
        createdAt:{
          [Op.between]:[new Date(req.query.start),new Date(req.query.end)]
        }
      }
      if(req.query.name){
        filterData[Op.or] = [
          {
            firstName: {
              [Op.like]: `${req.query.name}%`
            }
          },
          {
            secondName: {
              [Op.like]: `${req.query.name}%`
            }
          }
        ]
      }
      let additionalButtons;
      if(req.user.role=="admin"){
        orderItems = await Order.findAll({where:filterData,include: Orderdetails})
        additionalButtons = true;
      }else{
        filterData.UserId = req.user.id
        orderItems = await Order.findAll({where:filterData,include:Orderdetails});
        additionalButtons = false
      }

      return res.json({orderItems,additionalButtons});
    })
    
    app.put("/order",[authenticateToken,isExistingUser],async function(req,res){
      const statuses = ['Pending', 'Preparing', 'Delivering', 'Finished'];
      const order = await Order.findByPk(req.body.orderId)
      let statusIndex = statuses.indexOf(order.status)
      if(statusIndex== -1){
        return res.json({status:order.status})
      }
      if(req.user.role=="admin"){
        if(req.body.button=='back'){
          if(statusIndex > 0){
            order.status = statuses[statusIndex-1]
          }
        }
        if(req.body.button=='forward'){
          if(statusIndex < 3){
            order.status = statuses[statusIndex+1]
          }
        }
      }
      if(req.body.button=='cancel' && statusIndex<2){
        order.status = "Canceled"
      }
      await order.save()
      return res.json({status:order.status})
      
    })
    
    app.post("/order",[authenticateToken, isExistingUser],async function(req,res){
      let order
      try{
          order = await Order.create({
          firstName:req.body.firstName,
          secondName:req.body.secondName,
          city:req.body.city,
          street:req.body.street,
          building:req.body.building,
          appartments:req.body.appartments,
          phoneNumber:req.body.phoneNumber,
          cardHolder:req.body.cardHolder,
          cardNumber:req.body.cardNumber,
          cvv:req.body.cvv,
          status:"Pending",
          deliveryTime:req.body.deliveryTime,
          UserId:req.user.id
        })
      }catch(err){
        return res.status ( 400 ).json(err)
      }
      const orderDetails = await Cart.findAll({
        where:{userId:req.user.id},
        attributes:{exclude:['createdAt','updatedAt','id']}
      })
      let ordded = orderDetails.map((obj)=>{
        let el = obj.dataValues
        delete el.userId;
        el.OrderId = order.id; 
        el.foodName = el.name
        delete el.name
        return el
      })
      await Cart.destroy({
        where: {
          userId: req.user.id
        }
      });
      await Orderdetails.bulkCreate(ordded);
    })

    
  
    
    
    app.post( '/token', (req, res)=>{
      const refreshToken = req.body.refreshToken
      if (refreshToken == null) return res.sendStatus ( 401 )
      
      if(Refreshtoken.findOne({where:{token:refreshToken}})){
        console.log("Token exists")
      }else{
        console.log("Token doesn't exists")
      }
      jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403)
        const accessToken = jwt.sign( {name: user.name, email:user.email, id:user.id, role:user.role}, process.env.ACCESS_TOKEN_SECRET ,{expiresIn:'120s'})
        res.json({name:user.name,accessToken,expireTime:Date.now()+(120*1000)})
      })
    })
       
    app.delete('/logout/:id',async(req,res)=>{
      await Refreshtoken.destroy({where:{userId: req.params.id}});
      res.sendStatus(204)
    })
    

    
    
    // set port, listen for requests
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, async() => {
      await sequelize.authenticate()
      console.log('DB connected.')
      console.log(`Server is running on port ${PORT}.`);
    });
    
    
    
    function authenticateToken ( req, res , next ) {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]
      if ( token == null ) return res.sendStatus (401)
      jwt.verify( token, process.env.ACCESS_TOKEN_SECRET ,(err, user ) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next ()
      })
    }
    
    function isExistingUser(req,res,next){
      User.count({ where: { id:req.user.id}})
      .then((resp)=>{
        if( resp > 0){
          next()
        }else{
          return res.sendStatus(403)
        }
      })
    }