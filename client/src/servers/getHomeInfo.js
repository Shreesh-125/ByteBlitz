import axios from "axios";
export const getHomeInfo = async () => {
  const URL = `http://localhost:8000/api/v1/user`;
  const response = await axios.get(URL);

  return response.data;
};
