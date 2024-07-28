import React, { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import Client from '../Components/Client'
import Editor from '../Components/Editor'
import { initSocket } from '../socket'
import ACTIONS from '../actions'
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom'
const EditorPage = () => {
    const codeRef=useRef(null)
    const { roomId } = useParams()
    const [clients, setClients] = useState([])
    const socketRef = useRef(null)
    const location = useLocation()
    const reactNavigator = useNavigate()
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket()
            socketRef.current.on('connect_error', (err) => handleErrors(err))
            socketRef.current.on('connect_failed', (err) => handleErrors(err))
            function handleErrors(e) {
                console.log('socket error', e)
                toast.error('Socket Connection Failed,try again later')
                reactNavigator('/')
            }
            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username
            })
            //listening to joined event
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room`)
                    console.log(`${username} joined`)
                }
                setClients(clients)
                socketRef.current.emit(ACTIONS.SYNC_CODE,{
                    code:codeRef.current,
                    socketId,
                }
                )
            })
            //
            //listening to disconnected event
            socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
                toast.success(`${username} left the room`)
                setClients((prev)=>{
                    return prev.filter((client)=>client.socketId!==socketId)
                })
            })
        }
        init()
        // returning cleaning function
        return ()=>{
            socketRef.current.disconnect()
            socketRef.current.off(ACTIONS.JOINED)
            socketRef.current.off(ACTIONS.DISCONNECTED)

        }
    }, [])


    if (!location.state) {
        return <Navigate to='/' />
    }
    async function copyRoomId(){
        try {
            await navigator.clipboard.writeText(roomId)
            toast.success("Copied Successfully")

            
        } catch (error) {
            toast.error("Can not copied room id");
            console.log(error);            
        }

    }
    function leaveRoom(){
        reactNavigator('/')
    }
    return (
        <div className='mainWrap'>
            <div className='aside'>
                <div className="asideInner">
                    <div>
                        <p className='editorLogo'>
                            CodeFlow
                        </p>
                    </div>
                    <h3>
                        Connected
                    </h3>
                    <div className='clientsList'>
                        {
                            clients.map(client => <Client key={client.socketId} username={client.username} />)
                        }
                    </div>
                </div>
                <button className='btn copyBtn' onClick={copyRoomId}>COPY ROOM ID</button>
                <button className='btn leaveBtn' onClick={leaveRoom}>LEAVE ROOM</button>
            </div>
            <div className='editorWrap'>
                <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{codeRef.current=code}}/>
            </div>

        </div>
    )
}

export default EditorPage