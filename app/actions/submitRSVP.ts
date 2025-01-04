'use server';

import { createClient } from "../utils/supabase/server";

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

    return { success: true, message: "RSVP sent successfully" };
}