import type { MovimentacaoAgrupada } from "@/types/movimentacao.type";

import { calcularAltura } from "@/lib/grafico";

type GraficoBarraProps = {
    movimentacaoAgrupada: MovimentacaoAgrupada;
    maximo: number;
}

export default function GraficoBarra ({movimentacaoAgrupada:{data,entradas,saidas},maximo}:GraficoBarraProps){
    return (
    <div title={data} className="flex h-full min-w-0 flex-1 items-end justify-center gap-px px-px">
      <div className="min-w-0 max-w-7 flex-1 rounded-t-sm bg-emerald-400" style={{ height: `${calcularAltura(entradas, maximo)}%` }}/>
      <div className="min-w-0 max-w-7 flex-1 rounded-t-sm bg-rose-400" style={{ height: `${calcularAltura(saidas, maximo)}%` }}/>
    </div>
    );
}