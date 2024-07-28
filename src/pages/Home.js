import React, { useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
const Home = () => {
    const navigate = useNavigate()
    const [roomId,setRoomId]=useState("");
    const [username,setusername]=useState('')
    const createNewRoom=(e)=>{
        e.preventDefault()
        const id=uuidv4()
        setRoomId(id)
        toast.success('Created a new Room')

    }
    const joinRoom = ()=>{
        if(!roomId || !username){
            toast.error("Room Id or username is required")
            return 
        }
        else{
            //redirect
            //state is used here to pass data from one route to another route
            navigate(`/editor/${roomId}`,{
                state:{
                    username,
                }
            })
        }
    }
    const handleInputEnter=(e)=>{
        if (e.code==='Enter'){
            joinRoom()
        }

    }
    return (
        <div className='homePageWrapper'>
            <div className="formWrapper">
                <p className='logo'>
                    CodeFlow
                </p>
                <h4 className='mainLabel'>
                    Enter Room ID
                </h4>
                <div className="inputGroup">
                    <input className="inputBox" type="text" name="
                " id="" placeholder='ROOM ID' 
                value={roomId} onChange={(e)=>setRoomId(e.target.value)} onKeyUp={handleInputEnter}/>

                    <input className="inputBox" type="text" name="
                " id="" placeholder='username' onChange={(e)=>setusername(e.target.value)}
                value={username} onKeyUp={handleInputEnter}/>

                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join

                    </button>
                    <span className='createInfo'>
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href=""
                            className="createNewBtn"
                        >
                            new room
                        </a>

                    </span>

                </div>
            </div>
        </div>
    )
}

export default Home