import { z } from "zod";

export const CreateEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z
    .union([z.coerce.date(), z.string()])
    .refine((value) => typeof value === "string" || value instanceof Date, {
      message: "Invalid date format",
    })
});

export type CreateEventSchema = z.infer<typeof CreateEventSchema>;

export const JoinEventSchema = z.object({
  id: z.number().int().positive(),
});

export const LeaveEventSchema = z.object({
  id: z.number()
});

export const UpdateEventSchema = z.object({
  id: z.number(),
  data: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    date: z.coerce.date(),
  })
});

