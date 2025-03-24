import React from 'react';
import Profilecontainer from '../ui/Profilecontainer';
import Profilepagesidebar from './Profilepagesidebar';
import Profilepageleftbar from './Profilepageleftbar';
import styles from '../styles/Profilepage.module.css'
const Profilepage = () => {
  
  return (
    <div style={{ marginTop: 40 }}>
      <div className={styles.container}
      >
        <Profilepageleftbar className={styles.left}/>
        <Profilepagesidebar className={styles.right}/>
      </div>
    </div>
  );
};

export default Profilepage;
