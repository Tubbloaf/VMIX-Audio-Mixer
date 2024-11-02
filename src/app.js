// src/app.js
console.log("App.js is loaded");

import './styles/style.css'; // Import CSS
import WaveSurfer from 'wavesurfer.js'; // Import WaveSurfer
import { initAudioContext, loadAudioFile, playAudio, pauseAudio, stopAudio, setCrossfade } from './audioController.js';
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
}

// Function to load audio file into WaveSurfer instance
function loadFileToWaveSurfer(file, waveSurferInstance, fileNameElement) {
  const fileURL = URL.createObjectURL(file);
  waveSurferInstance.load(fileURL);
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
  initAudioContext();  // Ensures context is ready before playing
  playAudio();
  waveSurfer1.play();
  waveSurfer2.play();
});
pauseButton.addEventListener("click", () => {
  pauseAudio();
  waveSurfer1.pause();
  waveSurfer2.pause();
});
stopButton.addEventListener("click", () => {
  stopAudio();
  waveSurfer1.stop();
  waveSurfer2.stop();
});
crossfadeSlider.addEventListener("input", (e) => setCrossfade(parseFloat(e.target.value)));

// Start the mixer setup
initializeMixer();
