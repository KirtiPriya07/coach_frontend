"use client";

import React, { useState, useRef, useEffect, useContext } from "react";
import Webcam from "react-webcam";
import { RoomContext } from "@livekit/components-react";
import VideoIcon from "@/components/VideoIcon";

// Custom hook to access the current LiveKit room from the context.
const useRoom = () => {
  return useContext(RoomContext);
};

const WebcamToggle: React.FC = () => {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [publishedTrack, setPublishedTrack] = useState<MediaStreamTrack | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const room = useRoom();

  const toggleWebcam = async () => {
    if (isWebcamActive) {
      // Unpublish and stop the video track if active.
      if (publishedTrack && room?.localParticipant) {
        try {
          await room.localParticipant.unpublishTrack(publishedTrack);
          publishedTrack.stop();
        } catch (err) {
          console.error("Error unpublishing track:", err);
        }
      }
      setIsWebcamActive(false);
      setPublishedTrack(null);
    } else {
      // Activate the webcam.
      setIsWebcamActive(true);
    }
  };

  // Publish the webcam video track when active.
  useEffect(() => {
    async function publishWebcamTrack() {
      if (isWebcamActive && webcamRef.current && room && !publishedTrack) {
        const videoEl = webcamRef.current.video;
        if (!videoEl) {
          console.warn("Webcam video element not ready");
          return;
        }
        // Wait until the video element has loaded data.
        await new Promise((resolve) => {
          if (videoEl.readyState >= 3) {
            resolve(null);
          } else {
            videoEl.addEventListener("loadeddata", resolve, { once: true });
          }
        });
        if (videoEl && videoEl.srcObject) {
          const stream = videoEl.srcObject as MediaStream;
          const videoTracks = stream.getVideoTracks();
          if (videoTracks.length > 0) {
            const track = videoTracks[0];
            try {
              await room.localParticipant.publishTrack(track);
              setPublishedTrack(track);
            } catch (err) {
              console.error("Failed to publish video track:", err);
            }
          }
        }
      }
    }
    publishWebcamTrack();
  }, [isWebcamActive, room, publishedTrack]);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
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
            ref={webcamRef}
          />
        </div>
      )}
    </div>
  );
};

export default WebcamToggle;
