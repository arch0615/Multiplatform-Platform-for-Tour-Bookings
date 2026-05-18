import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/registro", { replace: true });
  }, [navigate]);
  return null;
}