import styles from "../styles/Problems.module.css";
import Searchbar from "../ui/Searchbar";
import ProblemsTable from "../ui/ProblemsTable";
import Upcomingcontest from "../ui/Upcomingcontest";
import LastUnsolved from "../ui/LastUnsolvedTable";
import { ProblemsProvider } from "../context/ProblemsContext";

const Problems = () => {
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
            <LastUnsolved />
          </div>
        </div>
      </div>
    </ProblemsProvider>
  );
};

export default Problems;
