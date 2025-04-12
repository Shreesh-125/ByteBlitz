import React, { createContext } from "react";
import styles from "../styles/Announcements.module.css";
import profile_icon from "../assets/profile_icon.png";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/HomePageUtils";

export const BlogData = createContext();

const Announcements = ({ data }) => {
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
          {data?.map(({ updatedAt, title, snippet, author }, index) => (
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
