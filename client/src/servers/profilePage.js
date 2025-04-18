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