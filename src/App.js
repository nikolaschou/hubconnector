import React, {useEffect} from 'react';
import Rtc from './lib/rtc';
import './App.css';

function App() {
  useEffect(() => {
    const rtc = new Rtc();
    rtc.init();
  }, []);
  return (
    <div className="App">
      <div id="container">

        <video id="localVideo" autoPlay></video>
        <video id="remoteVideo" autoPlay></video>

        <div className="box">
          <button id="startButton">Start</button>
          <button id="callButton">Call</button>
          <button id="hangupButton">Hang Up</button>
        </div>
      </div>
    </div>
  );
}

export default App;
