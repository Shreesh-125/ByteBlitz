import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/StandingsPageSearchBar.module.css';
import search_icon from '../assets/search_icon.png';
import dropdown_arrow from '../assets/dropdownarrow.png'; // Import your dropdown arrow image

const StandingsPageSearchBar = ({ onSearch, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [countryInput, setCountryInput] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleApply = () => {
        onFilter && onFilter({
            countryInput
        });
        onSearch && onSearch(searchTerm);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleApply();
        }
    };

    return (
        <div className={styles.standingsSearchContainer}>
        <div className={styles.searchSection}>
            <span className={styles.searchIcon}>
            <img src={search_icon} alt="Search" />
            </span>
            <input
                type="text"
                className={styles.searchInput}
                placeholder="Enter username "
                value={searchTerm}
                onChange={handleSearch}
                onKeyDown={handleKeyPress}
            />
        </div>

        <div className={styles.filterSection}>
            <span className={styles.filterLabel}>Filter By Country</span>

            <input
                type="text"
                className={styles.countryInput}
                placeholder="e.g. India"
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                onKeyDown={handleKeyPress}
            />
        </div>
        <div>
            <button className={styles.applyButton} onClick={handleApply}>
                APPLY
            </button>
        </div>
        </div>
    );
};

export default StandingsPageSearchBar;