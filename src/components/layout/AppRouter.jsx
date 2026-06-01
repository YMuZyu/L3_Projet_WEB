import { Routes, Route } from 'react-router-dom'
import HomePage from '../../pages/HomePage.jsx'
import LoginPage from '../../pages/LoginPage.jsx'
import RegisterPage from '../../pages/RegisterPage.jsx'
import PostPage from '../../pages/PostPage.jsx'
import CreatePostPage from '../../pages/CreatePostPage.jsx'
import UserProfilePage from '../../pages/UserProfilePage.jsx'

import QuestionsPage from '../../pages/QuestionsPage.jsx'
import TagsPage from '../../pages/TagsPage.jsx'
import MessagesPage from '../../pages/MessagesPage.jsx'

export default function NavMenu({ user, isConnected, onLogin, onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<HomePage isConnected={isConnected} />} />
      <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
      <Route path="/register" element={<RegisterPage onLogin={onLogin} />} />
      <Route path="/post/:postId" element={<PostPage />} />
      <Route path="/create" element={<CreatePostPage isConnected={isConnected} />} />
      <Route path="/profile/:userId" element={<UserProfilePage user={user} />} />

      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/tags" element={<TagsPage />} />
      <Route path="/messages" element={<MessagesPage isConnected={isConnected} />} />
    </Routes>
  )
}