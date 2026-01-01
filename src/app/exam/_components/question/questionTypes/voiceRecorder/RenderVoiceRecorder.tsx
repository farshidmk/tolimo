// components/Recorder.tsx
import React, { useState, useRef } from "react";
import styles from "./Recorder.module.css"; // CSS Module for styling
import { Button, LinearProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { convertSecondsToTime } from "@/services/timeConvertor";
import { useExamStore } from "@/hooks/useExamStore";
import { useMutation } from "@tanstack/react-query";
import { ServerCall, ServerResponse } from "@/types/server";
import { toast } from "react-toastify";

const RenderVoiceRecorder = () => {
  const { activeQuestion, sectionTimeLeft, examTimeLeft, nextQuestion } =
    useExamStore();
  const [recording, setRecording] = useState<boolean>(false);
  // const [audioURL, setAudioURL] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { mutate, isPending } = useMutation<
    ServerResponse<string>,
    Error,
    ServerCall<FormData>
  >({});

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
        // const url = URL.createObjectURL(audioBlob);
        // setAudioURL(url);
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
    formData.append("QuestionId", String(activeQuestion!.questionId));
    formData.append(
      "SectionReminigTime",
      String(convertSecondsToTime(sectionTimeLeft))
    );
    formData.append(
      "ExamReminigTime",
      String(convertSecondsToTime(examTimeLeft))
    );

    mutate(
      {
        url: "Assessment/SpeakingAnswer",
        method: "POST",
        data: formData,

        headers: {
          Accept: "multipart/form-data",
        },
      },
      {
        onSuccess: () => {
          nextQuestion();
        },
        onError: (err) => {
          toast.error(err.message ?? "خطا در برقراری ارتباط با سرور");
        },
      }
    );
  };

  return (
    <div className={styles.container}>
      {isPending ? (
        <LinearProgress />
      ) : recording ? (
        <Button
          onClick={stopRecording}
          color="warning"
          variant="outlined"
          sx={{ width: "200px" }}
          endIcon={<StopIcon />}
        >
          توقف ضبط
        </Button>
      ) : (
        <Button
          onClick={startRecording}
          endIcon={<MicIcon />}
          color="success"
          variant="contained"
          sx={{ width: "200px" }}
        >
          شروع ضبط
        </Button>
      )}

      {recording && (
        <div className={styles.recordingIndicator}>🔴 در حال ضبط ...</div>
      )}

      {/* {audioURL && (
        <div className={styles.audioPlayer}>
          <audio src={audioURL} controls />
        </div>
      )} */}
    </div>
  );
};

export default RenderVoiceRecorder;
