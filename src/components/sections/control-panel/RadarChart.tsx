"use client";

import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import axios from "axios";
import { useSession } from "next-auth/react";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export function RadarChart() {
    const [chartData, setChartData] = useState({
        labels: [] as any,
        datasets: [] as any,
    });

    const { data: session } = useSession();

    useEffect(() => {
        if (!session) {
            console.error("User not authenticated.");
            return;
        }

        const fetchData = async () => {
            try {
                const userRole = session?.user?.role;
                const isAdmin: boolean = userRole === "ADMIN" ? true : false;

                if (!isAdmin) {
                    return;
                }

                const params = { isadmin: isAdmin };
                const response = await axios.get(
                    "/api/get-user-info/users-count",
                    {
                        params,
                    }
                );

                let totalTransactions = 0;
                let totalCategories = 0;
                let totalGoals = 0;

                response.data.forEach((item: any) => {
                    totalTransactions += item._count.transactions;
                    totalCategories += item._count.categories;
                    totalGoals += item._count.goals;
                });

                setChartData({
                    labels: ["Transações Financeiras", "Categorias", "Metas"],
                    datasets: [
                        {
                            label: "Quantidade",
                            data: [totalTransactions, totalCategories, totalGoals],
                            backgroundColor: "rgba(255, 99, 132, 0.2)",
                            borderColor: "rgba(255, 99, 132, 1)",
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error(
                    "Erro ao coletar informações dos usuários: ",
                    error
                );
            }
        };

        fetchData();
    }, [session]);

    return (
        <div className="w-full bg-white p-5 rounded-lg border-primaryOrange border-2">
            <Radar
                data={chartData}
                options={{
                    responsive: true,
                    scales: {
                        r: {
                            beginAtZero: true,
                        },
                    },
                    plugins: {
                        legend: {
                            position: "top",
                        },
                        title: {
                            display: true,
                            text: "Visão Geral",
                        },
                    },
                }}
            />
        </div>
    );
}

export default RadarChart;
