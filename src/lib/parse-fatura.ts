import type { Fatura } from "@/types/fatura.type";

const CABECALHO_ESPERADO = "date,title,amount";

export function parseFatura(csvText: string): Fatura[] {
    const [cabecalho, ...linhas] = csvText.split("\n").filter(Boolean);

    if (cabecalho !== CABECALHO_ESPERADO) {
        throw new Error(`Cabeçalho inválido. Esperado "${CABECALHO_ESPERADO}", recebido "${cabecalho}".`);
    }

    const registros:Fatura[] = []

    linhas.forEach((linha) => {
        const [data, descricao, reais, cents] = linha.split(",");

        if (descricao === "Pagamento recebido") return;

        const valor = [reais.replace(/\./g,"").replace("\"","").replace(" ",""),cents.replace("\"","")].join(".");

        registros.push({
            data,
            descricao,
            valor: Number(valor)
        })
    });

    return registros;
}