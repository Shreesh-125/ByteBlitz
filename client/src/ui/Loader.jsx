import React from 'react';
import styles from '../styles/Loader.module.css'; // Assuming you will create a separate CSS file for the loader styles

const Loader = () => {
  return (
    <div className={styles.loader_container}>
        <div className={styles.loader}>
        <div className={styles.loader_inner}></div>
        </div>
    </div>
  );
};

export default Loader;