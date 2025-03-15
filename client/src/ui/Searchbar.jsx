import React, { useContext } from 'react'
import styles from '../styles/Searchbar.module.css'
import searchIcon from '../assets/searchIcon.png'
import { FiX } from 'react-icons/fi';

const Searchbar = () => {
    return (
        <div className={styles.searchBar}>
            <div className={styles.heading}>
                Filters
            </div>
            <div className={styles.filters}>

                {/* Filters Options */}
                <div className={styles.filtersOptions}>


                    <div className={styles.selectContainer}>
                        <select id="status" name="status">
                            <option value="accepted">Accepted</option>
                            <option value="attempted">Attempted</option>
                        </select>
                    </div>

                    <div className={styles.selectContainer}>
                        <select id="tags" name="tags">
                            <option value="greedy">Greedy</option>
                            <option value="dp">DP</option>
                        </select>
                    </div>

                    <div className={styles.difficulty}>
                        Difficulty
                        <div className={styles.difficultyRight}>
                            <input type="text" />
                            -
                            <input type="text" />
                        </div>
                    </div>
                    <div className={styles.searchQuestion}>
                        <img src={searchIcon} alt="searchIcon" />
                        <input type="text" placeholder='Search a Question...' />
                    </div>
                </div>

                {/* Selected Filters */}
                <div className={styles.selectedFilters}>
                    <div className={styles.selectedFilter}>
                        Greedy
                        <FiX size={18} />
                    </div>
                    <div className={styles.selectedFilter}>
                        Binary Search
                        <FiX size={18} />
                    </div>
                    <div className={styles.selectedFilter}>
                        Greedy
                        <FiX size={18} />
                    </div>
                    <div className={styles.selectedFilter}>
                        Binary Search
                        <FiX size={18} />
                    </div>
                    <div className={styles.selectedFilter}>
                        Greedy
                        <FiX size={18} />
                    </div>
                    <div className={styles.selectedFilter}>
                        Binary Search
                        <FiX size={18} />
                    </div>
                    <div className={styles.selectedFilter}>
                        Greedy
                        <FiX size={18} />
                    </div>
                    <div className={styles.selectedFilter}>
                        Binary Search
                        <FiX size={18} />
                    </div>
                </div>
                <div className={styles.submit}>
                    <button>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Searchbar