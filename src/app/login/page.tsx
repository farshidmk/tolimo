"use client";
import React from "react";
import LoginIcon from "@mui/icons-material/Login";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ServerCall, ServerResponse } from "@/types/server";
import Cookies from "js-cookie";
import { LoginFormItems, LoginResponse } from "./login.types";
import RenderFormItem from "@/components/formItems/RenderFormItem";
import { FormTextFieldInput } from "@/types/renderFormItem";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginPage = () => {
  const router = useRouter();
  const { setToken, setUserInfo } = useAuth();
  const { mutate, error, isPending } = useMutation<
    ServerResponse<LoginResponse>,
    Error,
    ServerCall<LoginFormItems>
  >({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormItems>({
    defaultValues: {
      ApplicantId: "",
      AuthCode: "",
      ClientAudience: "samfa-client",
    },
  });

  async function onSubmitHandler(data: LoginFormItems) {
    mutate(
      {
        method: "post",
        url: "Auth/login",
        data,
      },
      {
        onSuccess: ({ data }) => {
          const userInfo = {
            firstName: data.firstname,
            lastName: data.lastname,
            image: data.image,
          };

          Cookies.set("token", data.token, { expires: 1 });
          Cookies.set("userInfo", JSON.stringify(userInfo), { expires: 1 });
          setToken(data.token);
          setUserInfo(userInfo);

          router.push("/confirm");
        },
      },
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at top right, rgba(14,116,144,0.16), transparent 42%), radial-gradient(circle at 20% 20%, rgba(79,70,229,0.16), transparent 36%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 45%, #f1f5f9 100%)",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 4,
            border: "1px solid rgba(15,23,42,0.12)",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255,255,255,0.88)",
            boxShadow: "0 22px 45px rgba(15,23,42,0.12)",
          }}
        >
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmitHandler)}
            spacing={2.2}
          >
            <Stack direction="row" justifyContent="center">
              <Box
                sx={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  background:
                    "linear-gradient(135deg, var(--color-primary) 0%, #0f766e 100%)",
                  boxShadow: "0 10px 26px rgba(79,70,229,0.35)",
                }}
              >
                <LoginIcon sx={{ fontSize: 36 }} />
              </Box>
            </Stack>

            <Stack alignItems="center" spacing={1.2}>
              <Box
                sx={{
                  width: { xs: 120, md: 150 },
                  opacity: 0.96,
                }}
              >
                <Image
                  src="/logo.png"
                  alt="سازمان سنجش آموزش کشور"
                  width={150}
                  height={150}
                  style={{ width: "100%", height: "auto" }}
                  priority
                />
              </Box>

              <Typography
                variant="h5"
                textAlign="center"
                sx={{ fontWeight: 800, color: "#0f172a" }}
              >
                ورود داوطلب آزمون
              </Typography>

              <Typography
                variant="body2"
                textAlign="center"
                sx={{ color: "#334155", maxWidth: 500, lineHeight: 1.9 }}
              >
                لطفا شماره داوطلبی درج شده روی کارت ورود و کد احراز هویت دریافتی
                از مراقب فنی را وارد کنید.
              </Typography>
            </Stack>

            <Box
              sx={{
                p: { xs: 1.5, md: 2 },
                borderRadius: 3,
                border: "1px solid rgba(148,163,184,0.35)",
                backgroundColor: "rgba(248,250,252,0.82)",
              }}
            >
              <Stack spacing={1.5}>
                {PASSWORD_LOGIN_FORM.map((item) => (
                  <Controller
                    key={item.name}
                    name={item.name as keyof LoginFormItems}
                    control={control}
                    render={({ field }) => (
                      <RenderFormItem
                        {...item}
                        inputProps={
                          {
                            ...field,
                            ...item.inputProps,
                          } as React.ComponentProps<"input">
                        }
                        error={
                          errors?.[item.name as keyof LoginFormItems]?.message
                        }
                      />
                    )}
                  />
                ))}
              </Stack>
            </Box>

            {Boolean(error?.message) && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {error?.message}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 0.5,
                py: 1.2,
                borderRadius: 2.5,
                fontWeight: 700,
                letterSpacing: 0.2,
                boxShadow: "0 10px 26px rgba(79,70,229,0.25)",
              }}
              variant="contained"
              color="primary"
              loading={isPending}
              endIcon={<LoginIcon />}
            >
              ورود
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;

const PASSWORD_LOGIN_FORM: FormTextFieldInput<LoginFormItems>[] = [
  {
    name: "ApplicantId",
    inputType: "text",
    label: "شناسه برنامه",
  },
  {
    name: "AuthCode",
    inputType: "text",
    label: "کد احراز هویت",
    inputProps: {
      type: "password",
    },
  },
];
