import Link from "next/link";

import movimentacoesJson from "@/data/movimentacoes.data.json";
import type { Movimentacao } from "@/types/movimentacao.type";

import { acumularFaturas,dias,faturasAgrupadas,movimentacoesAgrupadas,pontosDaLinha } from "@/lib/grafico";
import GraficoBarra from "@/components/GraficoBarra"

import faturaJson from "@/data/fatura.data.json";
import type { Fatura } from "@/types/fatura.type";

import contasJson from "@/data/contas.data.json";
import type { Conta } from "@/types/conta.type";

const movimentacoes: Movimentacao[] = movimentacoesJson;
const faturas: Fatura[] = faturaJson;
const contas: Conta[] = contasJson;

const maiorEntrada = Math.max(...movimentacoesAgrupadas.map((movimentacao) => Math.abs(movimentacao.entradas)));
const maiorSaida = Math.max(...movimentacoesAgrupadas.map((movimentacao) => Math.abs(movimentacao.saidas)));
const faturaAcumulada = acumularFaturas(dias, faturasAgrupadas);
const maiorFaturaAcumulada = Math.max(0, ...faturaAcumulada);
const maiorAbsoluto = Math.max(maiorEntrada,maiorSaida,maiorFaturaAcumulada);

export const metadata = { title: "Resumo" };

export default function ResumoPage() {
  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-6 rounded-3xl bg-teal-950 p-6 text-white sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Olá, Usuário!
        </h1>
        <div className="sm:text-right">
          <p className="text-sm font-medium text-teal-200">Balanço do mês</p>
          <p className="text-3xl font-extrabold text-lime-300 sm:text-5xl"> R$ {movimentacoes.reduce((acc,movimentacao) => acc + movimentacao.valor, 0).toLocaleString("pt-BR")}</p>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Gráfico: escondido no celular */}
        <section className="hidden rounded-3xl bg-white p-6 ring-1 ring-slate-200 md:block lg:col-span-2">
          <h2 className="mb-5 font-bold text-teal-950">
            Visão geral
          </h2>

          <div
            className="relative h-72 border-b border-slate-300"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to top,transparent 0,transparent calc(12.5% - 1px),#e2e8f0 calc(12.5% - 1px),#e2e8f0 12.5%)",
            }}
          >
            <div className="absolute inset-0 flex items-end">
              {dias.map((dia) => {
                const movimentacao = movimentacoesAgrupadas.find((m) => m.data === dia);

                return (<GraficoBarra key={dia} movimentacaoAgrupada={movimentacao ?? { data: dia, entradas: 0, saidas: 0 }} maximo={maiorAbsoluto}/>);
              })}
            </div>

            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline
              points={pontosDaLinha(faturaAcumulada, maiorAbsoluto)}
              fill="none"
              stroke="#134e4a"
              strokeWidth="3"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-slate-600">
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-emerald-400" />
              Entradas
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-rose-400" />
              Saídas
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1 w-4 rounded bg-teal-900" />
              Fatura
            </li>
          </ul>
        </section>

        <aside className="grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:gap-4">
          <Link
            href="/bancos"
            className="col-span-2 rounded-3xl bg-white p-5 ring-1 ring-slate-200 transition hover:ring-teal-700 sm:p-6 lg:col-span-1"
          >
            <h2 className="font-bold text-teal-950">Movimentações</h2>
            <p className="mt-4 flex justify-between text-sm text-slate-600">
              <span>Entradas</span>
              <span className="font-bold text-emerald-600">R$ +{movimentacoes.filter((movimentacao) => movimentacao.valor > 0).reduce((acc,movimentacao) => acc + movimentacao.valor, 0).toLocaleString("pt-BR")}</span>
            </p>
            <p className="mt-2 flex justify-between text-sm text-slate-600">
              <span>Saídas</span>
              <span className="font-bold text-rose-600">R$ {movimentacoes.filter((movimentacao) => movimentacao.valor < 0).reduce((acc,movimentacao) => acc + movimentacao.valor, 0).toLocaleString("pt-BR")}0</span>
            </p>
          </Link>

          <Link
            href="/cartoes"
            className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 transition hover:ring-teal-700 sm:p-6"
          >
            <h2 className="font-bold text-teal-950">Fatura do mês</h2>
            <p className="mt-3 text-2xl font-extrabold text-teal-900 sm:text-3xl">R$ {faturas.reduce((acc,fatura) => acc + fatura.amount, 0)}</p>
          </Link>

          <Link
            href="/contas"
            className="rounded-3xl bg-white p-5 ring-1 ring-slate-200 transition hover:ring-teal-700 sm:p-6"
          >
            <h2 className="font-bold text-teal-950">Contas a pagar</h2>
            <p className="mt-3 text-2xl font-extrabold text-teal-900 sm:text-3xl">R$ {contas.filter((conta) => conta.pago === false).reduce((acc,conta) => acc + conta.valor,0)}</p>
          </Link>
        </aside>
      </div>
    </>
  );
}