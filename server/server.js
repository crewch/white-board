const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
	cors: {
		origin: 'http://localhost:3000',
	},
})

io.on('connection', socket => {
	console.log(`${socket.id} user connected`)

	socket.on('canvas-data', data => {
		socket.broadcast.emit('canvas-data', data)
	})
})

const server_port = 5000
http.listen(server_port, () => {
	console.log(`Started on: ${server_port}`)
})
