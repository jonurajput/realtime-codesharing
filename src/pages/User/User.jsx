import React from 'react'
import './User.css'
import Avatar from 'react-avatar'
const User = ({user}) => {
  return (
    <div className='user_'>
     <Avatar name={user} size="50" round="14px" />
     <span className='name'>{user}</span>
    </div>
  )
}

export default User
