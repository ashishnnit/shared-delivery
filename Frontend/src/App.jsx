import React from "react";
import "./index.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import { Loader } from "lucide-react";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ShowMyPosts from "./pages/ShowMyPosts";
import EditPostPage from "./pages/EditPostPage";
import NavBar from "./pages/NavBar";
import PostMapPage from "./pages/PostMapPage";
import ChatPage from "./pages/ChatPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import { useChatStore } from "./store/useChatStore";
import ForgotPassPage from "./pages/ForgotPassPage";
import ResetPassPage from "./pages/ResetPassPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, authAdmin, checkAuthAdmin } =
    useAuthStore();

  useEffect(() => {
    checkAuth();
    checkAuthAdmin();
  }, [checkAuth, checkAuthAdmin]);

  return (
    <div>
      <NavBar />
      <div style={{ paddingTop: "60px" }}>
        {" "}
        {/* Adjust the padding as needed */}
        <Routes>

          <Route
            path="/"
            element={
              authUser ? (
                <HomePage />
              ) : authAdmin ? (
                <Navigate to="/adminDashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/adminDashboard"
            element={authAdmin ? <AdminPage /> : <Navigate to="/adminLogin" />}
          />

          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />

          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />

          <Route
            path="/adminLogin"
            element={
              !authAdmin ? (
                <AdminLoginPage />
              ) : (
                <Navigate to="/adminDashboard" />
              )
            }
          />

          <Route
            path="/createPost"
            element={
              authUser ? (
                <CreatePostPage />
              ) : authAdmin ? (
                <Navigate to="/adminDashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/myPosts"
            element={
              authUser ? (
                <ShowMyPosts />
              ) : authAdmin ? (
                <Navigate to="/adminDashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route path="/editPost/:id" element={<EditPostPage />} />

          <Route
            path="/post-map"
            element={authUser ? <PostMapPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/chatPage"
            element={
              authUser ? (
                <ChatPage />
              ) : authAdmin ? (
                <Navigate to="/adminDashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

         <Route
            path="/forgot-password"
            element={ < ForgotPassPage/>}
          />

         <Route
            path="/reset-password/:token"
            element={ < ResetPassPage/>}
          />

        </Routes>
        
      </div>
      <Toaster />
    </div>
  );
};

export default App;
