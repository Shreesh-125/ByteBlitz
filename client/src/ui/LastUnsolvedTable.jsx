import { useQuery } from "@tanstack/react-query";
import styles from "../styles/LastUnsolved.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRecentSub } from "../servers/getRecentSub";
import { Loader } from "lucide-react";

const LastUnsolved = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const { isLoading, data } = useQuery({
    queryKey: ["recentSubmission"],
    queryFn: () => getRecentSub(user, token),
    enabled: !!user,
  });
  console.log(data);

  if (isLoading) return <Loader />;

  return (
    <div className={styles.grid}>
      <div className={styles.gridContainer}>
        <div className={styles.heading}>Recent Submissions</div>
        {/* Header */}
        <div className={`${styles.gridRow} ${styles.gridHeader}`}>
          <div>Title</div>
          <div>Your Submissions</div>
        </div>
        {data?.map((problem, index) => (
          <div key={index} className={styles.gridRow}>
            <div className={styles.gridRowItem}>{problem.title}</div>
            <Link to={`/problems/${problem.problemId}`}>
              <div className={`${styles.gridRowItem} ${styles.gridRowLink}`}>
                {/* {problem.link} */}
                click
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LastUnsolved;
