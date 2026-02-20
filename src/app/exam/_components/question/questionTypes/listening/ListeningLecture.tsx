import { useExamStore } from "@/hooks/useExamStore";
import RenderEmbeddedFile from "../../embeddedFile/RenderEmbeddedFile";

/**
 *
 * for question type => Listening_Lecture
 */
const ListeningLecture = () => {
  const { activeQuestion } = useExamStore();

  // useQuery({
  //   queryKey: [removeLeadingSlash(activeQuestion. embeddedFile.fileName)],
  // });

  return (
    <div className="flex flex-col">
      {activeQuestion?.passages.map((passage) => (
        <div key={passage.passageType}>
          <div dangerouslySetInnerHTML={{ __html: passage.text }} />
        </div>
      ))}
      {activeQuestion?.passages.map((passage) => (
        <div key={passage.displayOrder} className="flex-1 flex flex-col">
          <RenderEmbeddedFile renderVertically />
        </div>
      ))}
    </div>
  );
};

export default ListeningLecture;
