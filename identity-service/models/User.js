import mongoose from "mongoose";
import argon2 from "argon2";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);

// A Mongoose pre hook (or pre-middleware) is a function executed automatically before specific model operations—such as
//  save(), validate(), update(), or remove()—are completed in MongoDB.
// These hooks enable developers to inject custom logic, such as data validation, password hashing, or document modification, before data is persisted

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await argon2.hash(this.password);
    } catch (error) {
      console.log(error, "Error");
      next(error);
    }
  }
});

// Created helper function to compare passwords
UserSchema.methods.comparePasswords = async function (newPassword) {
  try {
    return await argon2.verify(this.password, newPassword);
  } catch (error) {
    console.log(error);
  }
};

// Created indexing of username for searching purposes

UserSchema.index({ username: "text" });

export default User;
