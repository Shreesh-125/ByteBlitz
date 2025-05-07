import axios from 'axios'

export const deleteProfilePhoto= async(username)=>{
    const response=await axios.delete(`/api/v1/user/delete/profile-pic/${username}`);
    return response;
}


export const UploadProfilePhoto = async (username, formData) => {
  try {
    const response = await axios.post(
        `/api/v1/user/upload/profile-pic/${username}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );
    
    return response.data.data.profilePhoto;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload profile photo');
  }
};

export const togglefriend = async (userid,friendUsername)=>{
  try {
    const response = await axios.post(`/api/v1/user/${userid}/friended/${friendUsername}`)
    return response;

  } catch (error) {
    console.log("Error While toggling Friend");
    console.log(error);
    
  }
}

export const checkfriend = async (userid,friendUsername)=>{
  try {
    return await axios.get(`/api/v1/user/${userid}/isFriend/${friendUsername}`)
    
    
  } catch (error) {
    console.log("Error While toggling Friend");
    console.log(error);
    
  }
}