import { createContext, useContext, useState } from "react";

export const ProblemsContext = createContext();

// Provider component
export const ProblemsProvider = ({ children }) => {
    const [problems, setProblems] = useState([]);
    const [tags, setTags] = useState([])
    const [minRating, setMinRating] = useState('')
    const [maxRating, setMaxRating] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <ProblemsContext.Provider
            value={{
                problems,
                setProblems,
                tags,
                setTags,
                minRating,
                setMinRating,
                maxRating,
                setMaxRating,
                searchQuery,
                setSearchQuery
            }}
        >
            {children}
        </ProblemsContext.Provider>
    );
};

