import api from "./axios";

export async function loginRequest({ username, password }) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });

  const accessToken = data?.accessToken || data?.token;
  if (!accessToken) {
    const error = new Error("Login response did not include an access token.");
    error.appMessage = "Login failed. Please try again.";
    throw error;
  }

  return {
    accessToken,
    refreshToken: data.refreshToken || "",
    user: {
      id: data.id,
      username: data.username || username,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      image: data.image || "",
    },
  };
}
