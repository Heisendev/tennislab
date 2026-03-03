export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3003";

export const buildApiError = async (response: Response, fallbackMessage: string) => {
  try {
    const data = await response.json();
    const message = data?.error || data?.message;
    return new Error(message || fallbackMessage);
  } catch {
    return new Error(fallbackMessage);
  }
};

export const ensureOk = async (response: Response, fallbackMessage: string) => {
  if (!response.ok) {
    throw await buildApiError(response, fallbackMessage);
  }
};