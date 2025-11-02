import { Vazirmatn } from "next/font/google";

export const vazirFont = Vazirmatn({
  subsets: ["arabic"], // Important for Persian
  weight: ["400", "500", "700"], // Choose weights you need
});
