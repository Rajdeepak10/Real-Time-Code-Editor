const {Server}=require('socket.io')
const express = require('express')
const app=express()
//creating http server of express app
const http=require('http')
const { Socket } = require('socket.io-client')
const { log } = require('console')
const ACTIONS = require('./src/actions')
const path = require('path')
const server = http.createServer(app)

// we are serving static build index.html file thorugh express server
// if any request comes on local host 5000 index.html automatically gets serve
// so we use express in bult middleware
app.use(express.static('build'))
// all request coming on server should be send back to index.html
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'build','index.html'))
})
const io=new Server(server)
const userSocketMap={}
function getAllConnectedClients(roomId){
    //map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username:userSocketMap[socketId]
        }
    })

}
io.on('connection',(socket)=>{
    console.log('socket connected',socket.id);


    socket.on(ACTIONS.JOIN,({roomId,username})=>{
    userSocketMap[socket.id]=username 
    console.log(username);
    socket.join(roomId)
    const clients = getAllConnectedClients(roomId)
    console.log(clients);
    clients.forEach(({socketId})=>{
        io.to(socketId).emit(ACTIONS.JOINED,{
            clients,
            username:username,
            socketId:socket.id
        })

    })
    })

    socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{
            code
        })
    })
    socket.on(ACTIONS.SYNC_CODE,({socketId,code})=>{
        io.to(socketId).emit(ACTIONS.CODE_CHANGE,{
            code
        })
    })


    socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms]
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId:socket.id,
                username:userSocketMap[socket.id]
            })
        })
        delete userSocketMap[socket.id]
        socket.leave()
    })
})



const PORT=process.env.PORT || 5000
server.listen(PORT,()=>{
    console.log(`listening of port ${PORT}`)
})
