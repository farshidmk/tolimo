import { useExamStore } from "@/hooks/useExamStore";
import { FileType } from "@/types/exam";
import React from "react";
import ShowEmbeddedVoiceFileQuestion from "./ShowEmbeddedVoiceFileQuestion";
import ShowEmbeddedImageFileQuestion from "./ShowEmbeddedImageFileQuestion";

type Props = {
  renderVertically?: boolean;
};
const RenderEmbeddedFile = ({ renderVertically }: Props) => {
  const { activeQuestion } = useExamStore();
  return (
    <>
      {activeQuestion?.passages.map((passage) => (
        <div
          key={passage.displayOrder}
          className={`flex-1 flex ${
            renderVertically ? "flex-col" : ""
          } items-center justify-center`}
        >
          {passage.embeddedFiles.map((embedded) => {
            if (embedded.fileType === FileType.Voice) {
              return (
                <ShowEmbeddedVoiceFileQuestion
                  key={embedded.fileName}
                  embeddedFile={embedded}
                />
              );
            }
            if (embedded.fileType === FileType.Image) {
              return (
                <ShowEmbeddedImageFileQuestion
                  key={embedded.fileName}
                  embeddedFile={embedded}
                />
              );
            }
            return (
              <div key={embedded.fileName}>
                {" "}
                render embedded file type {embedded.fileType}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default RenderEmbeddedFile;
