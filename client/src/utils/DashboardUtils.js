export const getCalendarGrid = (startDate, endDate) => {
    const startingDate = new Date(startDate);
    const endingDate = new Date(endDate);
  
    const adjustedStartDate = new Date(startingDate);
    adjustedStartDate.setDate(startingDate.getDate() - startingDate.getDay());
  
    const adjustedEndDate = new Date(endingDate);
    adjustedEndDate.setDate(endingDate.getDate() + (6 - endingDate.getDay()));
  
    const daysInAdjustedRange =
      Math.ceil((adjustedEndDate - adjustedStartDate) / (1000 * 60 * 60 * 24)) +
      1;
  
    return Array.from({ length: daysInAdjustedRange }, (_, i) => {
      const date = new Date(adjustedStartDate);
      date.setDate(adjustedStartDate.getDate() + i);
      return {
        dateString: date.toLocaleDateString("en-CA"),
        month: date.toLocaleString("default", { month: "short" }),
        day: date.getDate(),
        isInOriginalRange: date >= startingDate && date <= endingDate,
      };
    });
  };
  
  export const getColorFromCount = (count) => {
    const colorCodes = {
      0: "#DBE4E1",
      1:  "#D8E2DE",
      2: "#DFE6E4",
      3: "#5A936C",
      4: "#4CCE6E",
      5: "#4CCE6E",
      default: "#217A31",
    };
    return colorCodes[count] || colorCodes.default;
  };
  
  export const getMonthLabels = (calendarGrid) => {
    let monthLabels = [];
    let lastMonth = "";
    let currentStartIndex = 0;
  
    calendarGrid.forEach(({ month }, index) => {
      if (month !== lastMonth) {
        if (lastMonth) {
          monthLabels.push({
            month: lastMonth,
            index: currentStartIndex,
            span: index - currentStartIndex,
          });
        }
        lastMonth = month;
        currentStartIndex = index;
      }
    });
  
    if (lastMonth) {
      monthLabels.push({
        month: lastMonth,
        index: currentStartIndex,
        span: calendarGrid.length - currentStartIndex,
      });
    }
  
    return monthLabels;
  };
