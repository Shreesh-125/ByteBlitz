import { Link } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import styles from "./Heatmap.module.css";
import {
  getCalendarGrid,
  getColorFromCount,
  getMonthLabels,
} from "../../utils/DashboardUtils.js";

const Heatmap = ({ startDate, endDate, dataValues }) => {
  const scrollContainerRef = useRef(null);
  const calendarGrid = getCalendarGrid(startDate, endDate);
  const monthLabels = getMonthLabels(calendarGrid);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className={styles.heatmapContainer} ref={scrollContainerRef}>
      <div
        className={styles.monthLabels}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${calendarGrid.length}, 1fr)`,
        }}
      >
        {monthLabels.map(({ month, index, span }) => (
          <div
            key={`${month}-${index}`}
            className={styles.monthLabel}
            style={{ gridColumn: `${index + 1} / span ${span}` }}
          >
            <b>{month}</b>
          </div>
        ))}
      </div>

      <div className={styles.heatmapContent}>
        <div className={styles.weekLabels}>
          {weekDays.map((day, index) => (
            <div key={index} className={styles.weekLabel}>
              <b>{day}</b>
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          {calendarGrid.map(({ dateString, isInOriginalRange }) => {
            let activityCount = isInOriginalRange
              ? dataValues.find((item) => item.date === dateString)?.count || 0
              : 0;
            const color =
              new Date(dateString) > new Date()
                ? "white"
                : getColorFromCount(activityCount);

            return (
              <Link
                key={dateString}
                to={`/posts?date=${dateString}`}
                className={styles.day}
                title={
                  isInOriginalRange
                    ? `${activityCount} Problems solved on ${dateString}`
                    : undefined
                }
                style={{ backgroundColor: color, transition: 0}}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
