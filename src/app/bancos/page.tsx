import movimentacoesJson from "@/data/movimentacoes.data.json";
import type { Movimentacao } from "@/types/movimentacao.type";
import MovimentacaoCard from "@/components/MovimentacaoCard";

const movimentacoes: Movimentacao[] = movimentacoesJson;

export const metadata = { title: "Bancos" };

export default function BancosPage() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-extrabold text-teal-950">Meus bancos</h1>
        <a href="#" className="rounded-full bg-lime-300 px-4 py-2 text-sm font-bold text-teal-950 transition hover:bg-lime-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-900">Adicionar/atualizar bancos</a>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-2xl bg-gradient-to-br from-teal-900 to-teal-700 p-5 text-white shadow-sm">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-bold">Nubank</h2><a href="#" aria-label="Remover Nubank" className="rounded-lg p-1 text-white/70 hover:bg-white/15 hover:text-white"><svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg></a></div>
          <p className="mt-6 text-sm text-white/75">Balanço</p>
          <p className="text-3xl font-extrabold">R$ {movimentacoes.reduce((acc,movimentacao) => 
            acc + movimentacao.valor, 0
          ).toLocaleString("pt-BR")}</p>
        </article>
      </div>
      <h2 className="mb-3 mt-10 text-lg font-bold text-teal-950">Movimentações</h2>
      <ul className="space-y-2">
        {movimentacoes.map((movimentacao) => (
          <MovimentacaoCard key={movimentacao.identificador} {...movimentacao} />
        ))}
      </ul>
    </>
  );
}