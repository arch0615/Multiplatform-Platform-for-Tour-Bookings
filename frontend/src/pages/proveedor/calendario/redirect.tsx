import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProveedorCalendarioRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/provider/calendar", { replace: true });
  }, [navigate]);
  return null;
}