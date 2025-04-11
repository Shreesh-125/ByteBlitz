import React from "react";
import Announcements from "../ui/Announcements";
import styles from "../styles/Home.module.css";
import Homesidebar from "./Homesidebar";
import { useQuery } from "@tanstack/react-query";
import { getHomeInfo } from "../servers/getHomeInfo";
import { Loader } from "lucide-react";
const Home = () => {
  const { isLoading, data: homeData } = useQuery({
    queryKey: ["homedata"],
    queryFn: () => getHomeInfo(),
  });
  if (isLoading) return <Loader />;
  return (
    <div className={styles.home}>
      {homeData.Blogs && <Announcements data={homeData.Blogs} />}
      {homeData && <Homesidebar data={homeData.topUsers} />}
    </div>
  );
};

export default Home;
