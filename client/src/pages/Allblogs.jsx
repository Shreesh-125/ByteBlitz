import { useQuery } from "@tanstack/react-query";
import goldentrophy from "../assets/goldentrophy.png";
import profile_icon from "../assets/profile_icon.png";
import stylesall from "../styles/Allblogs.module.css";
import Blog from "../ui/Blog";
import { getHomeInfo } from "../servers/getHomeInfo";
import { getAllBlogs } from "../servers/getAllBlogs";
import { useState } from "react";
import Loader from "../ui/Loader";
import Homesidebar from "./Homesidebar";
import Pagination from "../ui/Pagination";
const Allblogs = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  let blogData


  const { data: blogDatas, isLoading } = useQuery({
    queryKey: ["blogs", page],
    queryFn: () => getAllBlogs(page, limit),
  });
  const { isLoading: isLoadingSidebar, data: homeData } = useQuery({
    queryKey: ["homedata"],
    queryFn: () => getHomeInfo(),
  });

  blogData = blogDatas?.blogs;
  return (
    <div className={stylesall.allBlogsPageContainer}>
      {
        isLoading ? (
          <Loader />
        ) : (
          <div className={stylesall.leftSideContainer}>
            <ul>
              {isLoading ? (
                <Loader />
              ) : (
                blogData?.map((blog, index) => (
                  <Blog blog={blog} index={index} key={index} />
                ))
              )}
            </ul>
            <Pagination
              currentPage={page}
              setCurrentPage={setPage}
              totalPages={blogDatas.totalPages}
            />
          </div>
        )
      }
      <div className={stylesall.rightSideContainer}>
        {homeData && <Homesidebar data={homeData.topUsers} timeData={homeData} />}
      </div>
    </div>
  );
};

export default Allblogs;
