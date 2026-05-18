import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ReservarRedirect() {
  const navigate = useNavigate();
  const { tourId } = useParams();
  useEffect(() => {
    navigate(`/booking/${tourId}`, { replace: true });
  }, [navigate, tourId]);
  return null;
}