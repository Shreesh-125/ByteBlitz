import styles from "../styles/Particularblog.module.css";
import stylesall from "../styles/Allblogs.module.css";
import downvote_icon from "../assets/downvote_icon.png";
import upvote_icon from "../assets/upvote_icon.png";
import { useState } from "react";

function Blog({ blog, index }) {
  const [votecount, setVotecount] = useState(0);
  return (
    <div>
      <li
        className={`${styles.blogcontainer} ${stylesall.blogitem}`}
        key={index}
      >
        <div className={styles.header}>
          <p className={styles.title}>{blog.title}</p>
          <p className={styles.whopostedtime}>
            By {blog.whoposted}, {blog.time}
          </p>
        </div>
        <div className={styles.blogtext}>
          <p>{blog.text}</p>
        </div>
        <div className={styles.votes}>
          <button
            onClick={() => setVotecount(votecount + 1)}
            className={styles.downvotebtn}
          >
            <img className={styles.upvote} src={upvote_icon} />
          </button>
          <p>{votecount}</p>
          <button
            onClick={() => setVotecount(votecount - 1)}
            className={styles.downvotebtn}
          >
            <img className={styles.downvote} src={downvote_icon} />
          </button>
        </div>
      </li>
    </div>
  );
}

export default Blog;
