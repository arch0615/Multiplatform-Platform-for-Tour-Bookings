import { Outlet } from "react-router-dom";
import DashboardTopbar from "@/components/layout/DashboardTopbar";

// Route-level layout: renders the fixed topbar + leaves room for the
// position-fixed sidebar that the matched page renders (lg:w-72 wide).
// Pages already use pt-14 md:pt-20 spacing, which the fixed topbar slides into.
// bg-offwhite covers the strip behind the fixed sidebar on lg+ screens.
export default function DashboardChrome() {
  return (
    <div className="min-h-screen bg-offwhite">
      <DashboardTopbar />
      <div className="lg:pl-72">
        <Outlet />
      </div>
    </div>
  );
}
