import { useQuery } from "@tanstack/react-query";

export function useFleet() {
    return useQuery({
        queryKey: ["fleet"],
        queryFn: async () => {
            const res = await fetch("http://localhost:4000/api/fleet");
            if (!res.ok) throw new Error("Failed to fetch fleet");
            return res.json();
        },
    });
}
