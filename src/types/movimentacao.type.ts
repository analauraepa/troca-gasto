export type Movimentacao = {
  data: string;
  valor: number;
  identificador: string;
  descricao: string;
};

export type MovimentacaoAgrupada = {
    data: string;
    entradas: number;
    saidas: number;
}