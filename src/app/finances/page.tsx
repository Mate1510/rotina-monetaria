import React from "react";
import InsertFinances from "@/components/sections/finances/InsertFinances";
import FinanceTableExtended from "@/components/sections/finances/FinanceTableExtended";

const FinancesPage = () => {
  return (
    <div className="container flex min-h-screen flex-col items-center p-5 gap-12">
      <InsertFinances />
      <FinanceTableExtended />
    </div>
  );
};

export default FinancesPage;
