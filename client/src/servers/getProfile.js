import axios from "axios";

export const getProfile = async (user, token) => {
  if (!user?.username) {
    console.log("User is undefined or missing username");
    return null;
  }

  const URL = `http://localhost:8000/api/v1/user/${user.username}`;
  console.log("Fetching:", URL);

  try {
    if (!token) {
      console.log("Token is undefined");
      return null;
    }

    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;
    console.log("User Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error);
    return null;
  }
};
