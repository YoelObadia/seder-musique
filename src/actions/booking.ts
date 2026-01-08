'use server';

import { bookingSchema, BookingFormData } from '@/lib/schemas';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const SEDER_EMAIL = 'booking@sedermusicgroup.com';

export async function submitBooking(data: BookingFormData) {
    // Validate data on server side
    const result = bookingSchema.safeParse(data);

    if (!result.success) {
        return { success: false, message: 'Invalid data format.' };
    }

    const cleanData = result.data;

    try {
        // Send notification to Seder team
        await resend.emails.send({
            from: 'Seder Booking <noreply@sedermusicgroup.com>',
            to: SEDER_EMAIL,
            subject: `[${cleanData.role.toUpperCase()}] New Request from ${cleanData.name}`,
            html: `
                <h2>New Booking Request</h2>
                <p><strong>Role:</strong> ${cleanData.role}</p>
                <p><strong>Name:</strong> ${cleanData.name}</p>
                <p><strong>Email:</strong> ${cleanData.email}</p>
                ${cleanData.role === 'organizer' ? `
                    <p><strong>Artist:</strong> ${cleanData.artistName || 'Not specified'}</p>
                    <p><strong>Budget:</strong> $${cleanData.budget}</p>
                    <p><strong>Date:</strong> ${cleanData.date}</p>
                    <p><strong>Venue:</strong> ${cleanData.venue}</p>
                ` : `
                    <p><strong>Demo Link:</strong> ${cleanData.demoLink}</p>
                `}
                <p><strong>Message:</strong> ${cleanData.message || 'No message'}</p>
            `
        });

        // Send confirmation to client
        await resend.emails.send({
            from: 'Seder Music Group <noreply@sedermusicgroup.com>',
            to: cleanData.email,
            subject: 'Your Booking Request - Seder Music Group',
            html: `
                <h2>Thank you for your interest, ${cleanData.name}!</h2>
                <p>We have received your ${cleanData.role === 'organizer' ? 'booking request' : 'artist application'}.</p>
                <p>Our team will review your submission and get back to you within 48 hours.</p>
                <br/>
                <p>Best regards,<br/>The Seder Team</p>
            `
        });

        console.log('--- EMAILS SENT SUCCESSFULLY ---');
        return { success: true, message: 'Request received. Check your email for confirmation.' };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, message: 'Failed to send request. Please try again.' };
    }
}

