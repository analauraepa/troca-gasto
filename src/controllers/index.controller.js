import * as resumoService from '../services/index.service.js';
import {
    exibirSaldoTotal,
    exibirTotaisMovimentacoes,
    exibirTotalContasPendentes,
    exibirProximasContas,
    exibirUltimasMovimentacoes
} from '../components/index.components.js';

// conecta os os calculos do service e componentes do resumo
export function iniciarResumoController({
    saldoTotal,
    receitas,
    despesas,
    resultado,
    totalContasPendentes,
    proximasContas,
    ultimasMovimentacoes
}) {
    // atualiza cada parte do resumo usando os dados mais recentes dos serviços
    function atualizarResumo() {
        if (saldoTotal) {
            exibirSaldoTotal(saldoTotal, resumoService.calcularTotalSaldo());
        }

        // calcula os totais uma vez para exibir receitas, despesas e resultado
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


        //funções de exibição de components
        exibirTotalContasPendentes(
            totalContasPendentes,
            resumoService.calcularContasPendTotais()
        );
        exibirProximasContas(
            proximasContas,
            resumoService.obterProximasContasFixas()
        );
        exibirUltimasMovimentacoes(
            ultimasMovimentacoes,
            resumoService.obterUltimasMovimentacoes()
        );
    }

    atualizarResumo();
    return atualizarResumo;
}
