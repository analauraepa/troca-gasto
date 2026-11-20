import type { Fatura } from "../types/fatura.type";

export default function FaturaCard ({data,descricao,valor}:Fatura){
    return (
        <li className="grid grid-cols-[1fr_auto] items-center gap-x-4 rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-200 sm:grid-cols-[6rem_8rem_1fr_auto] sm:px-5 sm:py-4">
            <span className="hidden text-sm text-slate-500 sm:block">{data}</span>
            <span className="hidden font-semibold text-teal-700 sm:block">Nubank</span>
            <span className="font-semibold text-teal-950">{descricao}<span className="block text-xs font-normal text-slate-500 sm:hidden">Nubank · {data}</span></span>
            <span className="text-right font-bold text-slate-800">{valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        </li>
    );
}