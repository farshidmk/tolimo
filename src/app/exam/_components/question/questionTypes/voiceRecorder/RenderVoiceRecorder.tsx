// components/Recorder.tsx
import React, { useState, useRef } from "react";
import styles from "./Recorder.module.css"; // CSS Module for styling

const RenderVoiceRecorder = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async (): Promise<void> => {
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        uploadAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const uploadAudio = async (blob: Blob): Promise<void> => {
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");

    try {
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Error uploading audio:", err);
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={startRecording}
        disabled={recording}
        className={`${styles.button} ${recording ? styles.disabled : ""}`}
      >
        🎤 Start Recording
      </button>

      <button
        onClick={stopRecording}
        disabled={!recording}
        className={`${styles.button} ${
          !recording ? styles.disabled : styles.stop
        }`}
      >
        ⏹ Stop Recording
      </button>

      {recording && (
        <div className={styles.recordingIndicator}>🔴 Recording...</div>
      )}

      {audioURL && (
        <div className={styles.audioPlayer}>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
};

export default RenderVoiceRecorder;
