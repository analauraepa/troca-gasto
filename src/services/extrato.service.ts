import { createClient } from "@/lib/client";
import { parseExtrato } from "@/lib/parse-extrato";
import type { Extrato } from "@/types/extrato.type";
import { getCurrentUser } from "@/lib/current-user";

//Percorre o CSV importado e retorna os registros de extrato
export async function uploadExtrato(file: File): Promise<Extrato[]> {
    const supabase = createClient();
    const user = await getCurrentUser();
    const extrato = await file.text();
    const registros = parseExtrato(extrato);

    if (registros.length === 0) {
        throw new Error("Extrato vazio.");
    }

    //Tenta criar um novo registro na tabela; se o usuário já possuir um registro, atualiza o registro existente
    const resposta = await supabase.from("extrato").upsert(
        {
            user_id: user.id,
            records: registros,
            updated_at: new Date().toISOString()
        },
        {
            onConflict: "user_id"
        }
    );

    if (resposta.error) throw resposta.error;

    return registros;
}

// Retorna o extrato do usuário logado
export async function getExtrato(): Promise<{records: Extrato[]} | null> {
    const supabase = createClient();
    const user = await getCurrentUser();

    const resposta = await supabase.from("extrato").select("records").eq("user_id", user.id).maybeSingle();

    if (resposta.error) throw resposta.error;

    if (!resposta.data) return null;

    return {records: resposta.data.records as Extrato[]};
}

// Deleta o extrato do usuário logado
export async function deleteExtrato() {
    const supabase = createClient();
    const user = await getCurrentUser();

    const resposta = await supabase.from("extrato").delete().eq("user_id", user.id);

    if (resposta.error) throw resposta.error;
}
