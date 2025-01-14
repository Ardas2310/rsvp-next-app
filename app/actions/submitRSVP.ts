'use server';

import { strings } from "../utils/strings";
import { createClient } from "../utils/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export default async function submitRSVP(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get('name');
    const email = formData.get('email');
    const accompany = formData.get('accompany');
    const attendance = formData.get('attendance');

    // If you want to see the form data in the console. Best practice 
    // console.log(formData, 'formData' );

    const {data, error } = await supabase.from('rsvps').insert([
        { name, email, accompany, attendance },
    ])

    console.log(data, 'data_submitRSVP');

    if (error) {
        console.error('Error submitting RSVP:', error);
        return { success: false, message: "Failed to submit RSVP", error };
    }

    if (!strings.sendToEmail) {
        console.error('No email address provided to send RSVP');
        return { success: false, message: "Failed to submit RSVP" };
    }

    try {
        await resend.emails.send({
            from: 'RSVP <onboarding@resend.dev>',
            to: strings.sendToEmail,
            subject: 'New RSVP Submission',
            html:`
            <h1>New RSVP Submission</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Number of Guests:</strong> ${accompany}</p>
            <p><strong>Attendance:</strong> ${attendance}</p>
            `
        })
    } catch(error) {
        console.error('Error sending email: ', error);
    }

    return { success: true, message: "RSVP sent successfully" };
}