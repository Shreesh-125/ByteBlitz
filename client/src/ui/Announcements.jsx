import React, {createContext} from 'react';
import styles from '../styles/Announcements.module.css';
import goldentrophy from '../assets/goldentrophy.png';
import profile_icon from '../assets/profile_icon.png'; 
import {Link} from "react-router-dom"

export const BlogData = createContext();

const Announcements = () => {
    const content = [
      {
        iconpath: goldentrophy,
        time: 'a day ago',
        title: 'Join our Weekly Contest 457',
        text: 'We are happy to announce this contest and hope you participate in it.',
        whoposted: 'Manu_codeup'
      },
      {
        iconpath: profile_icon,
        time: '8 days ago',
        title: 'An anonymous user posted',
        text: 'Education: Tier 2, 10 years of experience. Current: 42.5 LPA + 10% variable. Offered by Atlassian: 65 LPA Signing Education: Tier 2, 10 years of experience. Current: 42.5 LPA + 10% variable. Offered by Atlassian: 65 LPA Signing Education: Tier 2, 10 years of experience. Current: 42.5 LPA + 10% variable. Offered by Atlassian: 65 LPA Signing',
        whoposted: 'Manu_codeup'
      },
      {
        iconpath: profile_icon,
        time: '8 days ago',
        title: 'Meta Onsite Interview Experience',
        text: 'Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)',
        whoposted: 'Manu_codeup'
      },
      {
        iconpath: profile_icon,
        time: '8 days ago',
        title: 'Meta Onsite Interview Experience',
        text: 'Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)',
        whoposted: 'Manu_codeup'
      },
      {
        iconpath: profile_icon,
        time: '8 days ago',
        title: 'Meta Onsite Interview Experience',
        text: 'Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)',
        whoposted: 'Manu_codeup'
      },
      {
        iconpath: profile_icon,
        time: '8 days ago',
        title: 'Meta Onsite Interview Experience',
        text: 'Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)',
        whoposted: 'Manu_codeup'
      }
    ];
    const fixedLength = 190;
    const truncateText = (text, length) => {
      if (text.length > length) {
        return text.slice(0, length) + '...';
      }
      return text;
    };

    return (
      <div>
        <BlogData.Provider value={content}>
          <ul className={styles.list}>
            {content.map(({ iconpath, time, title, text, whoposted }, index) => (
              <li key={`${title}-${index}`} className={styles.listitem}>
                <div className={styles.icon}>
                  <img src={iconpath} alt="Icon" className={styles.iconimage} />
                </div>
                <div className={styles.info}>
                  <p className={styles.time}>{time}</p>
                  <p className={styles.title}><strong>{title}, By {whoposted}</strong></p>
                  <div className={styles.text}>
                    <p>
                      {truncateText(text, fixedLength)}
                      {/* {text.length > fixedLength && <a href={`/blog/${index}`} className={styles.readmore}> Read more</a>} */}
                      {text.length > fixedLength && <Link
                            to={`/blogs/${index}`}
                            className={styles.readmore}
                        >
                            Read more
                        </Link>}
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
