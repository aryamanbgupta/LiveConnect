const socket = io('/')
let IsConnectedtoCustomer= false
//do we need two html? one for seller and one for buyer?
//Check if buyer is present?

const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

let CustomerQueue=[]
if(!IsConnectedtoCustomer){
  //take the next one from the queue 
  if(CustomerQueue[0]!=null){
    //make the userid at postion 1 join the room
    let newUserID= CustomerQueue[0]
    //make newUserID join the connection? need to use server.js?
    //redirect from waiting room to the meeting
  }
}
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  if(!IsConnectedtoCustomer){
    addVideoStream(myVideo, stream)
  }
  myPeer.on('call', call => {
    //console.log(IsConnectedtoCustomer)
    if(!IsConnectedtoCustomer){
      call.answer(stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
      IsConnectedtoCustomer=true
    }
    
  })

  socket.on('user-connected', userId => {
    //if(!IsConnectedtoCustomer){
     // IsConnectedtoCustomer=true
      connectToNewUser(userId, stream)
    //}
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
  IsConnectedtoCustomer=false
  socket.emit('get-waiting-user')
})

myPeer.on('open', id => {
  if(!IsConnectedtoCustomer)
    socket.emit('join-room', ROOM_ID, id)
  else {
    let i=0
    while(CustomerQueue[i]!=null) i++
    CustomerQueue[i]=id
    socket.emit('join-waiting',ROOM_ID,id)
  }
})

function connectToNewUser(userId, stream) {
  if (!IsConnectedtoCustomer){
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
      document.getElementById("DispUser").innerHTML=userId
      IsConnectedtoCustomer=true
      //console.log(IsConnectedtoCustomer)
    })
    call.on('close', () => {
      video.remove()
      //IsConnectedtoCustomer=false
      //console.log(IsConnectedtoCustomer)

    })

    peers[userId] = call
  }
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
