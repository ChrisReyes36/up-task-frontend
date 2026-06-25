import { isAxiosError } from "axios";
import api from "@/lib/axios";
import type {
  ConfirmToken,
  RequestConfirmationCodeForm,
  UserLoginForm,
  UserRegistrationForm,
} from "@/types";

export async function createAccount(formData: UserRegistrationForm) {
  try {
    const { data } = await api.post<string>("/auth/create-account", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function confirmAccount(formData: ConfirmToken) {
  try {
    const { data } = await api.post<string>("/auth/confirm-account", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function requestConfirmationCode(
  formData: RequestConfirmationCodeForm,
) {
  try {
    const { data } = await api.post<string>("/auth/request-code", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}

export async function authenticateUser(formData: UserLoginForm) {
  try {
    const { data } = await api.post<string>("/auth/login", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error, { cause: error });
    }
  }
}
