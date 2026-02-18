"use client";

import { useAuth } from "@/providers/AuthProvider";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useMutation } from "@tanstack/react-query";
import { ServerCall, ServerResponse } from "@/types/server";
import { Confirm } from "@/types/exam";
import { useExamStore } from "@/hooks/useExamStore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
  }, [data?.data, data?.isSuccessful, initializeExam, router, status]);

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at 10% 14%, rgba(14,116,144,0.15), transparent 34%), radial-gradient(circle at 86% 18%, rgba(79,70,229,0.14), transparent 34%), linear-gradient(145deg, #f8fafc 0%, #e2e8f0 48%, #f1f5f9 100%)",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: "1px solid rgba(15,23,42,0.12)",
            backgroundColor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 22px 45px rgba(15,23,42,0.12)",
          }}
        >
          <Stack spacing={2.2} alignItems="center">
            <Typography
              variant="h5"
              textAlign="center"
              sx={{ fontWeight: 800, color: "#0f172a" }}
            >
              تایید اطلاعات داوطلب
            </Typography>

            {userInfo?.image ? (
              <Avatar
                src={userInfo.image}
                alt={`${userInfo.firstName} ${userInfo.lastName}`}
                sx={{ width: 92, height: 92, border: "2px solid #cbd5e1" }}
              />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 92, color: "#64748b" }} />
            )}

            <Paper
              elevation={0}
              sx={{
                width: "100%",
                p: 2,
                borderRadius: 3,
                border: "1px solid rgba(148,163,184,0.36)",
                backgroundColor: "rgba(248,250,252,0.86)",
              }}
            >
              <Stack spacing={1}>
                <Typography variant="body1" sx={{ color: "#0f172a" }}>
                  <strong>نام:</strong> {userInfo.firstName || "-"}
                </Typography>
                <Typography variant="body1" sx={{ color: "#0f172a" }}>
                  <strong>نام خانوادگی:</strong> {userInfo.lastName || "-"}
                </Typography>
              </Stack>
            </Paper>

            <Alert severity="info" sx={{ width: "100%", borderRadius: 2 }}>
              لطفا اطلاعات نمایش داده شده را با کارت ورود به جلسه مطابقت دهید. در
              صورت تایید اطلاعات، دکمه زیر را انتخاب کنید تا آزمون شما آغاز شود.
            </Alert>

            {error?.message && (
              <Alert severity="error" sx={{ width: "100%", borderRadius: 2 }}>
                {error.message}
              </Alert>
            )}

            <Button
              variant="contained"
              color="success"
              endIcon={<CheckCircleOutlineIcon />}
              loading={isPending}
              onClick={() => {
                mutate({
                  method: "get",
                  url: "Assessment/Confirm",
                });
              }}
              fullWidth
              sx={{
                py: 1.15,
                borderRadius: 2.5,
                fontWeight: 700,
                maxWidth: "360px",
                boxShadow: "0 10px 22px rgba(22,163,74,0.24)",
              }}
            >
              اطلاعات را تایید می کنم و آزمون را شروع می کنم
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default ConfirmPage;
