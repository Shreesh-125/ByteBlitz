import axios from "axios";

export const getContestProblem = async (contestId)=>{
    const response= await axios.get(`/api/v1/contest/${contestId}/problems`);
    return response.data;
}

export const getProblemInfo = async (problemId) =>{
    const response = await axios.get(`/api/v1/problem/${problemId}`);
    return response.data;
}

export const submitContestProblem = async(submissionData) =>{
    const response= await axios.post(`/api/v1/contest/${submissionData.problemId}/submitcode`);
    return response.data;
}
