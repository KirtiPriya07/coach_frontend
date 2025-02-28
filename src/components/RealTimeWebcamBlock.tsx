"use client";

import React from "react";
import Webcam from "react-webcam";

const RealTimeWebcamBlock: React.FC = () => {
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <div
      style={{
        border: "2px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
        maxWidth: "640px",
        margin: "20px auto",
      }}
    >
      <Webcam
        audio={false}
        height={480}
        width={640}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
    </div>
  );
};

export default RealTimeWebcamBlock;
