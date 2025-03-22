
export function formatDateTime(timestamp) {
    const date = new Date(timestamp);

    // Get day of the week
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = days[date.getDay()];

    // Format date with ordinal suffix (1st, 2nd, 3rd, etc.)
    const day = date.getDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const ordinalSuffix = (n) => {
      if (n > 3 && n < 21) return "th"; // Covers 11th-13th exceptions
      switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    const formattedDate = `${day}${ordinalSuffix(day)} ${monthName} ${year}`;

    // Extract time in 24-hour format
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedTime = `${hours}:${minutes}`;

    return { dayName, formattedDate, formattedTime };
  }