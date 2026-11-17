import type { Conta } from "@/types/conta.type"

export default function ContaCard ({nome,valor,pago}:Conta){
    return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200 sm:flex-nowrap sm:px-5 sm:py-4">
        <span className={pago ? "h-2.5 w-2.5 rounded-full bg-emerald-400" : "h-2.5 w-2.5 rounded-full bg-rose-400"}></span>
        <span className="min-w-0 flex-1 font-semibold text-teal-950">{nome}</span>
        <span className="text-right font-bold text-slate-800 sm:w-28">R$ {valor}</span>
        <div className="flex w-full items-center justify-between border-t border-slate-100 pt-3 sm:w-auto sm:gap-4 sm:border-0 sm:pt-0">
            <span className="flex items-center gap-1">
                <a href="#" aria-label="Editar Água" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-teal-900"><svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4"/></svg></a>
                <a href="#" aria-label="Excluir Água" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-teal-900"><svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg></a>
            </span>
        <a href="#" className={pago ? "inline-flex w-28 items-center justify-center rounded-full bg-emerald-50 py-2 text-sm font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300" : "inline-flex w-28 items-center justify-center rounded-full bg-teal-900 py-2 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"}>{pago ? "Pago" : "Pagar"} {pago && <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>}</a></div>
  </li>
    );
}