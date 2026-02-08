import { useExamStore } from "@/hooks/useExamStore";
import {
  Box,
  Paper,
  Popover,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { LayoutActionDialog } from "./ExamButtons";

type Props = {
  handleClose: () => void;
} & LayoutActionDialog;

const ReviewQuestions = ({ anchorEl, handleClose, type }: Props) => {
  const { activeSection, answers, activeQuestion, goToQuestion } =
    useExamStore();
  const open = Boolean(anchorEl) && type === "review";
  const id = open ? "review-popover" : undefined;
  if (!open) return null;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => handleClose()}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box
        sx={{
          p: 1,
          minHeight: "100px",
          width: "680px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography variant="body2" gutterBottom>
          مرور سوالات
        </Typography>

        <div className="w-full p-3">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>شماره</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>متن سوال</TableCell>
                  <TableCell>وضعیت</TableCell>
                </TableRow>
              </TableHead>
              {activeSection?.questions.map((question, index) => {
                const isCurrentQuestion =
                  question.questionId === activeQuestion?.questionId;
                const isAnswered = Boolean(
                  answers.find(
                    (answer) => answer.questionId === question.questionId
                  )
                );
                const isMarked = Boolean(
                  answers.find(
                    (answer) => answer.questionId === question.questionId
                  )?.isMarked
                );

                return (
                  <TableRow
                    key={question.questionId}
                    className="
                    flex items-center justify-center
                    w-10 h-10
                    rounded-md
                    text-sm font-medium
                    transition
                  "
                    sx={{
                      // border: (t) => `2px solid ${t.palette[color].main}`,
                      color: grey[900],
                      // bgcolor: (t) => alpha(t.palette[color].main, 0.5),
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      goToQuestion(question.questionId);
                      handleClose();
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {getFirstWords(
                        htmlToText(question.passages?.[0]?.text),
                        7
                      )}
                      ...
                    </TableCell>
                    <TableCell>
                      <QuestionStatus
                        isAnswered={isAnswered}
                        isCurrentQuestion={isCurrentQuestion}
                        isMarked={isMarked}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          </TableContainer>
        </div>
      </Box>
    </Popover>
  );
};

export default ReviewQuestions;

type QuestionStatusProps = {
  isMarked: boolean;
  isAnswered: boolean;
  isCurrentQuestion: boolean;
};
function QuestionStatus({
  isAnswered,
  isCurrentQuestion,
  isMarked,
}: QuestionStatusProps) {
  const color = isCurrentQuestion
    ? "info"
    : isMarked
    ? "warning"
    : isAnswered
    ? "primary"
    : "error";
  return (
    <Typography variant="body2" sx={{ color: (t) => t.palette[color].main }}>
      {isCurrentQuestion
        ? "سوال فعلی"
        : isMarked
        ? "نشانه گذاری شده"
        : isAnswered
        ? "پاسخ داده شده"
        : "پاسخ داده نشده"}
    </Typography>
  );
}

function htmlToText(html: string) {
  if (typeof window === "undefined") {
    // for SSR safety
    return html.replace(/<[^>]*>/g, " ");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
}

function getFirstWords(text: string, count = 10) {
  return text
    .trim()
    .split(/\s+/) // handles multiple spaces/newlines
    .slice(0, count)
    .join(" ");
}
