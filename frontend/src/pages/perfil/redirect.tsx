import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PerfilRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/profile", { replace: true });
  }, [navigate]);
  return null;
}