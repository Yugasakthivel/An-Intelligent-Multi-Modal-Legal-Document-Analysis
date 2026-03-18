import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "customer";

export function useUserRole() {
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .limit(1)
        .single();

      setRole((data?.role as AppRole) ?? "customer");
      setLoading(false);
    };

    fetchRole();
  }, []);

  const isAdmin = role === "admin";
  const isCustomer = role === "customer";

  return { role, isAdmin, isCustomer, loading };
}
