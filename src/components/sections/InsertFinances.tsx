"use client";

import React, { useEffect, useState } from "react";

import { useSession } from "next-auth/react";
import { Category } from "@/categories";
import Input from "@/components/components/Input";
import CurrencyInput from "@/components/components/CurrencyInput";
import Select from "@/components/components/Select";
import DatePicker from "@/components/components/DatePicker";
import Button from "@/components/components/Button";

const Finances = () => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [type, setType] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);

  const { data: session } = useSession();

  const handleSubmit = async () => {
    if (!session) {
      console.error("User not authenticated.");
      return;
    }

    try {
      const userIdResponse = await fetch(
        `/api/getuserid?email=${session.user?.email}`
      );
      const { userId } = await userIdResponse.json();

      const response = await fetch(`/api/finances/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          value,
          date,
          type,
          userId: userId,
          categoryId: category,
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error(data.error);
      } else {
        console.log("Finance created:", data);
      }
    } catch (error) {
      console.error("Failed to add finance:", error);
    }
  };

  useEffect(() => {
    if (!session) {
      console.error("User not authenticated.");
      return;
    }

    const fetchCategories = async () => {
      try {
        const userIdResponse = await fetch(
          `/api/getuserid?email=${session.user?.email}`
        );
        const { userId } = await userIdResponse.json();

        const categoriesResponse = await fetch(
          `/api/categories?userid=${userId}`
        );
        const categoriesData: Category[] = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [session]);

  return (
    <div className="container flex flex-col bg-constrastGray p-8 rounded-xl gap-5 shadow-sm">
      <h3 className="text-center text-constrastBlack font-semibold text-lg">
        Insira suas finanças:
      </h3>

      <div className="flex flex-col gap-3">
        <Input
          placeholder="Título"
          className="w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="grid grid-cols-5 gap-3 w-full">
          <div className="col-span-2">
            <CurrencyInput
              placeholder="R$"
              className="w-full"
              value={value}
              onValueChange={(val) => setValue(val || "")}
            />
          </div>

          <div className="col-span-3">
            <Select
              placeholder="Categorias"
              className="w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-7">
            <DatePicker
              className="w-full"
              selected={date}
              onChange={setDate}
              placeholderText="Data"
            />
          </div>

          <div className="col-span-5">
            <Select
              placeholder="Tipo Transação"
              className="w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="INCOME">Entrada</option>
              <option value="EXPENSE">Despesa</option>
            </Select>
          </div>
        </div>

        <Button className="w-full self-center mt-3" onClick={handleSubmit}>
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default Finances;