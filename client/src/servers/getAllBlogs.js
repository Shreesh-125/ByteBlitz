import axios from "axios";
import profile_icon from "../assets/profile_icon.png";
const transformBlogs = (blogs) => {
  return blogs.map((blog) => ({
    iconpath: profile_icon,
    time: formatTime(blog.createdAt),
    title: blog.title,
    text: blog.content,
    whoposted: blog.author?.username || 'authorName',
  }));
};

const formatTime = (dateString) => {
  const postDate = new Date(dateString);
  const currentDate = new Date();
  const diffInMs = currentDate - postDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays === 0
    ? "Today"
    : diffInDays === 1
    ? "1 day ago"
    : `${diffInDays} days ago`;
};
export const getAllBlogs = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/blog?page=${page}&limit=${limit}`
    );
    console.log(response.data)
    const blogs = transformBlogs(response.data?.blogs);
    const data = {
      blogs,
      totalPages: response.data.totalPages
    }
    // console.log('obj',obj)
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null; // Return null in case of an error
  }
};
