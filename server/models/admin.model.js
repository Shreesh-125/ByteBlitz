import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  blogs:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
  }]
});

export const Admin = mongoose.model("Admin", adminSchema);
