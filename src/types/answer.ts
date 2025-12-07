import { SectionQuestion } from "./exam";

export type QuestionAnswer = {
  questionId: SectionQuestion["questionId"];

  answer: string | number | undefined;

  /**
   * کاربر اگر بخواهد میتواند سوال را
   * مارک کند و بعدا مشاهده کندش
   * علامتگذاری سوال برای خود کاربر
   */
  isMarked?: boolean;

  isSubmited?: boolean;
};
