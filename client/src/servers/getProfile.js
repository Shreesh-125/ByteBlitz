import axios from "axios";

export const getProfile = async (user) => {
  if (!user?.userName) {
    console.log("User is undefined or missing userName");
    return null;
  }

  const URL = `http://localhost:8000/api/v1/user/${user.userName}`;
  console.log("Fetching:", URL);

  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
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
