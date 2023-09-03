"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Category } from "@/categories";
import { Finance } from "@/finance";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RoundedCharts = () => {
  const [chartData, setChartData] = useState({});
  const [chartType, setChartType] = useState("doughnut");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      console.error("User not authenticated.");
      return;
    }

    const fetchData = async () => {
      try {
        const userIdResponse = await axios.get(
          `/api/get-user-info/user-id?email=${session.user?.email}`
        );
        const userId = await userIdResponse.data.userId;

        const categoriesResponse = await axios.get("/api/categories", {
          params: {
            userid: userId,
          },
        });
        const categoriesData: Category[] = await categoriesResponse.data;

        const financesResponse = await axios.get(`/api/finances`, {
          params: { month, year, userid: userId },
        });
        const financesData: Finance[] = await financesResponse.data;

        const data = {
          labels: categoriesData.map((category) => category.name),
          datasets: [
            {
              data: financesData.map((finance) => {
                finance.value;
              }),
              backgroundColor: categoriesData.map((category) => category.color),
            },
          ],
        };
        setChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [session]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div>
      <button onClick={handlePrevMonth}>Previous Month</button>
      <span>{`${month}/${year}`}</span>
      <button onClick={handleNextMonth}>Next Month</button>
      <Doughnut data={chartData} />
    </div>
  );
};

export default RoundedCharts;
