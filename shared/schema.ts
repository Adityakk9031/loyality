import { z } from "zod";

export const issuePointsSchema = z.object({
  userAddress: z.string().min(1, "User address is required"),
  amount: z.number().positive("Amount must be positive"),
});

export type IssuePointsRequest = z.infer<typeof issuePointsSchema>;

export const issuePointsResponseSchema = z.object({
  success: z.boolean(),
  deployHash: z.string().optional(),
  message: z.string().optional(),
});

export type IssuePointsResponse = z.infer<typeof issuePointsResponseSchema>;
