import contasJson from "@/data/contas.data.json";
import type { Conta } from "@/types/conta.type";
import ContaCard from "@/components/ContaCard";

const contas: Conta[] = contasJson;

export const metadata = { title: "Contas" };

export default function ContasPage() {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-extrabold text-teal-950">Minhas contas</h1>
        <a href="#" className="rounded-full bg-lime-300 px-4 py-2 text-sm font-bold text-teal-950 transition hover:bg-lime-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-900">Adicionar conta</a>
      </div>
      <ul className="mt-6 space-y-3">
        {contas.map((contas,i) => (
          <ContaCard key={i} {...contas}/>
        ))}
      </ul>
    </>
  );
}