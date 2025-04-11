import axios from "axios";

const fetchProblems = async ({
  page = 1,
  minRating = 0,
  maxRating = 5000,
  tags = "",
}) => {
  try {
    const response = await axios.get("http://localhost:8000/api/v1/problem", {
      params: {
        minRating,
        maxRating,
        page,
        tags: tags.length ? tags.join(",") : "",
      },
    });

    const { problems } = response.data;

    const transformedData = problems.map((problem) => ({
      id: problem.problemId,
      title: problem.questionTitle,
      rating: problem.rating,
      solvedBy: problem.solvedBy || 0,
      status: problem.status || "Unattempted",
    }));
    return { transformedData, totalPages: response.data.totalPages };
  } catch (error) {
    console.error("Error fetching problems:", error);
    throw new Error("Failed to fetch problems. Please try again later.");
  }
};

export default fetchProblems;
