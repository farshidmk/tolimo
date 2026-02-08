"use client";

import { useAuth } from "@/providers/AuthProvider";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useMutation } from "@tanstack/react-query";
import { ServerCall, ServerResponse } from "@/types/server";
import ShowErrors from "@/components/errors/ShowErrors";
import { Confirm } from "@/types/exam";
import { useExamStore } from "@/hooks/useExamStore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckVoiceRecorder from "./CheckVoiceRecorder";

const ConfirmPage = () => {
  const { userInfo } = useAuth();
  const router = useRouter();

  const initializeExam = useExamStore((state) => state.initializeExam);

  const { mutate, error, isPending, data, status } = useMutation<
    ServerResponse<Confirm>,
    Error,
    ServerCall<void>
  >({});

  useEffect(() => {
    if (status === "success" && data?.isSuccessful) {
      initializeExam(data.data.booklet);
      router.push("/exam");
    }
  }, [data?.data, data?.isSuccessful, initializeExam, status]);

  return (
    <div className="h-full w-full  flex flex-col gap-4 items-center justify-center">
      {/* <CheckVoiceRecorder /> */}
      <Paper>
        <div className="h-full w-full  flex flex-col gap-4 items-center justify-center p-5 min-w-xl">
          <Typography variant="h6" textAlign={"center"}>
            اطلاعات کاربر
          </Typography>
          {userInfo?.image ? (
            <Box
              component={"img"}
              src={userInfo.image}
              sx={{ borderRadius: "50%", width: "80px", height: "80px" }}
            />
          ) : (
            <AccountCircleIcon sx={{ fontSize: 80 }} />
          )}
          <Typography variant="body1" fontWeight={600}>
            نام : {userInfo.firstName}
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            نام خانوادگی: {userInfo.lastName}
          </Typography>

          {error?.message && <ShowErrors errors={error?.message} />}
          <div className="w-full flex items-center mt-4 justify-center">
            <Button
              variant="contained"
              color="success"
              endIcon={<CheckCircleOutlineIcon />}
              loading={isPending}
              onClick={() => {
                mutate(
                  {
                    method: "get",
                    url: "Assessment/Confirm",
                  },
                  {
                    onSuccess: (res) => {
                      if (res.isSuccessful) {
                        // initializeExam(res.data)
                        // router.push("/examp");
                      }
                    },
                  }
                );
              }}
              fullWidth
              sx={{ maxWidth: "300px" }}
            >
              تایید
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default ConfirmPage;
