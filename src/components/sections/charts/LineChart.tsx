import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useFetchFinances from "@/data/useFetchFinances";
import { useSession } from "next-auth/react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = ({ selectedYear }: { selectedYear?: number }) => {
    const [chartData, setChartData] = useState({
        labels: [] as any,
        datasets: [] as any,
    });
    const [chartOptions, setChartOptions] = useState({});
    const year = selectedYear || new Date().getFullYear();

    const { data: session } = useSession();
    const { data: dataFinances } = useFetchFinances(undefined, year);

    useEffect(() => {
        const months = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ];

        if (!session) {
            console.error("User not authenticated.");
            return;
        }

        if (!Array.isArray(dataFinances)) {
            return;
        }

        const income = Array(12).fill(0);
        const expense = Array(12).fill(0);

        dataFinances.forEach((finance) => {
            const financeDate = new Date(finance.date);
            const financeMonth = financeDate.getMonth();

            if (finance.type === "INCOME") {
                income[financeMonth] += parseFloat(finance.value as any);
            } else if (finance.type === "EXPENSE") {
                expense[financeMonth] += parseFloat(finance.value as any);
            }
        });

        setChartData({
            labels: months,
            datasets: [
                {
                    label: "Receitas",
                    data: income,
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    fill: true,
                },
                {
                    label: "Despesas",
                    data: expense,
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    fill: true,
                },
            ],
        });

        setChartOptions({
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: `Finanças de ${year}`,
                },
            },
        });
    }, [dataFinances, year, session]);

    return (
        <div className="w-full bg-white p-5 rounded-lg border-primaryOrange border-2">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default LineChart;
