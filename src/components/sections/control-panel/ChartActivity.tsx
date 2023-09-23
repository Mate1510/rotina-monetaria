"use client";

import React, {
    useState,
    useEffect,
    DetailedHTMLProps,
    InputHTMLAttributes,
} from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useFetchUsersActivity from "@/data/useFetchUsersActivity";

ChartJS.register(ArcElement, Tooltip, Legend);

const UserActivityChart = () => {
    const [chartData, setChartData] = useState({
        labels: [] as any,
        datasets: [] as any,
    });
    const [chartOptions, setChartOptions] = useState({});
    const [isDoughnut, setIsDoughnut] = useState(true);
    const [activeUsers, setActiveUsers] = useState(0);
    const [inactiveUsers, setInactiveUsers] = useState(0);

    const { data: usersActivityData } = useFetchUsersActivity();

    const handleSwitch = (
        e: DetailedHTMLProps<
            InputHTMLAttributes<HTMLInputElement>,
            HTMLInputElement
        >
    ) => {
        setIsDoughnut(!isDoughnut);
    };

    useEffect(() => {
        if (usersActivityData) {
            setActiveUsers(usersActivityData.activeUsers);
            setInactiveUsers(usersActivityData.inactiveUsers);

            setChartData({
                labels: ["Ativos", "Inativos"],
                datasets: [
                    {
                        label: "Usuários",
                        data: [
                            usersActivityData.activeUsers,
                            usersActivityData.inactiveUsers,
                        ],
                        backgroundColor: [
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(255, 99, 132, 0.6)",
                        ],
                        borderColor: [
                            "rgba(75, 192, 192, 1)",
                            "rgba(255, 99, 132, 1)",
                        ],
                    },
                ],
            });
        }
    }, [usersActivityData]);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-end">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        onChange={handleSwitch}
                        className="sr-only peer"
                    />

                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orangeDarker rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primaryOrange"></div>

                    <span className="ml-3 text-sm font-medium text-gray-900">
                        Pie
                    </span>
                </label>
            </div>

            <div className="bg-white p-5 rounded-lg border-primaryOrange border-2">
                {isDoughnut ? (
                    <Doughnut data={chartData} options={chartOptions} />
                ) : (
                    <Pie data={chartData} options={chartOptions} />
                )}
            </div>
        </div>
    );
};

export default UserActivityChart;
