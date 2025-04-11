import styles from "../styles/Problems.module.css";
import Searchbar from "../ui/Searchbar";
import ProblemsTable from "../ui/ProblemsTable";
import Upcomingcontest from "../ui/Upcomingcontest";
import LastUnsolved from "../ui/LastUnsolvedTable";
import { ProblemsProvider } from "../context/ProblemsContext";
import { useSelector } from "react-redux";

const Problems = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <ProblemsProvider>
      <div className={styles.problemsPage}>
        <div className={styles.container}>
          <div className={styles.leftSection}>
            <Searchbar />
            <ProblemsTable />
          </div>
          <div className={styles.rightSection}>
            <Upcomingcontest />
            {user && <LastUnsolved />}
          </div>
        </div>
      </div>
    </ProblemsProvider>
  );
};

export default Problems;
