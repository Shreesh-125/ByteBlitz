import axios from "axios";
export const getHomeInfo = async () => {
  console.log("checkar")
  const URL = `http://localhost:8000/api/v1/user`;
  const response = await axios.get(URL);
  console.log(response)

  return response.data;
};
