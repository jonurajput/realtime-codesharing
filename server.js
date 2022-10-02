const express = require("express")

const app = express();
const http = require("http");
const path = require("path");
const { Server } = require('socket.io');
const ACTIONS = require("./src/Action");

const server = http.createServer(app)

const io = new Server(server);


const userSocketMap = {};

const getAllConnectedClient = (roomId) => {
  //io.sockets.adapter.rooms: this will return  all rooms list.basically room contain socketID of all connected users
  //io.sockets.adapter.rooms.get(roomId):it return that particular rooom having given roomId and this room has map dataype so Array.from convert map dataype into array
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
    return {
      socketId,
      username: userSocketMap[socketId]
    }
  })
}

io.on('connection', (socket) => {
  console.log("socket connected", socket.id)
  let id = socket.id
  let roomid;
  let user;
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId); //it will create join the socket in the room having name roomId if room is already present if not it create new room and joined the given socket init
    roomid=roomId;
    user=username;
    const clients = getAllConnectedClient(roomId)
    
    clients.forEach((i) => {
      //this will emit the event to user having given socketId
      io.to(i.socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketID: socket.id,
        
      })
    });
  });

  //get code
  socket.on(ACTIONS.CODE_CHANGE,({value})=>{
    code=value;
    //socket.in emit the event to all user in given roomId except the current socket
    socket.in(roomid).emit(ACTIONS.CODE_CHANGE,{
      value1:value
    })
  })

  socket.on(ACTIONS.SYNC_CODE,({code,socketID})=>{
    console.log(code,socketID)
      io.to(socketID).emit(ACTIONS.CODE_CHANGE,{
        value1:code
      })
  })
  socket.on('disconnecting',()=>{
    console.log('user has leaved',socket.id,user,roomid)
    // const rooms=[...socket.rooms] it will return all rooms in which this socket has been present by default it i single room
    socket.in(roomid).emit(ACTIONS.DISCONNECTED,{
      id,username:user
    })
    delete userSocketMap[socket.id]
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;

const __dirname1=path.resolve()
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname1,"/build")));
  app.get('*',(req,res)=>{
     res.sendFile(path.resolve(__dirname1,'build','index.html'));
  })
}else{
  app.get("/",(req,res)=>{
    res.send("api running successfully")
  })
}
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

