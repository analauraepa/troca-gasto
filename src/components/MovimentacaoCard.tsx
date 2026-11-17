import type { Movimentacao } from "../types/movimentacao.type";

export default function MovimentacaoCard ({data,valor,identificador,descricao}:Movimentacao){
    return (
    <li className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl bg-white px-4 py-3 ring-1 sm:px-5 sm:py-4 ring-slate-200 sm:grid-cols-[6rem_8rem_1fr_auto]">
        <span className="hidden text-sm text-slate-500 sm:block">{data}</span>
        <span className="hidden font-semibold text-slate-700 sm:block">Nubank</span>
        <span className="font-semibold text-teal-950">{descricao}<span className="block text-xs font-normal text-slate-500 sm:hidden">Nubank · {data}</span></span>
        <span className={ valor > 0 ? "flex items-center gap-1 font-bold text-emerald-600" : "flex items-center gap-1 font-bold text-rose-600"}>R$ {valor > 0 ? "+" : ""}{valor}</span>
    </li>
    );
}