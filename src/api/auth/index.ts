import API from "..";

interface LoginCredentials {
  email: string;
  password: string;
}

export const login = async (data: LoginCredentials) => {
  try {
    const response = await API.post("/user/signin", data);
    return response;
  } catch (error) {
    return error.response;
  }
};
