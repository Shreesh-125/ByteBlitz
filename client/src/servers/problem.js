import axios from "axios";

export const submitCustomTestCase = async({ languagecode, value,customInput })=>{
    const response= await axios.post(`https://byteblitz-backend.onrender.com/api/v1/problem/customTestCase`,{ languagecode, value,customInput });

    return response.data;
}

export const getproblemInfoById= async(problemId)=>{
    const response=await axios.get(`https://byteblitz-backend.onrender.com/api/v1/problem/${problemId}`);
    return response.data.response;
}

export const submitCode= async({languageId,value,problemId})=>{
    const response= await axios.post(`https://byteblitz-backend.onrender.com/api/v1/problem/${problemId}/submitcode`,{languageId,code:value},{withCredentials:true});
    return response.data;
}

export const getUserProblemSubmissions = async({problemId,userId})=>{
    const response = await axios.get(`https://byteblitz-backend.onrender.com/api/v1/problem/${problemId}/submissions/${userId}`);
    return response.data;
}