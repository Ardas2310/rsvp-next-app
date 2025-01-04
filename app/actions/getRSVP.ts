'use server';

import { createClient } from "../utils/supabase/server";

export async function getRSVP() {
    const supabase = await createClient();

    const {data, error} = await supabase.from('rsvps').select("*");
    
    if (error) {
        console.error("Error fetching RSVPs: ", error);
        return { success: false, error: error.message}
    }

    return { success: true, data}
}