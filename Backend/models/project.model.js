import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
    },
  description: { 
    type: String, 
    required: true 
  },
  skillsRequired: [{ 
    type: String 
  }],
  budget: { 
    type: Number, 
    required: true 
  },
  deadline: { 
    type: Date 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["open", "in-progress", "completed"], 
    default: "open" 
  },
  assignedTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      default: null 
  },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
