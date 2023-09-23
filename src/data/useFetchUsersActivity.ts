import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface UsersActivityData {
    totalUsers: number | 0;
    activeUsers: number | 0;
    inactiveUsers: number | 0;
}

const useFetchUsersActivity = () => {
    const [data, setData] = useState<UsersActivityData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const userRole = session?.user?.role;
                const isAdmin: boolean = userRole === "ADMIN" ? true : false;

                if (!isAdmin) {
                    return;
                }

                const params: { [key: string]: any } = { isadmin: isAdmin };

                const response = await axios.get(
                    "/api/get-user-info/users-activity",
                    {
                        params,
                    }
                );
                const data = response.data;

                setData(data);
            } catch (errorInstance) {
                if (errorInstance instanceof Error) {
                    setError(errorInstance);
                } else {
                    setError(new Error("An unknown error occurred"));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session]);

    return { data, loading, error };
};

export default useFetchUsersActivity;
