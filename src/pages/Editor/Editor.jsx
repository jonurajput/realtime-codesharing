import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom'
import "./editor.css"
import { AiOutlineClose } from "react-icons/ai";
import {GoPrimitiveDot} from "react-icons/go"
import User from '../User/User';
import CodeEditor from '../CodeEditor/CodeEditor';
import { initSocket } from '../../socket';
import toast from "react-hot-toast"
import ACTIONS from '../../Action';
const Editor = () => {
    const socketRef = useRef(null);
    const codeRef=useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [client, setClient] = useState([]);
    useEffect(() => {
        console.log(codeRef.current)
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket_error', e)
                toast.error("Socket connection failed try again later");
                navigate("/");
            }
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId, username: location.state?.username
            })

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketID }) => {
                console.log(username, clients,socketID,codeRef.current)
                setClient(clients)
                if (username !== location.state?.username) {
                    
                    toast.success(`${username} has been joined the room`)
                }

                socketRef.current.emit(ACTIONS.SYNC_CODE,{code:codeRef.current,socketID})
            });
            //listening for disconnected
            socketRef.current.on(ACTIONS.DISCONNECTED, ({ id, username }) => {
                console.log(id, username)
                toast.success(`${username} left the room`)
                setClient((prev) => {
                    return prev.filter(i => i.socketId !== id)
                })
            });

        }
        init();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    }, []);

    if (!location.state) {
        return <Navigate to='/' />
    }

    const show = () => {
        let userList = document.querySelector(".userList");
        userList.style.transform = "scaleY(1)"
    }
    const hide = () => {
        let userList = document.querySelector(".userList");
        userList.style.transform = "scaleY(0)"
    }

    const copyRoomId=async ()=>{
        try{
          await navigator.clipboard.writeText(roomId)
          toast.success("RoomId has been copied")
        }catch(err){
            toast.error("Could not copied roomId")
        }
    }

    const leaveroom=()=>{
        navigate('/');
    }
    return (
        <div className='editor'>
            <div className="userList">
                <div className="top">
                    <AiOutlineClose color='#f5f5f7' size="30px"
                        onClick={hide}
                    />
                </div>
                <div className="middle">
                    {client?.map((i) => {
                        return <User user={i.username} key={i}/>
                    })}


                </div>
                <div className='bottom'>
                    <button className='btn_f' onClick={copyRoomId}>Copy roomId</button>
                    <button className='btn_s' onClick={leaveroom}>Leave Room</button>
                </div>
            </div>



            <div className='text_editor'>
                <div className="first">
                    <h4
                        style={{ cursor: "pointer" }}
                        onClick={show}> <GoPrimitiveDot color='green+'/> Active users</h4>
                </div>
                <div className="second">
                    <CodeEditor socketRef={socketRef} coderef={(code)=>codeRef.current=code}/>
                </div>
            </div>
        </div>
    )
}

export default Editor
