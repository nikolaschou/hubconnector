/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
export default class Rtc {
    constructor() {
        this.offerOptions = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        };
    };

    init = () => {
        this.startButton = document.getElementById('startButton');
        this.callButton = document.getElementById('callButton');
        this.hangupButton = document.getElementById('hangupButton');
        this.callButton.disabled = true;
        this.hangupButton.disabled = true;
        this.startButton.addEventListener('click', () => this.start(this));
        this.callButton.addEventListener('click', () => this.call(this));
        this.hangupButton.addEventListener('click', () => this.hangup(this));

        this.localVideo = document.getElementById('localVideo');
        this.remoteVideo = document.getElementById('remoteVideo');

        this.localVideo.addEventListener('loadedmetadata', () => {
            console.log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
        });

        this.remoteVideo.addEventListener('loadedmetadata', () => {
            console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
        });

        this.remoteVideo.addEventListener('resize', () => {
            console.log(`Remote video size changed to ${this.remoteVideo.videoWidth}x${this.remoteVideo.videoHeight}`);
            // We'll use the first onsize callback as an indication that video has started
            // playing out.
            if (this.startTime) {
                const elapsedTime = window.performance.now() - this.startTime;
                console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
                this.startTime = null;
            }
        });
    }

    getName(pc) {
        return (pc === this.pc1) ? 'this.pc1' : 'this.pc2';
    }

    getOtherPc(pc) {
        return (pc === this.pc1) ? this.pc2 : this.pc1;
    }

    async start(self) {
        console.log('Requesting local stream');
        self.startButton = document.getElementById('startButton');
        self.callButton = document.getElementById('callButton');
        self.hangupButton = document.getElementById('hangupButton');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            console.log('Received local stream');
            self.localVideo.srcObject = stream;
            self.localStream = stream;
            self.callButton.disabled = false;
        } catch (e) {
            alert(`getUserMedia() error: ${e.name}`);
        }
    }

    async call(self) {
      self.callButton.disabled = true;
      self.hangupButton.disabled = false;
        console.log('Starting call');
        self.startTime = window.performance.now();
        const videoTracks = self.localStream.getVideoTracks();
        const audioTracks = self.localStream.getAudioTracks();
        if (videoTracks.length > 0) {
            console.log(`Using video device: ${videoTracks[0].label}`);
        }
        if (audioTracks.length > 0) {
            console.log(`Using audio device: ${audioTracks[0].label}`);
        }
        const configuration = {};
        console.log('RTCPeerConnection configuration:', configuration);
        self.pc1 = new RTCPeerConnection(configuration);
        console.log('Created local peer connection object pc1');
        self.pc1.addEventListener('icecandidate', e => self.onIceCandidate(self.pc1, e));
        self.pc2 = new RTCPeerConnection(configuration);
        console.log('Created remote peer connection object pc2');
        self.pc2.addEventListener('icecandidate', e => self.onIceCandidate(self.pc2, e));
        self.pc1.addEventListener('iceconnectionstatechange', e => self.onIceStateChange(self.pc1, e));
        self.pc2.addEventListener('iceconnectionstatechange', e => self.onIceStateChange(self.pc2, e));
        self.pc2.addEventListener('track', (e) => self.gotRemoteStream(e, self));

        self.localStream.getTracks().forEach(track => self.pc1.addTrack(track, self.localStream));
        console.log('Added local stream to pc1');

        try {
            console.log('pc1 createOffer start');
            const offer = await self.pc1.createOffer(self.offerOptions);
            await self.onCreateOfferSuccess(offer);
        } catch (e) {
          self.onCreateSessionDescriptionError(e);
        }
    }

    onCreateSessionDescriptionError(error) {
        console.log(`Failed to create session description: ${error.toString()}`);
    }

    async onCreateOfferSuccess(desc) {
        console.log(`Offer from this.pc1\n${desc.sdp}`);
        console.log('this.pc1 setLocalDescription start');
        try {
            await this.pc1.setLocalDescription(desc);
            this.onSetLocalSuccess(this.pc1);
        } catch (e) {
            this.onSetSessionDescriptionError();
        }

        console.log('this.pc2 setRemoteDescription start');
        try {
            await this.pc2.setRemoteDescription(desc);
            this.onSetRemoteSuccess(this.pc2);
        } catch (e) {
            this.onSetSessionDescriptionError();
        }

        console.log('this.pc2 createAnswer start');
        // Since the 'remote' side has no media stream we need
        // to pass in the right constraints in order for it to
        // accept the incoming offer of audio and video.
        try {
            const answer = await this.pc2.createAnswer();
            await this.onCreateAnswerSuccess(answer);
        } catch (e) {
            this.onCreateSessionDescriptionError(e);
        }
    }

    onSetLocalSuccess(pc) {
        console.log(`${this.getName(pc)} setLocalDescription complete`);
    }

    onSetRemoteSuccess(pc) {
        console.log(`${this.getName(pc)} setRemoteDescription complete`);
    }

    onSetSessionDescriptionError(error) {
        console.log(`Failed to set session description: ${error.toString()}`);
    }

    gotRemoteStream(e, self) {
        if (self.remoteVideo.srcObject !== e.streams[0]) {
            self.remoteVideo.srcObject = e.streams[0];
            console.log('pc2 received remote stream');
        }
    }

    async onCreateAnswerSuccess(desc) {
        console.log(`Answer from this.pc2:\n${desc.sdp}`);
        console.log('this.pc2 setLocalDescription start');
        try {
            await this.pc2.setLocalDescription(desc);
            this.onSetLocalSuccess(this.pc2);
        } catch (e) {
            this.onSetSessionDescriptionError(e);
        }
        console.log('this.pc1 setRemoteDescription start');
        try {
            await this.pc1.setRemoteDescription(desc);
            this.onSetRemoteSuccess(this.pc1);
        } catch (e) {
            this.onSetSessionDescriptionError(e);
        }
    }

    async onIceCandidate(pc, event) {
        try {
            await (this.getOtherPc(pc).addIceCandidate(event.candidate));
            this.onAddIceCandidateSuccess(pc);
        } catch (e) {
            this.onAddIceCandidateError(pc, e);
        }
        console.log(`${this.getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
    }

    onAddIceCandidateSuccess(pc) {
        console.log(`${this.getName(pc)} addIceCandidate success`);
    }

    onAddIceCandidateError(pc, error) {
        console.log(`${this.getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
    }

    onIceStateChange(pc, event) {
        if (pc) {
            console.log(`${this.getName(pc)} ICE state: ${pc.iceConnectionState}`);
            console.log('ICE state change event: ', event);
        }
    }

    hangup() {
        console.log('Ending call');
        this.pc1.close();
        this.pc2.close();
        this.pc1 = null;
        this.pc2 = null;
        this.hangupButton.disabled = true;
        this.callButton.disabled = false;
    }
}
