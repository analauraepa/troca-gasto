import { createClient } from "@/lib/client";

export const ACTIVE_TEST_USER = "userA";

export async function loginTestUser() {
    const supabase = createClient();

    const credentials = {
        userA: {
            email: process.env.NEXT_PUBLIC_TEST_USER_A_EMAIL!,
            password: process.env.NEXT_PUBLIC_TEST_USER_A_PASSWORD!,
        },
        userB: {
            email: process.env.NEXT_PUBLIC_TEST_USER_B_EMAIL!,
            password: process.env.NEXT_PUBLIC_TEST_USER_B_PASSWORD!,
        },
    };

    await supabase.auth.signOut();

    const { data, error } = await supabase.auth.signInWithPassword(
        credentials[ACTIVE_TEST_USER]
    );

    if (error) throw error;

    return data.user;
}