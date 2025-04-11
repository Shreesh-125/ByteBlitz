import axios from "axios";

export const postProblem=async(data)=>{
    const response= await axios.post(`/api/v1/admin/createproblem`,data);
    return response.data;
}

export const postContest=async (data)=>{
    const response= await axios.post(`/api/v1/admin/createcontest`,data);
    return response.data;
}