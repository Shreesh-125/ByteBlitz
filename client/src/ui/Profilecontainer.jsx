import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import defaultprofileimage from "../assets/defaultprofileimage.png";
import styles from "../styles/Profilecontainer.module.css";
import trophy from "../assets/trophy.png";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postBlog } from "../servers/adminpage"; //need to replace this function for user to create their blogs
import {
  checkfriend,
  deleteProfilePhoto,
  togglefriend,
  UploadProfilePhoto,
} from "../servers/profilePage";
import { useSelector } from "react-redux";
import UserCreateBlogModal from '../ui/UserCreateBlogModal';
import toast from "react-hot-toast";

const Profilecontainer = ({ userData, isUser }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [tag, setTag] = useState("Master");
  const user = useSelector((state) => state.auth.user);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);

  useEffect(() => {
    if (userData?.user?.profilePhoto) {
      setCurrentPhoto(userData.user.profilePhoto);
    }
  }, [userData]);

  const blogMutation = useMutation({
    mutationFn: postBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      setShowBlogModal(false);
      toast.success("Blog created successfully!");
    },
    onError: (error) => {
      console.error("Error creating blog:", error);
      toast.error(error.response?.data?.message || "Failed to create blog");
    },
  });

  const userinfo = {
    username: userData?.user.username,
    country: "India",
    nfriends: userData?.user.friendsOf,
    maxRating:userData?.user.maxRating
  };

  const handleFileChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      setSelectedFile(imageFile);
      // Create and set temporary preview URL
      const previewUrl = URL.createObjectURL(imageFile);
      setCurrentPhoto(previewUrl);

      // Clean up the object URL when component unmounts or when new file is selected
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select an image first!");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("profilePic", selectedFile);
      const newPhotoUrl = await UploadProfilePhoto(user?.username, formData);

      // Update with the permanent URL from server
      setCurrentPhoto(newPhotoUrl);
      setSelectedFile(null);
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload photo");
      // Revert to previous photo if upload fails
      setCurrentPhoto(userData?.user?.profilePhoto || defaultprofileimage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("profile", selectedFile);
  };

  const removeButtonHandler = async (e) => {
    e.preventDefault();

    if (currentPhoto === defaultprofileimage) {
      toast.error("No photo to remove");
      return;
    }

    setIsRemoving(true);
    try {
      await deleteProfilePhoto(user?.username);
      // Reset to default image
      setCurrentPhoto(defaultprofileimage);
      setSelectedFile(null);
      toast.success("Profile photo removed successfully!");
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to remove photo");
    } finally {
      setIsRemoving(false);
    }
  };

  const queryClient = useQueryClient();

  const toggleFriendMutation = useMutation({
    mutationFn: ({ userid, friendUsername }) =>
      togglefriend(userid, friendUsername),
    onSuccess: () => {
      queryClient.invalidateQueries(["userData"]);
    },
    onError: (error) => {
      console.error("Error toggling friend:", error);
      toast.error("Failed to update friend status");
    },
  });

  // Check friendship status
  const { data: friendshipStatus, isLoading: isCheckingFriend } = useQuery({
    queryKey: ["friendship", user?._id, userData?.user?.username],
    queryFn: () => checkfriend(user?._id, userData?.user?.username),
    enabled: !!user?._id && !!userData?.user?.username,
    select: (response) => response?.data?.isFriend || false,
  });

  const handleToggleFriend = () => {
    if (!user?._id || !userData?.user?.username) return;

    toggleFriendMutation.mutate({
      userid: user?._id,
      friendUsername: userData.user.username,
    });
  };

  const handleBlogSubmit = (data) => {
    console.log(data);
    blogMutation.mutate(data);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.tag}>
          <img src={trophy} alt="trophy"></img>
          <p>{tag}</p>
          {!isUser && (
            <button
              onClick={handleToggleFriend}
              disabled={isCheckingFriend || toggleFriendMutation.isPending}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {isCheckingFriend || toggleFriendMutation.isPending ? (
                <span>...</span>
              ) : friendshipStatus ? (
                <FaHeart color="blue" size={24} />
              ) : (
                <FaRegHeart color="blue" size={24} />
              )}
            </button>
          )}
        </div>
        <div className={styles.userdetails}>
          <p className={styles.username}>
            Username:{" "}
            <span style={{ color: "#0023ff", fontWeight: "500" }}>
              {userinfo.username}
            </span>
          </p>
          {/* <p className={styles.country}>Max Rating: {userinfo?.maxRating}</p> */}
          <p className={styles.country}>Country: {userinfo.country}</p>
          <p className={styles.nfriends}>Friends of: {userinfo.nfriends}</p>
          {isUser ? (
            <Link to="/profile/friends" className={styles.links}>
              <p>My Friends</p>
            </Link>
          ) : (
            ""
          )}
          <Link to={`/profile/contests`} className={styles.links}>
            <p>Contests Participated</p>
          </Link>
          <Link to={`/user/blogs/${userinfo.username}`} className={styles.links}>
            <p>{isUser ? "Your" : ""} Blogs</p>
          </Link>
          {isUser ? (
            <div
              className={styles.links}
              onClick={() => setShowBlogModal(true)}
              disabled={blogMutation.isPending}
            >
              {blogMutation.isPending ? "Creating..." : "Create Blog"}
            </div>
          ) : (
            ""
          )}
          {isUser ? (
            <Link to="/updateProfileInfo" className={styles.links}>
              <p>Change Settings</p>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={styles.photodetails}>
        <div>
          <img
            src={currentPhoto || defaultprofileimage}
            className={styles.profileimage}
            alt="profile"
          />
        </div>
        <div>
          <form onSubmit={handleUploadPhoto}>
            {/* Hidden File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="fileInput"
              style={{ display: "none" }}
            />
            {/* Custom Button for Choosing File */}
            <div className={styles.photochangedetails}>
              <label htmlFor="fileInput" className={styles.choosephoto}>
                Choose Photo
              </label>

              <button
                onClick={handleUploadPhoto}
                type="submit"
                className={styles.uploadphoto}
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Photo"}
              </button>

              <button
                onClick={removeButtonHandler}
                className={styles.removephoto}
                disabled={currentPhoto === defaultprofileimage || isRemoving}
              >
                {isRemoving ? "Removing..." : "Remove Photo"}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <UserCreateBlogModal
        show={showBlogModal}
        onClose={() => setShowBlogModal(false)}
        onSubmit={handleBlogSubmit}
        isLoading={blogMutation.isPending}
      />
    </div>
  );
};
export default Profilecontainer;
//profilecontainer.jsx