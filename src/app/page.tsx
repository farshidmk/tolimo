"use client";

import LoginIcon from "@mui/icons-material/Login";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SchoolIcon from "@mui/icons-material/School";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

const FEATURES = [
  {
    title: "ورود امن",
    description: "ورود با شناسه داوطلبی و کد احراز هویت اختصاصی.",
    icon: <VerifiedUserIcon sx={{ fontSize: 22 }} />,
  },
  {
    title: "مدیریت زمان",
    description: "زمان آزمون و هر بخش به صورت دقیق نمایش داده می‌شود.",
    icon: <AccessTimeFilledIcon sx={{ fontSize: 22 }} />,
  },
  {
    title: "محیط رسمی آزمون",
    description: "طراحی ساده و متمرکز برای حفظ تمرکز داوطلب در حین پاسخ‌گویی.",
    icon: <SchoolIcon sx={{ fontSize: 22 }} />,
  },
];

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        background:
          "radial-gradient(circle at 12% 18%, rgba(2,132,199,0.14), transparent 32%), radial-gradient(circle at 88% 20%, rgba(15,118,110,0.16), transparent 34%), linear-gradient(145deg, #f8fafc 0%, #e2e8f0 46%, #f1f5f9 100%)",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid rgba(15,23,42,0.12)",
            backgroundColor: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 24px 50px rgba(15,23,42,0.12)",
          }}
        >
          <Stack spacing={{ xs: 2.2, md: 3 }} alignItems="center">
            <Box
              sx={{
                width: 74,
                height: 74,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "white",
                background:
                  "linear-gradient(135deg, var(--color-primary) 0%, #0f766e 100%)",
                boxShadow: "0 10px 25px rgba(79,70,229,0.28)",
              }}
            >
              <SchoolIcon sx={{ fontSize: 36 }} />
            </Box>

            <Stack spacing={1.1} alignItems="center">
              <Typography
                variant="h4"
                textAlign="center"
                sx={{
                  fontWeight: 900,
                  color: "#0f172a",
                  fontSize: { xs: "1.55rem", md: "2rem" },
                }}
              >
                سامانه رسمی برگزاری آزمون
              </Typography>

              <Typography
                variant="body1"
                textAlign="center"
                sx={{ color: "#334155", maxWidth: 720, lineHeight: 2 }}
              >
                برای شروع آزمون، اطلاعات ورود خود را آماده کنید و پس از ورود،
                دستورالعمل هر بخش را با دقت مطالعه نمایید.
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              sx={{ width: "100%" }}
            >
              {FEATURES.map((feature) => (
                <Paper
                  key={feature.title}
                  elevation={0}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 3,
                    border: "1px solid rgba(148,163,184,0.36)",
                    backgroundColor: "rgba(248,250,252,0.8)",
                  }}
                >
                  <Stack spacing={0.8}>
                    <Box sx={{ color: "#0f766e" }}>{feature.icon}</Box>
                    <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#475569" }}>
                      {feature.description}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Button
              component={Link}
              href="/login"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<LoginIcon />}
              sx={{
                minWidth: { xs: "100%", sm: 260 },
                py: 1.3,
                borderRadius: 2.5,
                fontWeight: 800,
                boxShadow: "0 10px 24px rgba(79,70,229,0.25)",
              }}
            >
              ورود به آزمون
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
