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
    gainNode1.gain.value = 1; // Track 1 starts fully on
    gainNode2.gain.value = 0; // Track 2 starts fully off
    gainNode1.connect(audioContext.destination);
    gainNode2.connect(audioContext.destination);
  }
}

// Load audio files and decode them into buffers
export function loadAudioFiles(files) {
  console.log("loadAudioFiles function was called");
  return new Promise((resolve, reject) => {
    const filePromises = [];

    // Loop through the files to load each one
    files.forEach((file, index) => {
      const promise = new Promise((fileResolve, fileReject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          audioContext.decodeAudioData(e.target.result, (buffer) => {
            if (index === 0) {
              buffer1 = buffer;
              console.log("Buffer for audio file 1 loaded.");
            } else {
              buffer2 = buffer;
              console.log("Buffer for audio file 2 loaded.");
            }
            fileResolve();
          }, (error) => {
            console.error("Error decoding audio data:", error);
            fileReject(error);
          });
        };
        reader.readAsArrayBuffer(file);
      });
      filePromises.push(promise);
    });

    // Wait for all files to be loaded
    Promise.all(filePromises).then(resolve).catch(reject);
  });
}

// Create a new AudioBufferSourceNode and connect it to the appropriate gain node
function createSource(buffer, gainNode) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(gainNode);  // Connect the source to the gain node, not the destination
  return source;
}

// Start playback for both audio sources
export function playAudio() {
  if (!buffer1 || !buffer2) {
    console.error("Buffers are not loaded yet.");
    return; // Exit if buffers are not loaded
  }

  try {
    console.log("Audio Context State:", audioContext.state);

    if (audioContext.state === 'suspended') {
      console.log("Resuming Audio Context...");
      audioContext.resume();
    }

    // Stop and disconnect existing sources before playing new ones
    if (audioSource1) {
      audioSource1.stop();
      audioSource1.disconnect();
    }

    if (audioSource2) {
      audioSource2.stop();
      audioSource2.disconnect();
    }

    // Create and start new audio sources
    audioSource1 = createSource(buffer1, gainNode1);
    audioSource2 = createSource(buffer2, gainNode2);
    audioSource1.start(0);
    audioSource2.start(0);

    console.log("Started playback for both audio sources.");

    isPlaying = true;
  } catch (error) {
    console.error("Error in playAudio:", error);
  }
}

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
  // Calculate the gain values for both tracks based on the crossfade slider
  const gain1 = 1 - value;  // Track 1 fades out as value increases
  const gain2 = value;      // Track 2 fades in as value increases

  // Apply the gain changes smoothly
  gainNode1.gain.setValueAtTime(gain1, audioContext.currentTime);  // Fade track 1 out
  gainNode2.gain.setValueAtTime(gain2, audioContext.currentTime);  // Fade track 2 in

  console.log(`Gain 1: ${gain1}, Gain 2: ${gain2}`); // Log th
}
