import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProveedorProductosRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/provider/products", { replace: true });
  }, [navigate]);
  return null;
}