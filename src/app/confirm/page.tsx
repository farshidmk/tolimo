"use client";
import { useAuth } from "@/providers/AuthProvider";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useMutation } from "@tanstack/react-query";
import { ServerCall } from "@/types/server";
import ShowErrors from "@/components/errors/ShowErrors";

const ConfirmPage = () => {
  const { userInfo } = useAuth();
  const router = useRouter();

  const { mutate, error, isPending } = useMutation<
    unknown,
    Error,
    ServerCall<void>
  >({});

  if (!userInfo?.firstName) {
    router.push("/login");
  }
  return (
    <div className="h-full w-full  flex flex-col gap-4 items-center justify-center">
      <Box component={"img"} src={userInfo.image} />
      <Typography variant="body1" fontWeight={600}>
        {userInfo.firstName} {userInfo.lastName}
      </Typography>
      <div>
        <p>{CONFIRM_TEXT}</p>
      </div>

      {error?.message && <ShowErrors errors={error?.message} />}
      <div className="w-full flex items-center mt-4 justify-center">
        <Button
          variant="contained"
          color="success"
          endIcon={<CheckCircleOutlineIcon />}
          loading={isPending}
          onClick={() => {
            mutate({
              method: "post",
              url: "Assessment/Confirm",
            });
          }}
          fullWidth
          sx={{maxWidth:"300px"}}
        >
          تایید
        </Button>
      </div>
    </div>
  );
};

export default ConfirmPage;

const CONFIRM_TEXT = `اینجانب با رعایت کلیه موارد و قبول تمامی مقررات تایید به انجام آزمون مینمایم`;
