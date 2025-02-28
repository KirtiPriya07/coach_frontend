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
import { useEffect, useState } from "react";
import { MediaDeviceFailure } from "livekit-client";
import type { ConnectionDetails } from "../api/connection-details/route";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import { CloseIcon } from "@/components/CloseIcon";
import WebcamToggle from "@/components/WebcamToggle";
import { useKrispNoiseFilter } from "@livekit/components-react/krisp";

export default function RoomPage() {
  // Connection details might be provided from a previous page or fetched on mount.
  const [connectionDetails, updateConnectionDetails] = useState<ConnectionDetails | undefined>(undefined);
  // We force the state to remain "active" on this page.
  const [agentState] = useState<AgentState>("active" as AgentState);

  return (
    <main data-lk-theme="default" className="h-full bg-[var(--lk-bg)]">
      <LiveKitRoom
        token={connectionDetails?.participantToken}
        serverUrl={connectionDetails?.serverUrl}
        connect={connectionDetails !== undefined}
        audio={true}
        video={false} // Video is off by default; you can publish your camera separately.
        onMediaDeviceFailure={onDeviceFailure}
        onDisconnected={() => updateConnectionDetails(undefined)}
        className="h-full"
      >
        <div className="grid grid-cols-[2fr_1fr] h-full gap-4 p-4">
          {/* Left Column: Webcam */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4">
            <WebcamToggle />
          </div>

          {/* Right Column: Voice Assistance and Controls */}
          <div className="flex flex-col gap-4 justify-center items-center">
            <SimpleVoiceAssistant onStateChange={() => {}} />
            <ControlBar agentState={agentState} />
            <RoomAudioRenderer />
            <NoAgentNotification state={agentState} />
          </div>
        </div>
      </LiveKitRoom>
    </main>
  );
}

function SimpleVoiceAssistant({ onStateChange }: { onStateChange: (state: AgentState) => void }) {
  const { audioTrack } = useVoiceAssistant();
  useEffect(() => {
    // Log the voice assistant state for debugging.
    // Do not update the parent so that the state remains "active".
    console.log("VoiceAssistant is active");
  }, []);
  return (
    <div className="w-full">
      <BarVisualizer
        // Force the state to be "active"
        state={"active" as AgentState}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer w-full"
        options={{ minHeight: 24 }}
      />
    </div>
  );
}

function ControlBar({ agentState }: { agentState: AgentState }) {
  const krisp = useKrispNoiseFilter();
  useEffect(() => {
    krisp.setNoiseFilterEnabled(true);
  }, [krisp]);

  return (
    <div className="relative w-full h-[100px]">
      <AnimatePresence mode="wait">
        {agentState !== "connecting" && (
          <motion.div
            key="control-panel"
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-8 absolute left-1/2 -translate-x-1/2 justify-center items-center gap-4"
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
  alert(
    "Error acquiring camera or microphone permissions. Please ensure your browser permissions are enabled and reload the page."
  );
}
