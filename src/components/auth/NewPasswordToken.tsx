import type { Dispatch, SetStateAction } from "react";
import { PinInput } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ConfirmToken } from "@/types";
import { validateToken } from "@/api/AuthAPI";

type NewPasswordTokenProps = {
  token: string[];
  setToken: Dispatch<SetStateAction<string[]>>;
  setIsValidToken: Dispatch<SetStateAction<boolean>>;
};

export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  const { mutate } = useMutation({
    mutationFn: validateToken,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      setIsValidToken(true);
    },
  });

  const handleChange = (details: { value: string[] }) => {
    setToken(details.value);
  };

  const handleComplete = (details: { value: string[] }) => {
    const confirmationToken: ConfirmToken["token"] = details.value.join("");
    mutate({ token: confirmationToken });
  };

  return (
    <>
      <form className="space-y-8 p-10 rounded-lg bg-white mt-10">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center gap-5">
          <PinInput.Root
            otp
            value={token}
            onValueChange={handleChange}
            onValueComplete={handleComplete}
          >
            <PinInput.HiddenInput />

            <PinInput.Control className="flex gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <PinInput.Input
                  key={index}
                  index={index}
                  className="w-10 h-10 p-3 rounded-lg border border-gray-300 text-center outline-none"
                />
              ))}
            </PinInput.Control>
          </PinInput.Root>
        </div>
      </form>
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
