import contasJson from "@/data/contas.data.json";
import type { Conta } from "@/types/conta.type";
import ContaCard from "@/components/ContaCard";

const contas: Conta[] = contasJson;

export const metadata = { title: "Contas" };

const contasAPagar = contas.filter((conta) => conta.pago === false).reduce((acc,conta) => acc + conta.valor,0)

export default function ContasPage() {
    return (
        <>
            <section className="flex flex-wrap items-end justify-between gap-6 rounded-3xl bg-gradient-to-br from-teal-900 to-teal-700 p-5 text-white shadow-sm">
                <h1 className="text-3xl font-extrabold">Minhas contas</h1>
                <div className="sm:text-right">
                    <p className="mt-6 text-sm text-white/75">Contas a pagar</p>
                    <p className="text-3xl font-extrabold">{contasAPagar.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
            </section>

            <div className="mb-3 mt-10 flex items-center gap-2">
                <h2 className="text-lg font-bold text-teal-950">Contas</h2>
                <button type="button" aria-label="Adicionar Conta" className="cursor-pointer rounded-lg p-1 text-teal-800  hover:text-teal-600 disabled:cursor-not-allowed disabled:opacity-50">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                </button>
            </div>

            <ul className="mt-6 space-y-3">
                {contas.map((contas,i) => (
                    <ContaCard key={i} {...contas}/>
                ))}
            </ul>
        </>
    );
}