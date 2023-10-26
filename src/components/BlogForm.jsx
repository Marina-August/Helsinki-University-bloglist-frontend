import { useState } from 'react'


const BlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url,
    }
    handleNewBlog(newBlog)
    setAuthor(''),
    setTitle('')
    setURL('')
  }

  return(
    <form onSubmit={addBlog}>
      <div>
            title:
        <input
          type="text"
          id='title'
          value={title}
          name="Title"
          placeholder='title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
            author:
        <input
          type="text"
          id='author'
          value={author}
          name="Author"
          placeholder='author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
            url:
        <input
          type="text"
          id='url'
          value={url}
          name="URL"
          placeholder='url'
          onChange={({ target }) => setURL(target.value)}
        />
      </div>
      <button id='create-button' type="submit">create</button>
    </form>

  )
}

export default BlogForm