import * as resumoService from '../services/resumo.service.js';
import { exibirSaldoTotal, exibirTotaisMovimentacoes } from '../components/resumo.components.js';

// inicializa as variáveis e conecta componenets com resumo
export function iniciarResumoController({
    saldoTotal,
    receitas,
    despesas,
    resultado
}) {
    function atualizarResumo() {
        if (saldoTotal) {
            exibirSaldoTotal(saldoTotal, resumoService.calcularTotalSaldo());
        }

        const totalReceitas = resumoService.calcularReceitasTotais();
        const totalDespesas = resumoService.calcularSaidasTotais();

        exibirTotaisMovimentacoes(
            { receitas, despesas, resultado },
            {
                receitas: totalReceitas,
                despesas: totalDespesas,
                resultado: totalReceitas - totalDespesas
            }
        );

    }

    atualizarResumo();
    return atualizarResumo;
}
