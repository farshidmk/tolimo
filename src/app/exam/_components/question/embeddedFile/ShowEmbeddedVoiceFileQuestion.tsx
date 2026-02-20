import Loading from "@/components/loading/Loading";
import { useAudioStore } from "@/hooks/useAudioStore";
import { convertBase64ToAudio, removeLeadingSlash } from "@/services/utils";
import { EmbeddedFile } from "@/types/exam";
import { ServerResponse } from "@/types/server";
import { Alert, Box, LinearProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  embeddedFile: EmbeddedFile;
};

const ShowEmbeddedVoiceFileQuestion = ({ embeddedFile }: Props) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { data, status, error } = useQuery<
    ServerResponse<GetEmbeddedFileResponse>,
    Error
  >({
    queryKey: [removeLeadingSlash(embeddedFile.fileName)],
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume } = useAudioStore();

  // Regenerate src only when file changes.
  const audioSrc = useMemo(() => {
    if (data?.data?.file) {
      return convertBase64ToAudio(data.data.file);
    }
    return "";
  }, [data?.data?.file]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => setCurrentTime(audio.duration || 0);
    const handlePause = () => {
      if (!audio.ended) {
        void audio.play().catch(() => undefined);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioSrc]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play().catch(() => undefined);
    }
  }, [audioSrc]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return "00:00";
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (status === "pending") return <Loading />;
  if (status === "error")
    return (
      <Alert severity="error" variant="filled">
        {error.message}
      </Alert>
    );
  if (status === "success" && !data.isSuccessful)
    return (
      <Alert severity="error" variant="filled">
        {data.message}
      </Alert>
    );

  return (
    <div className="w-full relative">
      {data?.data && (
        <audio
          autoPlay
          ref={audioRef}
          src={audioSrc}
          className="hidden"
          controls={false}
        >
          Your browser does not support audio playback.
        </audio>
      )}
      <Box
        className="w-full rounded-md p-4"
        sx={{
          bg: (t) => t.palette.background.default,
          border: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <LinearProgress
          variant="determinate"
          value={Math.min(100, Math.max(0, progress))}
          sx={{
            height: 10,
            borderRadius: 999,
            backgroundColor: (t) => t.palette.action.hover,
            "& .MuiLinearProgress-bar": {
              borderRadius: 999,
            },
          }}
        />
        <Box className="mt-2 flex items-center justify-between">
          <Typography variant="caption">{formatTime(currentTime)}</Typography>
          <Typography variant="caption">{formatTime(duration)}</Typography>
        </Box>
      </Box>
    </div>
  );
};

export default ShowEmbeddedVoiceFileQuestion;

type GetEmbeddedFileResponse = {
  file: string;
  contentType: "image/gif";
  downloadName: string;
};
