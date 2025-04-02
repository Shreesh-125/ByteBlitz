import { createContext, useContext, useEffect, useState } from "react";


const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isrunning,setIsrunning]= useState(null);
    const [isRegister,setIsRegister]=useState(null);

    return (
        <SocketContext.Provider value={{ socket, setSocket,isrunning,setIsrunning,isRegister,setIsRegister }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);