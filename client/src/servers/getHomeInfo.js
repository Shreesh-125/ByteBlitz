import axios from "axios";
export const getHomeInfo = async () => {
  console.log("checkar")
  console.log(import.meta.env.VITE_BACKEND_URI);
  
  const URL = `${import.meta.env.VITE_BACKEND_URI}/api/v1/user`;
  const response = await axios.get(URL);
  console.log(response)

  return response.data;
};
