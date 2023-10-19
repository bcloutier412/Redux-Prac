import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addNewPost } from './postsSlice'

export const AddPostForm = () => {
  const [input, setInput] = useState({
    title: '',
    content: '',
    userId: ''
  })
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  const dispatch = useDispatch()

  const users = useSelector(state => state.users)

  const onChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        await dispatch(addNewPost({ title: input.title, content: input.content, user: input.userId })).unwrap()
        setInput({
          title: '',
          content: '',
          userId: ''
        })
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  const canSave = [input.title, input.content, input.userId].every(Boolean) && addRequestStatus === 'idle'

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))

  return (
    <section>
      <form>
        <label htmlFor="postTitle">Post Title</label>
        <input type="text" id="postTitle" required name="title" value={input.title} onChange={(e) => onChange(e)}></input>
        <label htmlFor="postAuthor">Author:</label>
        <select name="userId" id="postAuthor" value={input.userId} onChange={onChange}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content: </label>
        <textarea id="postContent" required name="content" value={input.content} onChange={(e) => onChange(e)}/>
        <button type="button" onClick={onSubmit} disabled={!canSave}>Save Post</button>
      </form>
    </section>
  )
}