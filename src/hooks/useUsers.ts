import { useEffect, useState } from "react";
import apiClient from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { User } from "../types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    apiClient
      .get(API_ENDPOINTS.getUsers())
      .then((res) => {
        setUsers(res.data?.items ?? []);
      })
      .catch(() => {
        setError("Failed to load users");
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}
