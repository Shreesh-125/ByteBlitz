
import axios from 'axios'

export const getRankingList=async(page,limit)=>{
    const response=await axios(`https://byteblitz-backend.onrender.com/api/v1/user/global/ranking?page=${page}&limit=${limit}`);
    return response.data;
}