const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {adduser, removeuser, getuser, getusersinroom} = require("./utils/users")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../templates')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // function to join 
    socket.on("join", ({username, room}, callback) => {

            const {error,user} = adduser({id:socket.id, username, room})

            if (error) {
                    callback(error)
            }


            socket.join(user.room)

            socket.emit('message', generateMessage("Admin",'Welcome!'))
            socket.broadcast.to(user.room).emit('message', generateMessage("Admin",`${user.username} has joined!`))
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getusersinroom(user.room)
            })
            callback()

            // socket.emit //io.to.emit
            // socket.io  //socket.broadcast.to.emit
            // socket.broadcast.emit


    })

    socket.on('sendMessage', (message, callback) => {
        const user = getuser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getuser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeuser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage("Admin",`${user.username} has left`))
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getusersinroom(user.room)
            })
        }

    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})