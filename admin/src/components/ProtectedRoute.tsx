import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "../axiosConfig";

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/user/me", {
          withCredentials: true,
        });
        if (res.data?.user) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; // Or a spinner

  if (!authenticated) return <Navigate to="/register" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
