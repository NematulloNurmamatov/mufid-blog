import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Home from './Pages/Home'
import Register from './Components/Register'
import Login from './Components/Login'
import BlogDetail from './Pages/BlogDetail'
import CreateBlog from './Pages/CreateBlog'
import MyBlogs from './Pages/MyBlogs'
import MyProfile from './Pages/MyProfile'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="my-blogs" element={<MyBlogs />} />
        <Route path="create-blog" element={<CreateBlog />} />
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<h1>Error page 404</h1>} />
      </Route>
    </Routes>
  </BrowserRouter>
)
