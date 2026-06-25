import { useState } from "react";
import { Link } from "react-router-dom";
import { PinInput } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ConfirmToken } from "@/types";
import { confirmAccount } from "@/api/AuthAPI";

export default function ConfirmAccountView() {
  const [token, setToken] = useState<string[]>([]);

  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
    },
  });

  const handleChange = (details: { value: string[] }) => {
    setToken(details.value);
  };

  const handleComplete = () => {
    const tokenGenerated: ConfirmToken["token"] = token.join("");
    mutate({ token: tokenGenerated });
  };

  return (
    <>
      <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>

      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste{" "}
        <span className="text-fuchsia-500 font-bold">por e-mail</span>
      </p>

      <form className="space-y-8 p-10 bg-white mt-10">
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
          to="/auth/request-code"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
