import { Passage, PassageType } from "@/types/exam";

type Props = {
  passage: Passage;
};
const RenderPassage = ({ passage }: Props) => {
  switch (passage.passageType) {
    case PassageType.Lecture:
      <div></div>;
      break;
    case PassageType.Question:
      <div></div>;
      break;
    case PassageType.Reading:
      <div></div>;
      break;
    case PassageType.StopMedia:
      <div></div>;
      break;

    default:
      <div>RenderPassage</div>;
  }
};

export default RenderPassage;
