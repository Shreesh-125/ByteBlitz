import React, { useState, useEffect} from 'react';
import styles from './Usersearch.module.css';
import white_arrow from '../../assets/white_arrow.png';
import search_icon from '../../assets/search_icon.png';

const Usersearch = () => {
  const [inputvalue, setInputvalue] = useState('');

    const onClickHandler = async () => {
        try {
            const { data } = await axios.get(
                `https://dummyjson.com/products/search?q=${inputvalue}`
            );

            setSuggestions(data.products);
            } catch (error) {
                console.log(error);
            }
    }
    
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headertext}><p>Find User</p></div>
        <div>
          <img src={white_arrow} alt="Arrow" className={styles.white_arrow} />
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.inputBox}>
          <img src={search_icon} alt="Search Icon" className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Enter Username..." 
            value={inputvalue}
            onChange={(e) => setInputvalue(e.target.value)} 
            className={styles.input} 
          />
        </div>
        <div>
          <button className={styles.searchBtn} onClick={onClickHandler}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default Usersearch;