import React from 'react'
import defaultAvatar from '../assets/images/default_avt.jpg'

const Comment = ({ comment }) => {
  return (
    <div className="media mb-4 d-flex ">
      <img
        src={defaultAvatar}
        alt={`${comment.name}'s avatar`}
        className="mr-3 rounded-circle"
        style={{ width: '64px', height: '64px' }}
      />

      <div className="media-body">
        <h6 className="mt-0">{comment.name}</h6>
        <p>{comment.text}</p>
      </div>
    </div>
  )
}

export default Comment
