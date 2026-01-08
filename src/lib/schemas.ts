import { z } from 'zod';

// Base schema for common fields
const baseSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    message: z.string().optional(),
});

// Organizer specific schema
const organizerSchema = baseSchema.extend({
    role: z.literal('organizer'),
    budget: z.coerce.number().min(5000, { message: "Minimum budget for booking is $5,000" }),
    venue: z.string().min(2, { message: "Venue name is required" }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    artistName: z.string().optional(),
});

// Artist specific schema
const artistSchema = baseSchema.extend({
    role: z.literal('artist'),
    demoLink: z.string().url({ message: "Must be a valid URL (SoundCloud, Dropbox, etc.)" }),
    genre: z.string().optional(),
});

// Discriminated Union
export const bookingSchema = z.discriminatedUnion('role', [
    organizerSchema,
    artistSchema,
]);

export type BookingFormData = z.infer<typeof bookingSchema>;
