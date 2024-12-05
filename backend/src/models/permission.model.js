import mongoose, { Schema } from "mongoose";

const permissionSchema = new Schema(
  {
    task: {
      type: String,
    },
    profile: {
      type: String,
    }
  },
  {
    timestamps: true,
    strict: true,
  }
);


export const Permission = mongoose.model("Permission", permissionSchema);