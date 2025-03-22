import React from "react";
import {ColorRankHandler} from '../utils/Ratingmapping.js'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import styles from "../styles/Bargraph.module.css";

const CodingStatsChart = () => {
  // Data recreated from the image with added rank information
  const data = [
    { rating: 800, problems: 57 },
    { rating: 900, problems: 72 },
    { rating: 1000, problems: 88},
    { rating: 1200, problems: 87},
    { rating: 1300, problems: 55},
    { rating: 1400, problems: 40},
    { rating: 1500, problems: 25}
  ];

  // Custom tooltip using CSS modules
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{`Rating: ${payload[0].payload.rating}`}</p>
          <p className={styles.tooltipValue}>{`Problems: ${payload[0].payload.problems}`}</p>
          <p className={styles.tooltipRank} style={{ color: ColorRankHandler(payload[0].payload.rating).color }}>
            {`Rank: ${ColorRankHandler(payload[0].payload.rating).rank}`}
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className={styles.statsContainer}>
      <h2 className={styles.chartTitle}>No. of Problems v/s Rating</h2>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} className={styles.customGrid} />
          <XAxis 
            dataKey="rating" 
            tick={{ className: styles.axisLabel }} 
            axisLine={{ stroke: '#ccc' }}
            tickLine={false}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ className: styles.axisLabel }}
            domain={[0, 90]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
                dataKey="problems" 
                radius={[0, 0, 0, 0]} 
                barSize={40} 
                isAnimationActive={true}
                animationDuration={800}
                fill="#000000" 
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ColorRankHandler(entry.rating).color} />
                ))}
            </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Problems Solved</p>
          <p className={styles.statValue}>384</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Maximum Streak</p>
          <p className={styles.statValue}>38 Days</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Problems Solved for Last Month</p>
          <p className={styles.statValue}>32</p>
        </div>
      </div>
    </div>
  );
};

export default CodingStatsChart;