import axios from "axios";

const fetchProblems = async ({ queryKey }) => {
  try {
    const [, minRating = 0, maxRating = 1000, tags = []] = queryKey;

    const response = await axios.get("http://localhost:8000/api/v1/problem", {
      params: {
        minRating,
        maxRating,
        tags: tags.length ? tags.join(",") : undefined,
      },
    });

    const { problems } = response.data;

    // Transform fetched data into required format
    const transformedData = problems.map((problem) => ({
      id: problem.problemId, // Use problemId as id
      title: problem.questionTitle, // Use questionTitle as title
      rating: problem.rating, // Use rating as is
      solvedBy: problem.solvedBy || 0, // Default solvedBy to 0 if missing
      status: problem.status || "Unattempted", // Default status if missing
    }));

    console.log("Transformed Problems Data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Error fetching problems:", error);
    throw new Error("Failed to fetch problems. Please try again later.");
  }
};

export default fetchProblems;
