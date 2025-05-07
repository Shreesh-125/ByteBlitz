import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import stylesall from "../styles/Allblogs.module.css";
import Blog from "../ui/Blog";
import { getHomeInfo } from "../servers/getHomeInfo";
import { getUserBlogs } from "../servers/getAllBlogs";
import Loader from "../ui/Loader";
import Homesidebar from "./Homesidebar";
import Pagination from "../ui/Pagination";

const MyBlogs = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const user = useSelector((state) => state.auth.user);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Redirect to home if not authenticated and set username
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      setUsername(user.username);
    }
  }, [user, navigate]);

  const { data: blogData, isLoading } = useQuery({
    queryKey: ["blogs", username, page],
    queryFn: () => getUserBlogs(username, page, limit),
    enabled: !!username, // Only run the query if username exists
  });

  const { isLoading: isLoadingSidebar, data: homeData } = useQuery({
    queryKey: ["homedata"],
    queryFn: () => getHomeInfo(),
    enabled: !!user, // Only run the query if user exists
  });

  if (!user) {
    return null; // Return null while redirect happens
  }

  return (
    <div className={stylesall.allBlogsPageContainer}>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={stylesall.leftSideContainer}>
          <ul>
            {blogData?.blogs?.map((blog, index) => (
              <Blog blog={blog} index={index} key={index} />
            ))}
          </ul>
          <Pagination
            currentPage={page}
            setCurrentPage={setPage}
            totalPages={blogData?.totalPages}
          />
        </div>
      )}
      <div className={stylesall.rightSideContainer}>
        {homeData && <Homesidebar data={homeData.topUsers} timeData={homeData} />}
      </div>
    </div>
  );
};

export default MyBlogs;