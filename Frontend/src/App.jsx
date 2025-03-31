import React from 'react'
import './index.css'
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import CreatePostPage from "./pages/CreatePostPage";
import { Loader } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ShowMyPosts from './pages/ShowMyPosts';
import EditPostPage from './pages/EditPostPage';
import NavBar from "./pages/NavBar";
import PostMapPage from "./pages/PostMapPage";
import ChatPage from "./pages/ChatPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <NavBar />
      <div style={{ paddingTop: '60px' }}> {/* Adjust the padding as needed */}
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/createPost" element={authUser ? <CreatePostPage /> : <Navigate to="/login" />} />
          <Route path="/myPosts" element={authUser ? <ShowMyPosts /> : <Navigate to="/login" />} />
          <Route path="/editPost/:id" element={<EditPostPage />} />
          <Route path="/post-map" element={<PostMapPage />} />
          <Route path="/chatPage" element={<ChatPage />} />

        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
