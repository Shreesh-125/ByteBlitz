import axios from "axios";

export const getPaginatedSubmission = async (
  username,
  page = 1,
  limit = 20,
  token
) => {
  try {
    const url = `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/${username}/submissions?page=${page}&limit=${limit}`;
    console.log("Fetching:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      return {
        submissions: response.data.submissions,
        pagination: response.data.pagination,
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch submissions");
    }
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return { submissions: [], pagination: null, error: error.message };
  }
};
