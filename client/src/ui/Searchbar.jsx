import React, { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "../styles/Searchbar.module.css";
import { FiX } from "react-icons/fi";
import { ProblemsContext } from "../context/ProblemsContext";
import fetchProblems from "./../servers/getProblem.js";
import SmallLoader from "./SmallLoader.jsx";

const Searchbar = () => {
  const {
    minRating,
    setMinRating,
    maxRating,
    page,
    setPage,
    setTotalPages,
    setMaxRating,
    tags,
    setTags,
    setProblems,
    setIsLoading,
    setIsError,
  } = useContext(ProblemsContext);

  // Initial fetch without filters
  const { isLoading, isError, refetch } = useQuery({
    queryKey: ["problems", minRating, maxRating, tags, page],
    queryFn: () => fetchProblems({ page, minRating, maxRating, tags }),
    enabled: false, // Disable automatic refetching
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setIsError(false);

      try {
        const data = await fetchProblems({ page });
        setTotalPages(data.totalPages);
        setProblems(data.transformedData);
      } catch (error) {
        console.log(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [page, setIsError, setIsLoading, setProblems, setTotalPages]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (!tags.includes(value)) {
      setTags([...tags, value]);
    }
  };

  const removeTag = (tagName) => {
    setTags((tags) => tags.filter((tag) => tag !== tagName));
  };

  const handleApplyingFilters = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      setPage(1);
      const { data } = await refetch();
      setTotalPages(data.totalPages);
      setProblems(data.transformedData);
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // if (isLoading) return <Loader />;

  return (
    <div className={styles.searchBar}>
      <div className={styles.heading}>Filters</div>
      <div className={styles.filters}>
        <div className={styles.filtersOptions}>
          <div className={styles.selectContainer}>
            <select id="status" name="status" onChange={handleSelectChange}>
              <option value="">Select Status</option>
              <option value="Accepted">Accepted</option>
              <option value="Attempted">Attempted</option>
            </select>
          </div>

          <div className={styles.selectContainer}>
            <select id="tags" name="tags" onChange={handleSelectChange}>
              <option value="">Select Tag</option>
              <option value="Graph Theory">Graph Theory</option>
              <option value="Flood Fill">Flood Fill</option>
            </select>
          </div>

          <div className={styles.difficulty}>
            Difficulty
            <div className={styles.difficultyRight}>
              <input
                type="number"
                placeholder="Min"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              />
              -
              <input
                type="number"
                placeholder="Max"
                value={maxRating}
                onChange={(e) => setMaxRating(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Selected Filters */}
        {tags.length > 0 && (
          <div className={styles.selectedFilters}>
            {tags.map((tag, index) => (
              <div key={index} className={styles.selectedFilter}>
                {tag}
                <span
                  onClick={() => removeTag(tag)}
                  className={styles.crossIcon}
                >
                  <FiX size={18} />
                </span>
              </div>
            ))}
          </div>
        )}

        <div className={styles.submit}>
          <button type="submit" onClick={handleApplyingFilters}>
            Apply Filters
          </button>
        </div>

        {/* Show loading or error messages */}
        {isLoading && <SmallLoader />}
        {isError && <p style={{ color: "red" }}>Failed to fetch problems.</p>}
      </div>
    </div>
  );
};

export default Searchbar;
