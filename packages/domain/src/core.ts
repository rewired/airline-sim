import { z } from "zod";

export const IdSchema = z.string().uuid();
export type Id = z.infer<typeof IdSchema>;

export const ISODateTimeSchema = z.string().datetime();
export type ISODateTime = z.infer<typeof ISODateTimeSchema>;

export const DayOfWeekSchema = z.union([
    z.literal(1), z.literal(2), z.literal(3), z.literal(4),
    z.literal(5), z.literal(6), z.literal(7)
]);
export type DayOfWeek = z.infer<typeof DayOfWeekSchema>;
