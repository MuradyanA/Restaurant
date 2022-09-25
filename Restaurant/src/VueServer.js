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
                store.userId = resp.data.id;
                store.accessToken = resp.data.accessToken;
                store.user = resp.data.name;
                store.expireTime = resp.data.expireTime;
                store.setCartItems(resp.data.cartInfo)
                store.setUserName(resp.data.name) 
                store.role = resp.data.role
                resolve();
            }).catch((err) => {
                    formDataErrors.value.pass += " " + err.response.data;
                    reject();
            })})
            
    }
    static get(url,authorization){
        console.log(authorization,"   Authorization");
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
            instance.post('/token').then((resp)=>{
                store.accessToken = resp.data.accessToken;  
                store.expireTime = resp.data.expireTime;
                store.user = resp.data.name 
                store.userId = resp.data.id
                store.role = resp.data.role
                resolve()
            }).catch(()=>{
                router.push({ name: 'login'})
                reject("Refresh token doesn't exist!") 
            })
        })
    }
    static async request(url,method,body,authorization=false){
        const store = useStore();
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
            let timeDif = store.expireTime-Date.now()
            if(timeDif<110*1000){
                await this.updatetoken()
            }
            token = store.accessToken
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
        const id = store.userId
        this.request(`logout/${id}`,'delete','', true)
        .then(()=>{
            store.refreshToken ="";
            store.accessToken ="";
            store.user ="";
            store.userId ="";
            store.expireTime ="";
            store.cartList = []
        })
    }
}





    
    // VueServer.post('/orders', {name:'Lalala', price: 2000}, authorize=false);
    // VueServer.put('/orders', {name:'Lalala', price: 2000});
    // VueServer.get('/orders');
    // VueServer.delete('/orders/3');
    
    
    