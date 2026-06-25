import { useState } from "react";
import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";

export default function NewPassword() {
  const [token, setToken] = useState<string[]>([]);
  const [isValidadToken, setIsValidToken] = useState(false);

  return (
    <>
      <h1 className="text-5xl font-black text-white">Restablecer password</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste {""}
        <span className=" text-fuchsia-500 font-bold">por email</span>
      </p>

      {!isValidadToken ? (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </>
  );
}
