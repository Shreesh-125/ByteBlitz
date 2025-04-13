import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../hooks/useDebounce"; // debounce hook
import styles from "../styles/Usersearch.module.css";
import white_arrow from "../assets/white_arrow.png";
import search_icon from "../assets/search_icon.png";

const fetchUsers = async (search) => {
  const { data } = await axios.post(`/api/v1/user/find/findusers`, {
    username: search,
  });
  console.log(data);
  return data?.users;

};
const Usersearch = () => {
  const [inputValue, setInputValue] = useState("");
  const debouncedSearch = useDebounce(inputValue, 400);

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["users2", debouncedSearch],
    queryFn: () => fetchUsers(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headertext}>
          <p>Find User</p>
        </div>
        <div>
          <img src={white_arrow} alt="Arrow" className={styles.white_arrow} />
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.inputBox}>
          <img
            src={search_icon}
            alt="Search Icon"
            className={styles.searchIcon}
          />
          <input
            type="text"
            placeholder="Enter Username..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      {isLoading && <p className={styles.loadingText}>Loading...</p>}
      {!isLoading && suggestions.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions.map((user) => (
            <li key={user.username} className={styles.suggestionItem}>
              {user.username}
            </li>
          ))}
        </ul>
      )}

      {!isLoading &&
        debouncedSearch.length >= 2 &&
        suggestions.length === 0 && (
          <p className={styles.noResultText}>No users found</p>
        )}
    </div>
  );
};

export default Usersearch;
