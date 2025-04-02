import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProfile, deleteUser } from "../../servers/oauthApi";
import { loginSuccess } from "../../store/authStore";
import Loader from "../../ui/Loader";

const UpdateProfile = () => {
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!email) {
        throw new Error("Email required. Please sign up again using OAuth.");
      }
      const response = await updateProfile({
        email,
        username,
        country,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const user = data.user;
      const token = data.token;
      dispatch(loginSuccess({ user, token }));
      toast.success("Your profile has been updated successfully!");
      navigate("/home");
    },
    onError: async (error) => {
      console.error("Profile update failed:", error);
      toast.error("Profile update failed. Please try again.");
      await deleteUser(email); // Delete user if update fails
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    mutation.mutate();
  };
  if (mutation.isLoading) {
    return <Loader />;
  }
  return (
    <div className="update-profile-container">
      <h2>Complete Your Profile</h2>
      {mutation.isError && (
        <p className="error">Failed to update profile. Please try again.</p>
      )}
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? <Loader /> : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
