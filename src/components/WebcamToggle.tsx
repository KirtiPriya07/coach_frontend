"use client";

import React, { useState } from "react";
import Webcam from "react-webcam";
import VideoIcon from "@/components/VideoIcon";

const WebcamToggle: React.FC = () => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  const toggleWebcam = () => {
    setIsWebcamActive((prev) => !prev);
  };

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      {/* Button to toggle the webcam */}
      <button
        onClick={toggleWebcam}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "10px",
        }}
      >
        <VideoIcon width={32} height={32} color="#0070f3" />
      </button>

      {/* Webcam feed */}
      {isWebcamActive && (
        <div
          style={{
            border: "2px solid #ccc",
            borderRadius: "8px",
            maxWidth: "640px",
            margin: "20px auto",
            padding: "10px",
          }}
        >
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        </div>
      )}
    </div>
  );
};

export default WebcamToggle;
