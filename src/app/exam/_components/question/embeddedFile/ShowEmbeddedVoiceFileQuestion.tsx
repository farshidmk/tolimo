import Loading from "@/components/loading/Loading";
import { useAudioStore } from "@/hooks/useAudioStore";
import { convertBase64ToAudio, removeLeadingSlash } from "@/services/utils";
import { EmbeddedFile } from "@/types/exam";
import { ServerResponse } from "@/types/server";
import { Alert, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";

type Props = {
  embeddedFile: EmbeddedFile;
};
const ShowEmbeddedVoiceFileQuestion = ({ embeddedFile }: Props) => {
  const { data, status, error } = useQuery<
    ServerResponse<GetEmbeddedFileResponse>,
    Error
  >({
    queryKey: [removeLeadingSlash(embeddedFile.fileName)],
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume } = useAudioStore();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // ✅ Only regenerate src when file changes
  const audioSrc = useMemo(() => {
    if (data?.data?.file) {
      return convertBase64ToAudio(data.data.file);
    }
    return "";
  }, [data?.data?.file]);

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
          controls
          autoPlay
          ref={audioRef}
          src={audioSrc}
          className="w-full opacity-0"
        >
          Your browser does not support audio playback.
        </audio>
      )}
      <Box
        className="w-full absolute z-10 h-16 top-0 left-0"
        sx={{ bg: (t) => t.palette.background.default }}
      />
    </div>
  );
};

export default ShowEmbeddedVoiceFileQuestion;

type GetEmbeddedFileResponse = {
  file: string;
  contentType: "image/gif";
  downloadName: string;
};
