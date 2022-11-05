class OutOfStockError extends Error {
    constructor(e) {
      let errMsg = e
      super(errMsg); 
      this.name = "OutOfStockError"; // (2)
    }
  }
module.exports = {OutOfStockError}