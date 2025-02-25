"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LiveKitRoom,
  useVoiceAssistant,
  BarVisualizer,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from "@livekit/components-react";
import { useCallback, useEffect, useState } from "react";
import { MediaDeviceFailure } from "livekit-client";
import type { ConnectionDetails } from "./api/connection-details/route";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import { CloseIcon } from "@/components/CloseIcon";
import VideoIcon from "@/components/VideoIcon";
import WebcamToggle from "@/components/WebcamToggle"; // Import our new component

export default function Page() {
  const [connectionDetails, updateConnectionDetails] = useState<ConnectionDetails | undefined>(undefined);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData = await response.json();
    updateConnectionDetails(connectionDetailsData);
  }, []);

  return (
    <main data-lk-theme="default" className="h-full bg-[var(--lk-bg)]">
      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={false} // initially, video is off
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={() => updateConnectionDetails(undefined)}
        className="h-full"
      >
        <div className="grid grid-cols-[2fr_1fr] h-full gap-4 p-4">
          {/* Left Column: Webcam Toggle */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            {agentState !== "disconnected" ? (
              <WebcamToggle />
            ) : (
              <p className="text-gray-500">
                Webcam will appear here after starting the conversation
              </p>
            )}
          </div>

          {/* Right Column: Voice Assistant and Controls */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <SimpleVoiceAssistant onStateChange={setAgentState} />
            <ControlBar onConnectButtonClicked={onConnectButtonClicked} agentState={agentState} />
            <RoomAudioRenderer />
            <NoAgentNotification state={agentState} />
          </div>
        </div>
      </LiveKitRoom>
    </main>
  );
}

function SimpleVoiceAssistant({ onStateChange }: { onStateChange: (state: AgentState) => void }) {
  const { state, audioTrack } = useVoiceAssistant();
  useEffect(() => {
    onStateChange(state);
  }, [onStateChange, state]);
  return (
    <div className="w-full">
      <BarVisualizer
        state={state}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer w-full"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

function ControlBar({ onConnectButtonClicked, agentState }: { onConnectButtonClicked: () => void; agentState: AgentState; }) {
  return (
    <div className="relative w-full h-[100px]">
      <AnimatePresence mode="wait">
        {agentState === "disconnected" ? (
          <motion.button
            key="start-button"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
            onClick={onConnectButtonClicked}
          >
            Start a conversation
          </motion.button>
        ) : (
          <motion.div
            key="control-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex w-full justify-center items-center gap-4"
          >
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton>
              <CloseIcon />
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error?: MediaDeviceFailure) {
  console.error(error);
  alert("Error acquiring camera or microphone permissions. Please ensure your browser permissions are enabled and reload the page.");
}
