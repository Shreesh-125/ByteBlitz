export const ColorRankHandler = (rating) => {
    if (rating < 1200) {
        return { rank: "Beginner", color: "#808080" }; // Gray
    } 
    else if (rating < 1400) {
        return { rank: "Apprentice", color: "#008000" }; // Green
    } 
    else if (rating < 1600) {
        return { rank: "Adept", color: "#03A89E" }; // Cyan
    } 
    else if (rating < 1900) {
        return { rank: "Master", color: "#FFA500" }; // Orange
    } 
    else if (rating < 2100) {
        return { rank: "Warlord", color: "#800080" }; // Purple
    } 
    else if (rating < 2300) {
        return { rank: "Legend", color: "#FFD700" }; // Gold
    } 
    else {
        return { rank: "GrandLegend", color: "#FF4500" }; // Deep Orange-Red
    }
};
