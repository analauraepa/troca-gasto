import movimentacoesJson from "@/data/movimentacoes.data.json";
import type { Movimentacao } from "@/types/movimentacao.type";
import type { MovimentacaoAgrupada } from "@/types/movimentacao.type";

import faturaJson from "@/data/fatura.data.json";
import type { Fatura } from "@/types/fatura.type";
import type { FaturaAgrupada } from "@/types/fatura.type";

const movimentacoes: Movimentacao[] = movimentacoesJson;
const faturas: Fatura[] = faturaJson;

export const movimentacoesAgrupadas = Object.values(
  movimentacoes.reduce<Record<string, MovimentacaoAgrupada>>((acc, movimentacao) => {
    const { data, valor } = movimentacao;

    if (!acc[data]) {
      acc[data] = { data, entradas: 0, saidas: 0 };
    }

    if (valor > 0) {
      acc[data].entradas += valor;
    } else {
      acc[data].saidas += Math.abs(valor);
    }

    return acc;
  }, {})
);

export const faturasAgrupadas = Object.values(
  faturas.reduce<Record<string, FaturaAgrupada>>((acc, fatura) => {
    const { amount, date } = fatura;

    // valores negativos (ex.: "Pagamento recebido") não são compras
    if (amount <= 0) return acc;

    if (!acc[date]) {
      acc[date] = { data:date, valor: 0 };
    }

    acc[date].valor += amount;

    return acc;
  }, {})
);

export function calcularAltura(valor: number, maximo: number): number {
  if (maximo === 0) return 0;
  return Math.round((valor * 100) / maximo);
}
export const dias = [...new Set([...movimentacoesAgrupadas.map((m) => m.data),...faturasAgrupadas.map((f) => f.data),])].sort();

export function acumularFaturas(
  dias: string[],
  faturas: FaturaAgrupada[]
): number[] {
  const valorPorDia = new Map(faturas.map((f) => [f.data, f.valor]));

  let acumulado = 0;
  return dias.map((dia) => {
    acumulado += valorPorDia.get(dia) ?? 0;
    return acumulado;
  });
}

export function pontosDaLinha(valores: number[], maximo: number): string {
  return valores
    .map((valor, i) => {
      const x = ((i + 0.5) / valores.length) * 100;
      const y = 100 - Math.min(100, calcularAltura(valor, maximo));
      return `${x.toFixed(2)},${y}`;
    })
    .join(" ");
}