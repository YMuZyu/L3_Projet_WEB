import { Routes, Route } from 'react-router-dom'
import HomePage from '../../pages/HomePage.jsx'
import LoginPage from '../../pages/LoginPage.jsx'
import RegisterPage from '../../pages/RegisterPage.jsx'
import PostPage from '../../pages/PostPage.jsx'
import CreatePostPage from '../../pages/CreatePostPage.jsx'
import UserProfilePage from '../../pages/UserProfilePage.jsx'
import AdminPage from '../../pages/AdminPage.jsx'
import TagsPage from '../../pages/TagsPage.jsx'
import MessagesPage from '../../pages/MessagesPage.jsx'

export default function AppRouter({ user, isConnected, onLogin, onLogout }) {
  return (
    <Routes>
      <Route path="/"                   element={<HomePage isConnected={isConnected} />} />
      <Route path="/login"              element={<LoginPage onLogin={onLogin} />} />
      <Route path="/register"           element={<RegisterPage onLogin={onLogin} />} />
      <Route path="/post/:postId"       element={<PostPage user={user} isConnected={isConnected} />} />
      <Route path="/create"             element={<CreatePostPage isConnected={isConnected} />} />
      <Route path="/profile/:userId"    element={<UserProfilePage user={user} isConnected={isConnected} />} />
      <Route path="/admin"              element={<AdminPage />} />
      <Route path="/tags"               element={<TagsPage />} />
      <Route path="/messages"           element={<MessagesPage user={user} isConnected={isConnected} />} />
      <Route path="/messages/:userId"   element={<MessagesPage user={user} isConnected={isConnected} />} />
    </Routes>
  )
}
