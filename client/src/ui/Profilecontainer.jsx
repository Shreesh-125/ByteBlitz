import React, { useState } from "react";
import { Link } from "react-router-dom";
import defaultprofileimage from "../assets/defaultprofileimage.png";
import styles from "../styles/Profilecontainer.module.css";
import trophy from "../assets/trophy.png";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Profilecontainer = ({ userData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(defaultprofileimage);
  const [tag, setTag] = useState("Master");

  const userinfo = {
    username: userData?.user.username,
    country: "India",
    nfriends: userData?.user.friendsOf,
  };

  const handleFileChange = (event) => {
    let imageFile = event.target.files[0];
    if (imageFile) {
      setSelectedFile(imageFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please Select Your Image!");
      return;
    }

    setPreview(URL.createObjectURL(selectedFile));

    const formData = new FormData();
    formData.append("profile", selectedFile);
  };

  const removeButtonHandler = () => {
    setSelectedFile(null);
    setPreview(defaultprofileimage);
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.tag}>
          <img src={trophy}></img>
          <p>{tag}</p>
          <FaRegHeart color="blue" size={24} />
        </div>
        <div className={styles.userdetails}>
          <p className={styles.username}>
            Username:{" "}
            <span style={{ color: "#0023ff", fontWeight: "500" }}>
              {userinfo.username}
            </span>
          </p>

          <p className={styles.country}>Country: {userinfo.country}</p>
          <p className={styles.nfriends}>Friends of: {userinfo.nfriends}</p>
          <Link to="/My_Friends" className={styles.links}>
            <p>My Friends</p>
          </Link>
          <Link to="/profile" className={styles.links}>
            <p>Contests Participated</p>
          </Link>
          <Link to="/profile" className={styles.links}>
            <p>Your Blogs</p>
          </Link>
          <Link to="/settings" className={styles.links}>
            <p>Change Settings</p>
          </Link>
        </div>
      </div>
      <div className={styles.photodetails}>
        <div>
          <img src={preview} className={styles.profileimage} />
        </div>
                    <p className = {styles.country}>Country: {userinfo.country}</p>
                    <p className = {styles.nfriends}>Friends of: {userinfo.nfriends}</p>
                    <Link to="/manu_codeup/friends" className = {styles.links}>
                        <p>My Friends</p>
                    </Link>
                    <Link to="/profile" className = {styles.links}>
                        <p>Contests Participated</p>
                    </Link>
                    <Link to="/profile" className = {styles.links}>
                        <p>Your Blogs</p>
                    </Link>
                    <Link to="/settings" className = {styles.links}>
                        <p>Change Settings</p>
                    </Link>
                </div>
            </div>
            <div className={styles.photodetails}>
                <div>
                    <img src={preview} className={styles.profileimage} />
                </div>

        <div>
          <form onSubmit={handleSubmit}>
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

              <button type="submit" className={styles.uploadphoto}>
                {" "}
                Upload Photo{" "}
              </button>

              <button
                onClick={removeButtonHandler}
                disabled={!selectedFile}
                className={styles.removephoto}
              >
                {" "}
                Remove Photo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profilecontainer;
