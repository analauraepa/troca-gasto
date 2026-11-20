import type { Extrato } from "@/types/extrato.type";

const CABECALHO_ESPERADO = "Data,Valor,Identificador,Descrição";

export function parseExtrato(csvText: string): Extrato[] {
    const [cabecalho, ...linhas] = csvText.split("\n").filter(Boolean);

    if (cabecalho !== CABECALHO_ESPERADO) {
        throw new Error(`Cabeçalho inválido. Esperado "${CABECALHO_ESPERADO}", recebido "${cabecalho}".`);
    }

    const registros:Extrato[] = []

    linhas.forEach((linha) => {
        const [data, valor, identificador, ...descricao] = linha.split(",");
        const [dia, mes, ano] = data.split("/");

        registros.push({
            data: `${ano}-${mes}-${dia}`,
            valor: Number(valor),
            identificador,
            descricao: descricao.join(",")
        })
    });

    return registros;
}