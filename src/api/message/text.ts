import API from "..";

export const sendMessage = async (data: any) =>
  (await API.post("/message/", data))?.data?.data || {};
