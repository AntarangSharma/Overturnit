import { z } from "zod";

export const OverturnInput = z.object({
  denial_text: z.string().min(20).max(8000),
  state: z.string().length(2),
  plan_type: z.enum(["Employer", "ACA Marketplace", "Medicare", "Medicaid", "Other"]),
  service_category: z.string().min(2).max(80),
});

export const OverturnResult = z.object({
  denial_reason: z.string(),
  win_probability: z.number().min(0).max(100),
  win_reasons: z.array(z.string()),
  applicable_rules: z.array(
    z.object({ id: z.string(), name: z.string(), why: z.string() })
  ),
  appeal_letter: z.string(),
  deadlines: z.array(
    z.object({ action: z.string(), by_date: z.string(), source: z.string() })
  ),
  red_flags: z.array(z.string()),
  confidence: z.number().min(0).max(100),
  disclaimer: z.string(),
});

export type OverturnResultT = z.infer<typeof OverturnResult>;
export type OverturnInputT = z.infer<typeof OverturnInput>;
