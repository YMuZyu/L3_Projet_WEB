import { Routes, Route } from "react-router-dom";
import HomePage from "../../content/homePage/HomePage";
import LoginPage from "../../content/loginPage/LoginPage";
import Register from "../../content/registerPage/RegisterPage";

import './ContentArea.css'

// import LogoutPage from "../../content/logout/LogoutPage";
// import PostPage from "../../content/postPage/PostPage";
// import CreatePostPage from "../../content/createPostPage/CreatePostPage";
// import ProfilePage from "../../content/profilePage/ProfilePage";

export default function ContentArea() {
  return (
    <div className="content-area">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* <Route path="/logout" element={<LogoutPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </div>
  );
}