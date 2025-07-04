import axios from "axios";
import profile_icon from "../assets/profile_icon.png";
const transformBlogs = (blogs) => {
  return blogs.map((blog) => ({
    iconpath: profile_icon,
    time: formatTime(blog.createdAt),
    title: blog.title,
    text: blog.content,
    whoposted: blog.authorUsername|| 'authorName',
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
      `https://byteblitz-backend.onrender.com/api/v1/blog?page=${page}&limit=${limit}`
    );
    console.log(response.data)
    const blogs = transformBlogs(response.data?.blogs);
    const data = {
      blogs,
      totalPages: response.data.totalPages
    }

    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null; 
  }
};

export const getUserBlogs = async (username,page=1,limit=10)  => {
  try {
    const response = await axios.get(
      `https://byteblitz-backend.onrender.com/api/v1/user/${username}/blog?page=${page}&limit=${limit}`
    );
    console.log(response.data)
    const blogs = transformBlogs(response.data?.blogs);
    const data = {
      blogs,
      totalPages: response.data.totalPages
    }
    // console.log('obj',obj)
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null; // Return null in case of an error
  }
};

export const postBlog = async (data) => {
  // Get token from localStorage or wherever you store it
  const token = localStorage.getItem('token'); // or however you store it
  
  const response = await axios.post(
    `https://byteblitz-backend.onrender.com/api/v1/blog/postblog`,
    data,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  );
  return response.data;
};