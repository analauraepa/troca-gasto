import { createClient } from "@/lib/client";

export async function getCurrentUser() {
    const supabase = createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) throw error;

    if (!user) {
        throw new Error("Usuário não autenticado");
    }

    return user;
}