// src/app.js
console.log("App.js is loaded");

import './styles/style.css'; // Import CSS
import WaveSurfer from 'wavesurfer.js'; // Import WaveSurfer
import { initAudioContext, loadAudioFile, playAudio, pauseAudio, stopAudio } from './audioController.js';
import { enableDragAndDrop } from './utils.js';

// Get HTML elements
const audioFile1 = document.getElementById("audioFile1");
const audioFile2 = document.getElementById("audioFile2");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");
const crossfadeSlider = document.getElementById("crossfade");

// Initialize WaveSurfer instances for visualizing waveforms
const waveSurfer1 = WaveSurfer.create({
  container: '#waveform1',
  waveColor: '#fccf04',
  progressColor: '#9104FC',
  height: 80,
  responsive: true,
});

const waveSurfer2 = WaveSurfer.create({
  container: '#waveform2',
  waveColor: '#fccf04',
  progressColor: '#9104FC',
  height: 80,
  responsive: true,
});

// Initialize audio context and enable drag-and-drop for both upload areas
function initializeMixer() {
  initAudioContext(); // Initialize audio context
  enableDragAndDrop(document.getElementById("fileUpload1"), audioFile1);
  enableDragAndDrop(document.getElementById("fileUpload2"), audioFile2);
  console.log("Mixer initialized and drag-and-drop enabled.");
}

// Function to load audio file into WaveSurfer instance
function loadFileToWaveSurfer(file, waveSurferInstance, fileNameElement) {
  const fileURL = URL.createObjectURL(file);
  waveSurferInstance.load(fileURL);
  console.log("WaveSurfer is loading file:", file.name);
  fileNameElement.textContent = file.name;
}

// Load files and play, pause, stop controls
// Event listeners for file uploads
audioFile1.addEventListener("change", (e) => {
  console.log("Audio file 1 selected:", e.target.files[0].name);
  loadFileToWaveSurfer(e.target.files[0], waveSurfer1, document.getElementById("fileName1"));
});

audioFile2.addEventListener("change", (e) => {
  console.log("Audio file 2 selected:", e.target.files[0].name);
  loadFileToWaveSurfer(e.target.files[0], waveSurfer2, document.getElementById("fileName2"));
});

// Playback controls
playButton.addEventListener("click", () => {
  console.log("Play button clicked.");
  playAudio();
  console.log("Playing audio through WaveSurfer instances.");
  waveSurfer1.play();
  waveSurfer2.play();
});

pauseButton.addEventListener("click", () => {
  console.log("Pause button clicked.");
  pauseAudio();
  waveSurfer1.pause();
  waveSurfer2.pause();
});

stopButton.addEventListener("click", () => {
  console.log("Stop button clicked.");
  stopAudio();
  waveSurfer1.stop();
  waveSurfer2.stop();
});

// Crossfade control function
function setCrossfade(value) {
  // The crossfade slider should range from 0 to 1 or -1 to 1, depending on your preference
  // For this example, let's assume the slider goes from 0 (all waveSurfer1) to 1 (all waveSurfer2)
  
  const volume1 = 1 - value; // When slider is 0, volume1 is 1; when slider is 1, volume1 is 0
  const volume2 = value;     // When slider is 0, volume2 is 0; when slider is 1, volume2 is 1

  waveSurfer1.setVolume(volume1); // Set volume for waveSurfer1
  waveSurfer2.setVolume(volume2); // Set volume for waveSurfer2

  console.log(`Crossfade set: waveSurfer1 volume = ${volume1}, waveSurfer2 volume = ${volume2}`);
}

// Event listener for crossfade slider
crossfadeSlider.addEventListener("input", (e) => {
  const value = parseFloat(e.target.value);
  console.log("Crossfade slider adjusted to:", value);
  setCrossfade(value); // Update crossfade based on slider value
});

// Start the mixer setup
initializeMixer();
