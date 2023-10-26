import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateHandler, deleteHandler, user }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [like, setLike] = useState(blog.likes)

  const addLike = () => {
    let like_ = blog.likes
    const blog_ = { ...blog, likes:++like_ }
    setLike(blog_.likes)
    updateHandler( blog_)
  }

  const removeBlog = async() => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)){
      try{
        await blogService.deleteBlog(blog.id)
        deleteHandler(blog.id)
      } catch(error){
        console.error('Error deleting person:', error)
      }
    }
  }

  return(
    <div className='blog_container'>
      <div className='blog_title'>
        {blog.title}
        <div data-testid="author" id="author">{blog.author}</div>
        <button id ='view_button' onClick={() => setIsVisible( prev => !prev)}>{isVisible? 'hide':'view'}</button>
      </div>
      {isVisible &&
        <div>
          <a href={blog.url}>{blog.url}</a>
          <p id='likes_count'>likes {like} <button id= 'like_button' onClick={addLike}>like</button></p>
          <p>{blog.user.name}</p>
          {user.username === blog.user.username? <button id='remove_button' className='remove_button' onClick={removeBlog}>remove</button>:''}
        </div>}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  updateHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
}

export default Blog