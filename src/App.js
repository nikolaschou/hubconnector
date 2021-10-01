import React, { useEffect, useState } from 'react';
import './App.css';
import { DiffCamEngine } from './lib/diff-cam-engine';

const App = () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("motion");
  let motionCount = 0;
  const motionScoreList = [];

  const initSuccess = () => {
    DiffCamEngine.start();
  }

  const initError = () => {
    alert("Something went wrong.");
  }

  const capture = (payload) => {
    motionCount++;
    if (motionCount === 50) {
      motionScoreList.push(payload.score);
      if (motionScoreList.length > 6) {
        motionScoreList.shift();
      }
      const sum = motionScoreList.reduce((partial_sum, a) => partial_sum + a, 0);
      if (sum > 30) {
        console.log("STREAMING");
      } else {
        console.log("IDLE");
      }
      console.log(motionScoreList);
      motionCount = 0;
    }
  }

  DiffCamEngine.init({
    video: video,
    motionCanvas: canvas,
    initSuccessCallback: initSuccess,
    initErrorCallback: initError,
    captureCallback: capture,
  });

  const [members, setMembers] = useState([]);
  const [page, setPage] = useState('home');
  const [streamState, setStreamState] = useState();
  const configuration = {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  };
  let pc = new RTCPeerConnection(configuration);
  let room;
  useEffect(() => {
    if (page === 'room') {
      const location = window.location;
      const ScaleDrone = window.ScaleDrone;
      const remoteVideo = window.remoteVideo;
      const localVideo = window.localVideo;
      if (!location.hash) {
        location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
      }
      const roomHash = location.hash.substring(1);

      // TODO: Replace with your own channel ID
      const drone = new ScaleDrone('yiS12Ts5RdNhebyM');
      const roomName = 'observable-' + roomHash;
      //pc = new RTCPeerConnection(configuration);


      const onSuccess = () => { };
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
          console.log('MEMBERS', roomMembers);
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
            sendMessage({ 'candidate': event.candidate });
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
          setStreamState(stream)
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
          () => sendMessage({ 'sdp': pc.localDescription }),
          onError
        );
      }

    }
  }, [page]);

  const getHeader = () => {
    return (
      <div style={{ float: 'left' }}>
        <div style={{ float: 'left', padding: '10px', cursor: 'pointer' }} onClick={() => setPage('home')}>Home</div>
        <div style={{ float: 'left', padding: '10px', cursor: 'pointer' }} onClick={() => setPage('room')}>Room</div>
      </div>
    )
  }

  switch (page) {
    case 'room':
      return (
        <div className="App">
          {getHeader()}
          <div id="container">
            <video id="localVideo" autoPlay muted></video>
            <video id="remoteVideo" autoPlay></video>
            <button onClick={() => pc.close(streamState)}>Close</button>
          </div>
        </div>
      );
    default:
      return (
        <div className="App">
          {getHeader()}
        </div>
      );
  }
}

export default App;
