import React, { useContext, useEffect } from 'react'
import styles from '../styles/Searchbar.module.css'
import searchIcon from '../assets/searchIcon.png'
import { FiX } from 'react-icons/fi';
import { ProblemsContext } from '../context/ProblemsContext';

const Searchbar = () => {
    const { minRating, setMinRating, maxRating, setMaxRating, searchQuery, setSearchQuery, tags, setTags } = useContext(ProblemsContext);

    const handleSelectChange = (event) => {
        console.log("hey")
        const value = event.target.value;

        // Avoid duplicate tags
        if (!tags.includes(value)) {
            setTags([...tags, value]);
        }
    };

    const removeTag = (tagName) => {
        setTags(tags => tags.filter(tag => tag !== tagName));
    }

    const handleApplyingFilters = () => {
        // logic to  fetch data based on the filers applied
    }
    
    return (
        <div className={styles.searchBar}>
            <div className={styles.heading}>
                Filters
            </div>
            <div className={styles.filters}>

                {/* Filters Options */}
                <div className={styles.filtersOptions}>


                    <div className={styles.selectContainer}>
                        <select id="status" name="status" onChange={handleSelectChange}>
                            <option value="Accepted">Accepted</option>
                            <option value="Attempted">Attempted</option>
                        </select>
                    </div>

                    <div className={styles.selectContainer}>
                        <select id="tags" name="tags" onChange={handleSelectChange}>
                            <option value="Greedy">Greedy</option>
                            <option value="DP">DP</option>
                        </select>
                    </div>

                    <div className={styles.difficulty}>
                        Difficulty
                        <div className={styles.difficultyRight}>
                            <input type="number" value={minRating} onChange={(e) => setMinRating(e.target.value)} />
                            -
                            <input type="number" value={maxRating} onChange={(e) => setMaxRating(e.target.value)} />
                        </div>
                    </div>
                    <div className={styles.searchQuestion}>
                        <img src={searchIcon} alt="searchIcon" />
                        <input type="text" placeholder='Search a Question...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>

                {/* Selected Filters */}
                <div className={styles.selectedFilters}>
                    {
                        tags.map((tag, index) => (
                            <div key={index} className={styles.selectedFilter}>
                                {tag}
                                <span onClick={() => removeTag(tag)} className={styles.crossIcon}>
                                    <FiX size={18} />
                                </span>
                            </div>
                        ))
                    }
                </div>
                <div className={styles.submit}>
                    <button type='submit' onClick={handleApplyingFilters}>
                        Apply
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Searchbar