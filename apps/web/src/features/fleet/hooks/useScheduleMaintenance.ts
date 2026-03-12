import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useScheduleMaintenance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tailId: string) => {
            const res = await fetch("http://localhost:4000/api/fleet/maintenance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tailId }),
            });
            if (!res.ok) throw new Error("Maintenance scheduling failed");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fleet"] });
        },
    });
}
