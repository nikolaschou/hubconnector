import React, {useEffect, useState} from 'react';
import './App.css';

const App = () => {
  const [members, setMembers] = useState([]);
  const configuration = {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  };
  let pc = new RTCPeerConnection(configuration);
  let room;

  useEffect(() => {
    const location = window.location;
    const ScaleDrone = window.ScaleDrone;
    const remoteVideo = window.remoteVideo;
    const localVideo = window.localVideo;
    if (!location.hash) {
      location.hash = 'hall';// Math.floor(Math.random() * 0xFFFFFF).toString(16);
    }
    const roomHash = location.hash.substring(1);
    
    // TODO: Replace with your own channel ID
    const drone = new ScaleDrone('yiS12Ts5RdNhebyM');
    const roomName = 'observable-' + roomHash;
    //pc = new RTCPeerConnection(configuration);
    
    
    const onSuccess = () => {};
    const onError = (error) => {
      console.error(error);
    };
    
    drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      room = drone.subscribe(roomName);
      room.on('open', error => {
        if (error) {
          onError(error);
        }
      });
      // We're connected to the room and received an array of 'members'
      // connected to the room (including us). Signaling server is ready.
      room.on('members', roomMembers => {
        // If we are the second user to connect to the room we will be creating the offer
        const isOfferer = roomMembers.length > 1;
        setMembers(roomMembers);
        startWebRTC(isOfferer);
      });
    });
    
    // Send signaling data via Scaledrone
    const sendMessage = (message) => {
      drone.publish({
        room: roomName,
        message
      });
    }

    const startWebRTC = (isOfferer) => {
      // 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
      // message to the other peer through the signaling server
      pc.onicecandidate = event => {
        if (event.candidate) {
          sendMessage({'candidate': event.candidate});
        }
      };
    
      // If user is offerer let the 'negotiationneeded' event create the offer
      if (isOfferer) {
        pc.onnegotiationneeded = () => {
          pc.createOffer().then(localDescCreated).catch(onError);
        }
      }
    
      // When a remote stream arrives display it in the #remoteVideo element
      pc.ontrack = event => {
        const stream = event.streams[0];
        if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
          remoteVideo.srcObject = stream;
        }
      };
    
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      }).then(stream => {
        // Display your local video in #localVideo element
        localVideo.srcObject = stream;
        // Add your stream to be sent to the conneting peer
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
      }, onError);
    
      // Listen to signaling data from Scaledrone
      room.on('data', (message, client) => {
        // Message was sent by us
        if (client.id === drone.clientId) {
          return;
        }
    
        if (message.sdp) {
          // This is called after receiving an offer or answer from another peer
          pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
            // When receiving an offer lets answer it
            if (pc.remoteDescription.type === 'offer') {
              pc.createAnswer().then(localDescCreated).catch(onError);
            }
          }, onError);
        } else if (message.candidate) {
          // Add the new ICE candidate to our connections remote description
          pc.addIceCandidate(
            new RTCIceCandidate(message.candidate), onSuccess, onError
          );
        }
      });
    }
  
    const localDescCreated = (desc) => {
      pc.setLocalDescription(
        desc,
        () => sendMessage({'sdp': pc.localDescription}),
        onError
      );
    }
  }, []);
  console.log(members);
  return (
    <div id="container">
      <header>aaa</header>
      <div className="content">
        <video id="localVideo" autoPlay muted></video>
        <video id="remoteVideo" autoPlay></video>
      </div>
    </div>
  );
}

export default App;
