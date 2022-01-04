const express = require('express')
const app = express()
const server = require('http').Server(app)

/*

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDM468SLZTw3AuOJx0v0OWQkLl6DWSSQ2k",
  authDomain: "liveconnect-21ca0.firebaseapp.com",
  projectId: "liveconnect-21ca0",
  storageBucket: "liveconnect-21ca0.appspot.com",
  messagingSenderId: "791779105797",
  appId: "1:791779105797:web:b935917b8afd484a32506c",
  measurementId: "G-DE49WCS1E1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/

//adding code for external server
/*const fs=require('fs');
const server= require('https').createServer({
  key:fs.readFileSync('/path/to/ssl/cert/key'),
  cert: fs.readFileSync('/path/sslcertcer')
},app)*/
//till here


const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
  //add waiting room functionality
  socket.on('join-waiting',(roomId, userId)=>{
    socket.to(roomId).broadcast.emit('user-in-waiting',userId)
    socket.on('get-waiting-user',(roomId, userId)=>{
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId)

      socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
    })
  })
  //end here
})
server.listen(3000)