
import axios from 'axios'

export const getRankingList=async(page,limit)=>{
    const response=await axios(`${import.meta.env.VITE_BACKEND_URI}/api/v1/user/global/ranking?page=${page}&limit=${limit}`);
    return response.data;
}