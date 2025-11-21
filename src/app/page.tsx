"use client";

import { Container, Paper, Typography } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full flex items-center">
      <Container maxWidth="sm">
        <Paper>
          <div className="flex flex-col gap-1 p-4">
            <Typography variant="h6" textAlign={"center"}>
              آزمون سامفا{" "}
            </Typography>
            <Link href={"/login"}>
              <div className="cursor-pointer rounded-xl p-3 w-full mt-4 flex items-center justify-center transition-all hover:text-white font-bold bg-blue-400 text-black hover:bg-blue-500">
                ورود به آزمون
              </div>
            </Link>
          </div>
        </Paper>
      </Container>
    </div>
  );
}
