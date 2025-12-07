import Loading from "@/components/loading/Loading";
import { removeLeadingSlash } from "@/services/utils";
import { EmbeddedFile } from "@/types/exam";
import { ServerResponse } from "@/types/server";
import { Alert } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

type Props = {
  embeddedFile: EmbeddedFile;
};
const ShowEmbeddedImageFileQuestion = ({ embeddedFile }: Props) => {
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
    <div>
      <img src={`data:image/png;base64,${data.data.file}`} />
    </div>
  );
};

export default ShowEmbeddedImageFileQuestion;

type GetEmbeddedFileResponse = {
  file: string;
  contentType: "image/gif";
  downloadName: string;
};
