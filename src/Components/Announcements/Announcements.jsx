import React from 'react';
import styles from './Announcements.module.css';
import goldentrophy from '../../assets/goldentrophy.png';
import profile_icon from '../../assets/profile_icon.png';  // Fixed typo

const Announcements = () => {
  const content = [
    {
      iconpath: goldentrophy,
      time: 'a day ago',
      title: 'Join our Weekly Contest 457',
      text: 'We are happy to announce this contest and hope you participate in it.'
    },
    {
      iconpath: profile_icon,
      time: '8 days ago',
      title: 'An anonymous user posted',
      text: 'Education: Tier 2, 10 years of experience. Current: 42.5 LPA + 10% variable. Offered by Atlassian: 65 LPA Signing...'
    },
    {
      iconpath: profile_icon,
      time: '8 days ago',
      title: 'Meta Onsite Interview Experience',
      text: 'Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)...'
    },
    {
      iconpath: profile_icon,
      time: '8 days ago',
      title: 'Meta Onsite Interview Experience',
      text: 'Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)...'
    },
    {
      iconpath: profile_icon,
      time: '8 days ago',
      title: 'Meta Onsite Interview Experience',
      text: 'Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)...'
    },
    {
      iconpath: profile_icon,
      time: '8 days ago',
      title: 'Meta Onsite Interview Experience',
      text: 'Just finished Meta onsite, sharing questions to give back to the community. Phone screen: Subarray Sum Equals K (only positive numbers)...'
    }
  ];

  return (
    <div>
      <ul className={styles.list}>
        {content.map(({ iconpath, time, title, text }, index) => (
          <li key={`${title}-${index}`} className={styles.listitem}>
            <div className={styles.icon}>
              <img src={iconpath} alt="Icon" className={styles.iconimage} />
            </div>
            <div className={styles.info}>
              <p className={styles.time}>{time}</p>
              <p className={styles.title}><strong>{title}</strong></p>
              <p className={styles.text}>{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcements;
