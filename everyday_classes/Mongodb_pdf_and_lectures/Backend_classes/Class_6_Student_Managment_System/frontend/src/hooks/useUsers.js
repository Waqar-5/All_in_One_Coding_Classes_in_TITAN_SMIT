import { useState, useEffect, useCallback } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

/**
 * Centralised data source for the users list.
 * Keeps App.jsx, StatsBar and UserTable in sync from one source of truth.
 */
function useUsers(refreshFlag) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag]);

  return { users, loading, getUsers };
}

export default useUsers;
