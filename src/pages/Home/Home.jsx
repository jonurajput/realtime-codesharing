import React, { useState } from 'react'
import "./home.css"
import { v4 as uuidv4 } from "uuid"
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"

const Home = () => {
  const [roomid, setId] = useState("");
  const [username, setUser] = useState("");
  const navigate=useNavigate();

  const createId = () => {
    const id = uuidv4();
    setId(id);
    toast.success("new room is created")
    console.log(id)
  }
  const joinroom=()=>{
    if(!roomid || !username){
      toast.error("check RoomID and USERNAME")
      return;
    }
     navigate(`/editor/${roomid}`,{
      state:{
        username,
      }
     })

  }

  const handleKey=(e)=>{
    if(e.code==='Enter'){
      joinroom();
    }
  }
  return (
    <div className="home">
      <div className='home_nav'>
        <h2>E-Share</h2>
      </div>
      <div>
        <div className="home_form">
          <div className="form">
            <h3 style={{ color: "#f5f5f7", padding: "6px" }}>Join Room</h3>

            <span style={{ color: "grey", padding: "6px" }}>paste invitation roomId</span>

            <input type="text"
              placeholder='ROOM ID'
              value={roomid}
              onChange={(e) => setId(e.target.value)} 
                onKeyUp={(e)=>handleKey(e)}
              />

            <input type="text"
              placeholder='USERNAME'
              value={username}
              onChange={(e) => setUser(e.target.value)} 
              onKeyUp={(e)=>handleKey(e)}
              />

            <button className='btn' onClick={joinroom}>Join</button>

            <span style={{ color: "grey", marginBottom: "10px" }}>
              create
              <span style={{ color: "#f5f5f7",borderBottom:"2px solid #f5f5f7", fontWeight: "600", marginLeft: "6px", cursor: "pointer" }}
                onClick={createId}>
                new room</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
