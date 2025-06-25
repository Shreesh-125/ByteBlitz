import React from "react";
import Profilecontainer from "../ui/Profilecontainer";
import Heatmap from "../ui/Heatmap";
import Bargraph from "../ui/bargraph";
import styles from "../styles/Profilepageleftbar.module.css";
import { formattedResult } from "../utils/profileUtils";

const Profilepageleftbar = ({ userData, isUser }) => {
  const submissionCalendarData =
    userData?.user?.submissionCalender &&
    formattedResult(userData?.user?.submissionCalender);
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 1);
  const formatDate = (date) => date.toISOString().split("T")[0];

  return (
    <div className={styles.container}>
      <Profilecontainer isUser={isUser} userData={userData} />
      <Heatmap
        startDate={formatDate(startDate)}
        endDate={formatDate(endDate)}
        dataValues={submissionCalendarData}
      />
      {/* <Bargraph /> */}
    </div>
  );
};
export default Profilepageleftbar;
