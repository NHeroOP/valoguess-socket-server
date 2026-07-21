import * as z from "zod";

export const askQuestionSchema = z.object({
  roomId: z.string(),
  questionId: z.string(),
})

export type AskQuestionInput = z.infer<typeof askQuestionSchema>;

export const answerQuestionSchema = z.object({
  roomId: z.string(),
  answer: z.enum(["yes", "no"]),
})

export type AnswerQuestionInput = z.infer<typeof answerQuestionSchema>;

export const makeGuessSchema = z.object({
  roomId: z.string(),
  guess: z.string(),
})

export type MakeGuessInput = z.infer<typeof makeGuessSchema>;