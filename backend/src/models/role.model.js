import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema(
  {
    name: {
      type: String,
      enum: {
        values: ["user", "admin", "moderator"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
      index: true,
    },
    permissions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Permission",
      }
    ]
  },
  {
    timestamps: true,
    strict: true,
  }
);

export const Role = mongoose.model("Role", roleSchema);
