const monthMap = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

export const formattedResult = (apiData) => {
  return Object.entries(apiData).map(([dateStr, count]) => {
    const [month, day, year] = dateStr.split(" ");
    const formattedDate = `${year}-${monthMap[month]}-${day.padStart(2, "0")}`;
    return { date: formattedDate, count };
  });
};

export const formatSubmissions = (submissions=[]) => {
  return submissions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
    .map((submission) => {
      const dateObj = new Date(submission.date);
      return {
        when: {
          date: dateObj.toISOString().slice(2, 10).replace(/-/g, "-"),
          time: dateObj.toISOString().slice(11, 16),
        },
        problemId: submission.problemId,
        lang: submission.language,
        solutionstatus: submission.status === "Accepted",
      };
    });
};
