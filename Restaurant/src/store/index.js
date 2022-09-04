import { defineStore, storeToRefs } from 'pinia'

export const useStore = defineStore('counter', {
  state: () => ({ 
    cartList :[],
    user:"",
  }),
  getters: {
    totalForCartList: state => state.cartList.reduce(function(previousValue, item, index, array) {
      return (item.price * item.quantity) + previousValue
    }, 0),
    userName: state=> state.user,
    CartItemsCount: state => state.cartList.length,
  },
  actions: {
    addToCart(obj){
      let findIndex;
      let findObj = this.cartList.find(function(item, index, array) {
        if(item.id==obj.id){
          findIndex = index
          return true
        }})
        if(findObj){
          this.cartList[findIndex].quantity++
        }else{
          this.cartList.push(obj)
        }
      },
      setCartItems(items){
        this.cartList = items
      },
      removeFromCart(id){
        let findIndex;
        this.cartList.find(function(item, index, array) {
          if(item.id==id){
            findIndex = index
            return true
          }})
          this.cartList.splice(findIndex,1)
          this.cartItemsCount = this.cartItemsCount - 1
        },
        changeQuantity(item,plusMinus){
          if(plusMinus){
            item.quantity++
          }else{
            if(item.quantity>1){
              item.quantity--
            }
          }
           return item.quantity
        },
        setUserName(name){
          this.user = name;
        },
        emptyCart(){
          this.cartList.splice(0,this.cartList.length)
          console.log(this.cartList);
        }
      },
    })
    