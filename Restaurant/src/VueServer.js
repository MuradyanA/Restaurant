import axios from "axios";
import  router from "./router";
import { useStore } from "./store";
const instance = axios.create({baseURL: 'http://localhost:8080'})
export class VueServer  {
    static login(formData,formDataErrors) {
        const store = useStore();
        return new Promise(( resolve, reject)=>{
            instance
            .post("/login",formData.value)
            .then((resp) => {
                formData.value.email = "";
                formDataErrors.value.email = "";
                formData.value.pass = "";
                formDataErrors.value.pass = ""
                localStorage.setItem('id', resp.data.id);
                localStorage.setItem('accessToken', resp.data.accessToken);
                localStorage.setItem('refreshToken', resp.data.refreshToken);
                localStorage.setItem('name', resp.data.name);
                localStorage.setItem('expireTime', resp.data.expireTime);
                store.setCartItems(resp.data.cartInfo)
                store.setUserName(resp.data.name) 
                resolve();
            }).catch((err) => {
                    formDataErrors.value.pass += " " + err.response.data;
                    reject();
            })})
            
    }
    static get(url,authorization){
        return this.request(url,'get',null, authorization)
    }
    static post(url,body, authorization){
        return this.request(url,'post',body,authorization)
    }
    static put(url,body, authorization){
        return this.request(url,'put',body,authorization)
    }
    static delete(url,body, authorization){
        return this.request(url,'delete',body,authorization)
    }
    static updatetoken(){
        const store = useStore();
        return new Promise((resolve,reject)=>{
            const refreshToken = localStorage.getItem('refreshToken')
            if(refreshToken==null){
                router.push({ name: 'login'})
                reject("Refresh token doesn't exist!")  
            } 
            instance.post('/token',{refreshToken}).then((resp)=>{
                localStorage.setItem('accessToken', resp.data.accessToken);    
                localStorage.setItem('expireTime', resp.data.expireTime);
                store.setUserName(resp.data.name) 
                resolve()
            })
        })
    }
    static async request(url,method,body,authorization=false){
        let options ={};
        let token;
        if(method=='get'){
            options = {
                method,
                url,
            };
        }else{
            options = {
                method,
                data: body,
                url,
            };
        }
        if(authorization){
            let timeDif = localStorage.getItem("expireTime")-Date.now()
            if(timeDif<110*1000){
                await this.updatetoken()
            }
            token = localStorage.getItem('accessToken')
            options.headers= { 'Authorization': `Bearer ${token}` };    
        }
        return new Promise((resolve,reject)=>{
            if(token==null && authorization){
                router.push({ name: 'login'})
                reject("Access token doesn't exist!")
            }
            instance(options)
            .then((resp)=>resolve(resp)).catch((err)=>reject(err))
        })
        
    }
    
    
    static logout(){
        const store = useStore();
        const id = localStorage.getItem('id')
        instance.delete(`/logout/${id}`)
        .then(()=>{
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('name')
            localStorage.removeItem('id')
            localStorage.removeItem('expireTime');
            store.cartList = []
            store.cartItemsCount = 0
            store.setUserName("")
        })
    }
}





    
    // VueServer.post('/orders', {name:'Lalala', price: 2000}, authorize=false);
    // VueServer.put('/orders', {name:'Lalala', price: 2000});
    // VueServer.get('/orders');
    // VueServer.delete('/orders/3');
    
    
    