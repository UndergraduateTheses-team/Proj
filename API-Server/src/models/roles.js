import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    nameRole: {
        type: String,
        required: true,
        maxLength: 255,
      },  
    },
    {
      timestamps: true, 
      versionKey: false
    }
  );
  
export default mongoose.model("Role",RoleSchema);





