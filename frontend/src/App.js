import React, { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function setupCamera() {
      const video = videoRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      video.srcObject = stream;
      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          resolve(video);
        };
      });
      video.play();
    }

    async function loadModel() {
      return await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
    }

    async function detectPose(detector) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      async function frame() {
        const poses = await detector.estimatePoses(video);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        poses.forEach((pose) => {
          pose.keypoints.forEach((keypoint) => {
            if (keypoint.score > 0.5) {
              const { x, y } = keypoint;
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, 2 * Math.PI);
              ctx.fillStyle = 'red';
              ctx.fill();
            }
          });
        });

        requestAnimationFrame(frame);
      }

      frame();
    }

    setupCamera().then(() => {
      loadModel().then((detector) => {
        detectPose(detector);
      });
    });
  }, []);

  return (
    <div className="App">
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;

