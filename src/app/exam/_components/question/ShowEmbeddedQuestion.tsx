import { useExamStore } from "@/hooks/useExamStore";
import { EmbeddedFile } from "@/types/exam";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type Props = {
  embeddedFile: EmbeddedFile;
};
const ShowEmbeddedQuestion = ({ embeddedFile }: Props) => {
  useQuery({
    queryKey: [removeLeadingSlash(embeddedFile.fileName)],
  });

  return <div>ShowEmbededQuestion</div>;
};

export default ShowEmbeddedQuestion;

/**
 * Checks if a string starts with '/' and removes it if present.
 *
 * @param {string} input - The input string to check and modify.
 * @returns {string} - The modified string without the leading '/'.
 */
function removeLeadingSlash(input: string): string {
  if (input.startsWith("/")) {
    return input.slice(1); // Remove the leading '/'
  }
  return input; // Return the string unchanged if it doesn't start with '/'
}
