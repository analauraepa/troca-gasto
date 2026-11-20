import { createClient } from "@/lib/client";
import { parseFatura } from "@/lib/parse-fatura";
import type { Fatura } from "@/types/fatura.type";
import { getCurrentUser } from "@/lib/current-user";

//Percorre o CSV importado e retorna os registros da fatura
export async function uploadFatura(file:File):Promise<Fatura[]> {
    const supabase = createClient();
    const user = await getCurrentUser();
    const fatura = await file.text();
    const registros = parseFatura(fatura);

    if (registros.length === 0) {
        throw new Error("Fatura vazia.");
    }

    //Tenta criar um novo registro na tabela; se o usuário já possuir um registro, atualiza o registro existente
    const resposta = await supabase.from("fatura").upsert(
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
export async function getFatura(): Promise<{records: Fatura[]} | null> {
    const supabase = createClient();
    const user = await getCurrentUser();

    //Busca o registro na tabela "fatura" que corresponda ao id do usuário logado
    const resposta = await supabase.from("fatura").select("records").eq("user_id", user.id).maybeSingle();

    if (resposta.error) throw resposta.error;

    if (!resposta.data) return null;

    return {records: resposta.data.records as Fatura[]};
}

// Deleta o extrato do usuário logado
export async function deleteFatura() {
    const supabase = createClient();
    const user = await getCurrentUser();

    const resposta = await supabase.from("fatura").delete().eq("user_id", user.id);

    if (resposta.error) throw resposta.error;
}