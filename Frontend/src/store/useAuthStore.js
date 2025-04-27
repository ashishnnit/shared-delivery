import {create} from "zustand";
import {axiosInstance} from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL="http://localhost:5002";

export const useAuthStore = create((set,get) => ({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,
    authAdmin:null,

    checkAuth:async()=>{
        try {
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data})

            get().connectSocket();

        } catch (error) {
            console.log("Error while checking auth");
            set({isCheckingAuth:false})
        } finally{
            set({isCheckingAuth:false})
        }
    },

    checkAuthAdmin:async()=>{
        try {
            const res=await axiosInstance.get("/auth/checkAdmin");
            set({authAdmin:res.data})

            get().connectSocket();

        } catch (error) {
            console.log("Error while checking auth");
            set({isCheckingAuth:false})
        } finally{
            set({isCheckingAuth:false})
        }
    },

    signup:async (data)=>{
        set ({isSigningUp:true});
        try {
           console.log("data",data);
           const res= await axiosInstance.post("/auth/signup",data);
           set({authUser:res.data});
           toast.success("Account Created successfully");

           get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp:false});
        }
    },

    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            set({authAdmin:null});
            toast.success("Logged out successfully ");

            get().disconnectSocket();

        } catch (error) {
            console.log("Error while logging out");
            toast.error(error.response.data.message);
        }
    },

    login:async(data)=>{
        set({isLoggingIn:true});
        try {
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in successfully");

            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false});
        }
    },

    loginAdmin:async(data)=>{
        set({isLoggingIn:true});
        try {
            const res=await axiosInstance.post("/auth/loginAdmin",data);
            set({authAdmin:res.data});
            toast.success("Logged in successfully");

            get().connectSocket();

        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false});
        }
    },

    forgotPassword:async(data)=>{
        try {
            const res=await axiosInstance.post("/auth/forgot-password",data);
            toast.success("Password reset link sent to your email");

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
     
    resetPassword:async(data)=>{
        try {
            const res=await axiosInstance.post("/auth/reset-password",data);
            toast.success("Password reset successfully now login again");

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected) return;
 
        const socket=io(BASE_URL,{
               query:{
                 userId:authUser._id
               },
        });
        socket.connect();
 
        set({socket:socket});
 
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds});
        });
     },
 
     disconnectSocket:()=>{
         if(get().socket?.connected){
             get().socket.disconnect();
         }
     },

}))
