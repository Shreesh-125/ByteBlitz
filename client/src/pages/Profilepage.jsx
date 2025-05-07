import React from "react";
import Profilepagesidebar from "./Profilepagesidebar";
import Profilepageleftbar from "./Profilepageleftbar";
import styles from "../styles/Profilepage.module.css";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../servers/getProfile";
import Loader from "../ui/Loader.jsx";
import { useParams } from "react-router-dom";

const Profilepage = () => {
  const { username } = useParams();
  const user = useSelector((state) => state.auth.user);
  
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => getProfile(username),
    enabled: !!username,
  });


  if (isLoading) return <Loader />;

  return (
    <div style={{ marginTop: 40 }}>
      {user ? (
        <div className={styles.container}>
          <Profilepageleftbar isUser={username===user?.username} userData={userData} className={styles.left} />
          <Profilepagesidebar userData={userData} className={styles.right} />
        </div>
      ) : (
        <div>Please login</div>
      )}
    </div>
  );
};

export default Profilepage;
