import Loading from "@/components/loading/Loading";
import { convertBase64ToAudio, removeLeadingSlash } from "@/services/utils";
import { EmbeddedFile } from "@/types/exam";
import { ServerResponse } from "@/types/server";
import { Alert, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

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
          src={convertBase64ToAudio(data.data.file)}
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
