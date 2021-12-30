const socket = io('/')
let IsConnectedtoCustomer= false
//do we need two html? one for seller and one for buyer?
if(!IsConnectedtoCustomer){
  //take the next one from the queue
}

const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    console.log(IsConnectedtoCustomer)
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
    
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  if (!IsConnectedtoCustomer){
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
      IsConnectedtoCustomer=true
      console.log(IsConnectedtoCustomer)
    })
    call.on('close', () => {
      video.remove()
      IsConnectedtoCustomer=false
      console.log(IsConnectedtoCustomer)

    })

    peers[userId] = call}
  else{
    //join waiting room
    showWaitingRoom()
  }
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

//create new bool IsConnectedtoCustomer
//if it is false then peers can join else they are put into a waiting room and added to a queue/array/vector
//when one buyer disconnects then the next one of the queue can be popped and they can join
const hideWaitingRoom = () => {
  const waitingRoom = document.getElementById("waiting-room");
  // check that the waiting room is visible, before hiding
  // just to avoid weird state bugs
  if (!waitingRoom.classList.contains("hidden")) {
    waitingRoom.classList.toggle("hidden");
    
  }
};

const showWaitingRoom = () => {
  const waitingRoom = document.getElementById("waiting-room");
  // check that the waiting room is hidden, before showing
  // just to avoid weird state bugs
  if (waitingRoom.classList.contains("hidden")) {
    waitingRoom.classList.toggle("hidden");
  }
};