import Finances from "@/components/sections/finances/InsertFinances";
import CardSection from "@/components/sections/homepage/CardSection";
import FinanceTable from "@/components/sections/homepage/FinanceTable";

import Image from "next/image";

export default function Home() {
  return (
    <main className="container flex min-h-screen flex-col items-center p-5 gap-12">
      <Finances />
      <CardSection />
      <FinanceTable />
    </main>
  );
}
