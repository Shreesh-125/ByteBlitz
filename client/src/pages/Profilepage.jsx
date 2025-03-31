import React from "react";
import Profilecontainer from "../ui/Profilecontainer";
import Profilepagesidebar from "./Profilepagesidebar";
import Profilepageleftbar from "./Profilepageleftbar";
import styles from "../styles/Profilepage.module.css";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../servers/getProfile";
const Profilepage = () => {
  const user = useSelector((state) => state.auth.user);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: () => getProfile(user),
    enabled: !!user,
  });

  return (
    <div style={{ marginTop: 40 }}>
      {user ? (
        <div className={styles.container}>
          <Profilepageleftbar userData={userData} className={styles.left} />
          <Profilepagesidebar userData={userData} className={styles.right} />
        </div>
      ) : (
        <div>login please</div>
      )}
    </div>
  );
};

export default Profilepage;
