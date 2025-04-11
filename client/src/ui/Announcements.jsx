import React, { createContext } from "react";
import styles from "../styles/Announcements.module.css";
import goldentrophy from "../assets/goldentrophy.png";
import profile_icon from "../assets/profile_icon.png";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/HomePageUtils";

export const BlogData = createContext();

const Announcements = ({ data }) => {
  const content = [
    {
      iconpath: goldentrophy,
      time: "a day ago",
      title: "Join our Weekly Contest 457",
      text: "We are happy to announce this contest and hope you participate in it.",
      whoposted: "Manu_codeup",
    },
    {
      iconpath: profile_icon,
      time: "8 days ago",
      title: "An anonymous user posted",
      text: "Education: Tier 2, 10 years of experience. Current: 42.5 LPA + 10% variable. Offered by Atlassian: 65 LPA Signing Education: Tier 2, 10 years of experience. Current: 42.5 LPA + 10% variable. Offered by Atlassian: 65 LPA Signing Education: Tier 2, 10 years of experience. Current: 42.5 LPA + 10% variable. Offered by Atlassian: 65 LPA Signing",
      whoposted: "Manu_codeup",
    },
    {
      iconpath: profile_icon,
      time: "8 days ago",
      title: "Meta Onsite Interview Experience",
      text: "Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)",
      whoposted: "Manu_codeup",
    },
    {
      iconpath: profile_icon,
      time: "8 days ago",
      title: "Meta Onsite Interview Experience",
      text: "Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)",
      whoposted: "Manu_codeup",
    },
    {
      iconpath: profile_icon,
      time: "8 days ago",
      title: "Meta Onsite Interview Experience",
      text: "Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)",
      whoposted: "Manu_codeup",
    },
    {
      iconpath: profile_icon,
      time: "8 days ago",
      title: "Meta Onsite Interview Experience",
      text: "Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)",
      whoposted: "Manu_codeup",
    },
  ];

  const fixedLength = 190;
  const truncateText = (text, length) => {
    if (text.length > length) {
      return text.slice(0, length) + "...";
    }
    return text;
  };

  return (
    <div>
      <BlogData.Provider value={data}>
        <ul className={styles.list}>
          {data?.map(({ id, updatedAt, title, snippet, author }, index) => (
            <li key={`${title}-${index}`} className={styles.listitem}>
              <div className={styles.icon}>
                <img
                  src={profile_icon}
                  alt="Icon"
                  className={styles.iconimage}
                />
              </div>
              <div className={styles.info}>
                <p className={styles.time}>{formatDate(updatedAt)}</p>
                <p className={styles.title}>
                  <strong>
                    {title}, By {author}
                  </strong>
                </p>
                <div className={styles.text}>
                  <p>
                    {truncateText(snippet, fixedLength)}
                    {snippet.length > fixedLength && (
                      <Link to={`/blogs/${index}`} className={styles.readmore}>
                        Read more
                      </Link>
                    )}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </BlogData.Provider>
    </div>
  );
};

export default Announcements;
