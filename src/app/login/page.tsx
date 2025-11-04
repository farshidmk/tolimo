"use client";
import React from "react";
import LoginIcon from "@mui/icons-material/Login";
import { Button, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ServerCall } from "@/types/server";
import ShowErrors from "@/components/errors/ShowErrors";
import Cookies from "js-cookie";
import { LoginFormItems, LoginResponse } from "./login.types";
import RenderFormItem from "@/components/formItems/RenderFormItem";
import { FormFieldInput } from "@/types/renderFormItem";
import { useAuth } from "@/providers/AuthProvider";

const LoginPage = () => {
  const { setToken, setUserInfo } = useAuth();
  const { mutate, error, isPending } = useMutation<
    LoginResponse,
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
        onSuccess: (res) => {
          const userInfo = {
            firstName: res.firstname,
            lastName: res.lastname,
            image: res.image,
          };
          Cookies.set("token", res.token, { expires: 1 });
          Cookies.set("userInfo", JSON.stringify(userInfo), { expires: 1 });
          setToken(res.token);
          setUserInfo(userInfo);
        },
      }
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-3 max-w-2xl w-full p-4 rounded-lg border border-gray-500 shadow-2xl"
      >
        <Typography variant="h6" textAlign="center" sx={{ mb: 1 }}>
          ورود به آزمون
        </Typography>
        {PASSWORD_LOGIN_FORM.map((item) => (
          <Controller
            key={item.name}
            name={item.name as keyof LoginFormItems}
            control={control}
            render={({ field }) => {
              return (
                <RenderFormItem
                  {...item}
                  inputProps={{ ...field, ...item.inputProps } as any}
                  error={errors?.[item.name as keyof LoginFormItems]?.message}
                />
              );
            }}
          />
        ))}
        {Boolean(error?.message) && <ShowErrors errors={error!.message!} />}
        <Button
          type="submit"
          fullWidth
          sx={{ mt: 0.5, mb: 2 }}
          variant="contained"
          color="primary"
          loading={isPending}
          endIcon={<LoginIcon />}
        >
          ورود
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;

const PASSWORD_LOGIN_FORM: FormFieldInput<LoginFormItems>[] = [
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
