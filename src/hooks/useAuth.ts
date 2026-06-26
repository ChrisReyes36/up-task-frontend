import { getUser } from "@/api/AuthAPI";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { data, isError, isLoading };
};

export default useAuth;
