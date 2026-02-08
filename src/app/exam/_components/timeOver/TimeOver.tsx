import ErrorIcon from "@mui/icons-material/Error";
import { alpha, Box, Typography } from "@mui/material";

const TimeOver = () => {
  return (
    <div className="w-screen h-screen absolute top-0 left-0 bg-gray-300 flex items-center justify-center flex-col gap-1">
      <Box
        component={"div"}
        sx={{
          bgcolor: (t) => alpha(t.palette.error.main, 0.5),
          color: (t) => t.palette.error.main,
          height: "300px",
        }}
        className="flex items-center justify-center w-full"
      >
        <ErrorIcon color="error" sx={{ width: "20px", height: "20px" }} />
        <Typography variant="h6">زمان آزمون شما به پایان رسیده است</Typography>
      </Box>
      <Typography variant="body1">سازمان سنجش آموزش کشور</Typography>
    </div>
  );
};

export default TimeOver;
