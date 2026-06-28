import { getUser } from "@/api/AuthAPI";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const token = localStorage.getItem("AUTH_TOKEN");

  const { data, isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!token,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { data, isError: !token || isError, isLoading };
};

export default useAuth;
