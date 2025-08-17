import axios from "axios";

export const submitCustomTestCase = async({ languagecode, value,customInput })=>{
    console.log(value);
    
  
    const response= await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/problem/customTestCase`,{ languagecode, value,customInput });

    return response.data;
}

export const getproblemInfoById= async(problemId)=>{
    const response=await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/problem/${problemId}`);
    return response.data.response;
}

export const submitCode= async({languageId,value,problemId})=>{
    const token = localStorage.getItem('token');
    const response= await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/v1/problem/${problemId}/submitcode`,{languageId,code:value}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return response.data;
}

export const getUserProblemSubmissions = async({problemId,userId})=>{
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/v1/problem/${problemId}/submissions/${userId}`);
    return response.data;
}