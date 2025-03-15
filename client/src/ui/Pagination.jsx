import React, { useState } from "react";
import styles from "../styles/Pagination.module.css";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
    const handlePageChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= totalPages) {
            setCurrentPage(value);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowRight" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        } else if (e.key === "ArrowLeft" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className={styles.pagination}>
            <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
            >
                ⏮ First
            </button>
            <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                ◀ Prev
            </button>
            <input
                type="number"
                className={styles.pageInput}
                value={currentPage}
                onChange={handlePageChange}
                onKeyDown={handleKeyDown}
                min="1"
                max={totalPages}
            />
            <span className={styles.totalPages}> / {totalPages}</span>
            <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next ▶
            </button>
            <button
                className={styles.pageBtn}
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
            >
                Last ⏭
            </button>
        </div>
    );
};

export default Pagination;