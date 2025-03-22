import axios from "axios";

export const submitCustomTestCase = async({ languagecode, value,customInput })=>{
    const response= await axios.post(`api/v1/problem/customTestCase`,{ languagecode, value,customInput });

    return response.data;
}