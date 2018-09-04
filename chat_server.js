const express = require('express');
let app = express();
const path = require('path');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

let users = [];
let connections = [];
let sockets = [];

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'));
})

server.listen(PORT,()=>{
    console.log(`Listening on port : ${PORT}`);
})

io.sockets.on('connection',(socket)=>{

    //console.log(socket);
 //   console.log(`Number of sockets connected => ${connections.length}`);

    socket.on('disconnect', (data)=>{
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket),1);
   //     console.log(`Number of sockets connected => ${connections.length}`);
    });

    socket.on('send message',(data)=>{
        io.sockets.emit('new message',{message: data,username: socket.username});
    })

    socket.on('new user',(data, callback)=>{
        callback(true);
        socket.username = data;
        connections.push(socket);
        users.push(socket.username);
        updateUsernames();
    })

    function updateUsernames(){
        io.sockets.emit('get users',users);
    }

    // socket.on('message to user',(data)=>{
    //     io.sockets.emit(`send to ${data.username}`,data.message);
    // })
})