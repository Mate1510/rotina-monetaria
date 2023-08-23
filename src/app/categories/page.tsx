import React from "react";
import InsertCategories from "@/components/sections/categories/InsertCategories";
import CategoriesTableExtended from "@/components/sections/categories/CategoriesTableExtended";

const CategoriesPage = () => {
  return (
    <div className="container flex min-h-screen flex-col items-center p-5 gap-12">
      <InsertCategories />
      <CategoriesTableExtended />
    </div>
  );
};

export default CategoriesPage;
