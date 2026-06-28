import { Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Logo from "@/components/Logo";
import useAuth from "@/hooks/useAuth";

export default function AuthLayout() {
  const { data, isLoading } = useAuth();

  if (isLoading) return "Cargando...";

  if (data) return <Navigate to="/" />;

  return (
    <>
      <div className="bg-gray-800 min-h-screen">
        <div className="py-10 lg:py-20 mx-auto w-[450px]">
          <Logo />
          <div className="mt-10">
            <Outlet />
          </div>
        </div>
      </div>

      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
}
