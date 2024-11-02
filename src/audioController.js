// src/audioController.js

let audioContext;
let audioSource1, audioSource2;
let gainNode1, gainNode2;
let buffer1, buffer2;
let isPlaying = false;

// Initialize Audio Context and Gain Nodes
export function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode1 = audioContext.createGain();
    gainNode2 = audioContext.createGain();
    gainNode1.gain.value = 1;
    gainNode2.gain.value = 1;
  }
}

// Load audio file and decode it into a buffer
export function loadAudioFile(file, sourceIndex) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      audioContext.decodeAudioData(e.target.result, (buffer) => {
        if (sourceIndex === 1) {
          buffer1 = buffer;
          console.log("Buffer for audio file 1 loaded.");
        } else if (sourceIndex === 2) {
          buffer2 = buffer;
          console.log("Buffer for audio file 2 loaded.");
        }
        resolve();
      }, (error) => {
        console.error("Error decoding audio data:", error);
        reject(error);
      });
    };
    reader.readAsArrayBuffer(file);
  });
}



// Create a new AudioBufferSourceNode
function createSource(buffer, gainNode) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(gainNode).connect(audioContext.destination);
  return source;
}

// Start playback for both audio sources
export function playAudio() {
  if (!isPlaying) {
    if (buffer1) {
      audioSource1 = createSource(buffer1, gainNode1);
      console.log("Playing audio source 1.");
    }
    if (buffer2) {
      audioSource2 = createSource(buffer2, gainNode2);
      console.log("Playing audio source 2.");
    }
    if (audioSource1) audioSource1.start(0);
    if (audioSource2) audioSource2.start(0);
    isPlaying = true;
  } else {
    console.log("Audio is already playing.");
  }
}



// Pause playback for both audio sources
export function pauseAudio() {
  if (isPlaying) {
    if (audioSource1) {
      audioSource1.stop();
      audioSource1 = null;
    }
    if (audioSource2) {
      audioSource2.stop();
      audioSource2 = null;
    }
    isPlaying = false;
  }
}


// Stop playback for both audio sources
export function stopAudio() {
  if (isPlaying) {
    if (audioSource1) {
      audioSource1.stop();
      audioSource1 = null;
    }
    if (audioSource2) {
      audioSource2.stop();
      audioSource2 = null;
    }
    isPlaying = false;
  }
}

// Crossfade between the two tracks
export function setCrossfade(value) {
  const gain1 = 1 - value;
  const gain2 = value;
  gainNode1.gain.setValueAtTime(gain1, audioContext.currentTime);
  gainNode2.gain.setValueAtTime(gain2, audioContext.currentTime);
}
