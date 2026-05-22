const BASE_URL = "/api"

export type ApiError = {
  status: number;
  data: unknown;
};

function getToken(): string | null {
  return sessionStorage.getItem("token");
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) headers.set("Authorization", `Token ${token}`);

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  const contentType = res.headers.get("content-type") ?? "";
  const data: unknown = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) throw { status: res.status, data } satisfies ApiError;

  return data as T;
}