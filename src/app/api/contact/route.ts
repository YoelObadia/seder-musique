import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';
import { z } from 'zod';

// Define Validation Schema
const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    //phone: z.string().optional(),
    projectType: z.string().min(1),
    artistType: z.string().optional(),
    artistName: z.string().optional(), // Specific artist request
    demo: z.string().optional(),
    message: z.string().min(4),
    lang: z.string().optional(), // Receive language context
}).superRefine((data, ctx) => {
    // Management Branch: Demo is REQUIRED
    if (data.projectType === 'artist_management') {
        if (!data.demo || data.demo.length < 5) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Demo link is required for artist management",
                path: ['demo']
            });
        }
    }
    // Booking Branch: Artist Type is REQUIRED (Only if NOT booking a specific Seder artist)
    if (data.projectType === 'booking_talent' && !data.artistType) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Artist type is required for booking",
            path: ['artistType']
        });
    }
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Validate Data
        const result = contactSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ success: false, errors: result.error.issues }, { status: 400 });
        }

        const data = result.data;

        // 2. Format Email Content for Admin
        const subject = `[New Lead - ${data.lang?.toUpperCase() || 'Web'}] ${data.projectType} - ${data.name}`;

        const adminHtmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #FFD700; background: #000; padding: 10px;">New Contact Submission</h2>
                <p><strong>Language:</strong> ${data.lang}</p>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p><strong>Project Type:</strong> ${data.projectType}</p>
                ${data.artistType ? `<p><strong>Artist Type:</strong> ${data.artistType}</p>` : ''}
                ${data.artistName ? `<p><strong>Requested Artist:</strong> ${data.artistName}</p>` : ''}
                ${data.demo ? `<p><strong>Demo Link:</strong> <a href="${data.demo}">${data.demo}</a></p>` : ''}
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <h3>Message:</h3>
                <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #FFD700;">${data.message.replace(/\n/g, '<br>')}</p>
            </div>
        `;

        // 3. Format Auto-Reply Content
        const autoReplySubject = "We received your message - Seder Music";
        const autoReplyHtmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <p>Hello ${data.name},</p>
                <p>Thank you for reaching out to Seder Music.</p>
                <p>We have received your message regarding <strong>${data.projectType}</strong>.</p>
                <p>Our team will review your request and get back to you within 24 hours.</p>
                <br>
                <p>Best regards,</p>
                <p><strong>Seder Music Team</strong></p>
                <p><a href="mailto:contact@seder-music.com">contact@seder-music.com</a></p>
            </div>
        `;

        // 4. Send Emails in Parallel
        const [adminEmail, userEmail] = await Promise.all([
            // Send to Admin
            resend.emails.send({
                from: 'Seder Music <contact@seder-music.com>',
                to: ['contact@seder-music.com', 'yoel.obadia.yo@gmail.com', 'rd.skouri@gmail.com'], // Send to contact alias + fallback/personal if needed
                replyTo: data.email,
                subject: subject,
                html: adminHtmlContent,
            }),
            // Send Auto-Reply to User
            resend.emails.send({
                from: 'Seder Music <contact@seder-music.com>',
                to: [data.email],
                subject: autoReplySubject,
                html: autoReplyHtmlContent,
            })
        ]);

        if (adminEmail.error || userEmail.error) {
            console.error('Resend Error:', adminEmail.error || userEmail.error);
            // We still consider it a success if at least one works, but ideally both should.
            // For now, let's return success but log the error.
        }

        return NextResponse.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Email API Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

