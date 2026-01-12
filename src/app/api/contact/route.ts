import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Define Validation Schema
const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
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

const notifyEmails = [
    process.env.GMAIL_USER,
    process.env.GMAIL_USER1
].filter(Boolean).join(',');

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Validate Data
        const result = contactSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ success: false, errors: result.error.issues }, { status: 400 });
        }

        const data = result.data;

        // 2. Check Environment Variables
        const { GMAIL_USER, GMAIL_PASS, GMAIL_USER1 } = process.env;
        if (!GMAIL_USER || !GMAIL_PASS) {
            console.error('Missing GMAIL_USER or GMAIL_PASS env vars');
            return NextResponse.json({ success: false, message: 'Server config error' }, { status: 500 });
        }

        // 3. Configure Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: GMAIL_USER,
                pass: GMAIL_PASS,
            },
        });

        // 4. Format Email Content
        const subject = `[New Lead - ${data.lang?.toUpperCase() || 'Web'}] ${data.projectType} - ${data.name}`;

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #FFD700; background: #000; padding: 10px;">New Contact Submission</h2>
                <p><strong>Language:</strong> ${data.lang}</p>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
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

        // 5. Send Email
        await transporter.sendMail({
            from: `"Seder Music" <${GMAIL_USER}>`,
            to: notifyEmails,
            subject: subject,
            html: htmlContent,
        });

        return NextResponse.json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
        console.error('Email API Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
