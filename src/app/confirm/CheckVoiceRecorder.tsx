import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";

const CheckVoiceRecorder = () => {
  const [micStatus, setMicStatus] = useState<
    "idle" | "checking" | "ok" | "error"
  >("idle");

  const checkMicrophone = async () => {
    setMicStatus("checking");
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        // If we got a stream, mic is working
        if (stream.getAudioTracks().length > 0) {
          setMicStatus("ok");
          // Stop the stream immediately (we just needed to check)
          stream.getTracks().forEach((track) => track.stop());
        } else {
          setMicStatus("error");
        }
      } else {
        setMicStatus("error");
      }
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setMicStatus("error");
    }
  };

  useEffect(() => {
    checkMicrophone();
  }, []);

  return (
    <>
      <Dialog
        open={micStatus === "error"}
        onClose={() => {}}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle color="error" fontWeight={600}>
          خطا در شناسایی میکروفن
        </DialogTitle>

        <DialogContent>
          <Alert severity="error" variant="standard">
            <p>
              از اتصال میکروفن و سالم بودن آن اطمینان پیدا کنید.
              <br />
              <span className="text-xs font-semibold mt-3">
                برای ادامه آزمون باید میکروفن وصل باشد!{" "}
              </span>
            </p>
          </Alert>
          <div className="flex items-center justify-center mt-4">
            <Button
              onClick={() => {
                setMicStatus("idle");
                checkMicrophone();
              }}
              variant="contained"
              color="primary"
              endIcon={<RefreshIcon />}
            >
              تلاش مجدد
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckVoiceRecorder;
