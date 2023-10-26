import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [blog, setBlog] = useState('')
  const [notification, setNotification] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sortedBlogs = [...blogs].sort((a, b) =>  b.likes-a.likes )
      setBlogs( sortedBlogs )
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const usernameHandler =({ target }) => {
    setUsername(target.value)
  }

  const passwordHandler = ({ target }) => {
    setPassword(target.value)
  }

  const handleLogin = async (event) => {
    console.log('login motan----')
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logOutHandler = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleNewBlog = async (newBlog) => {
    let blogResponse = await blogService.create(newBlog)
    const user = await userService.getUserById(blogResponse.user)
    blogResponse = { ...blogResponse, user:user }
    const blogs_ = [...blogs, blogResponse]
    setBlogs(blogs_)
    setBlogFormVisible(false)
    setNotification(`a new blog ${blogResponse.title} by ${blogResponse.author} added`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button id ='new_blog' onClick={() => setBlogFormVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm handleNewBlog={handleNewBlog}/>
          <button onClick={() => setBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )

  }

  const updateHandler = async(blog) => {
    let blogResponse = await blogService.update(blog)

    let blogs_ = blogs.filter(blog_ => blog_.id !== blog.id)
    let updatedBlog = blogs.find(blog_ => blog_.id === blog.id)
    updatedBlog = { ...updatedBlog, likes:blogResponse.likes }
    blogs_ = [...blogs_, updatedBlog].sort((a, b) =>  b.likes-a.likes )
    setBlogs(blogs_)
  }

  const deleteHandler =(id) => {
    let blogs_= blogs.filter(blog => blog.id !== id)
    blogs_ = blogs_.sort((a, b) =>  b.likes-a.likes )
    setBlogs(blogs_)
  }

  return (
    <div>
      {!user && <div>
        <h1>log in to application</h1>
        {errorMessage && <Notification message={errorMessage} error={true}/>}
        <LoginForm username={username} password={password} handleLogin={handleLogin}
          handleUsernameChange ={usernameHandler} handlePasswordChange ={passwordHandler}/>
      </div>}
      {user && <div>
        <h2>blogs</h2>
        {notification && <Notification message={notification} error={false}/>}
        <div className='logout_container'>
          <h3>{user.name} logged in</h3>
          <button className='logout' onClick={logOutHandler}>logout</button>
        </div>
        <h2>create new</h2>
        {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} updateHandler={updateHandler} deleteHandler={deleteHandler} user={user}/>
        )}
      </div>}
    </div>
  )
}

export default App