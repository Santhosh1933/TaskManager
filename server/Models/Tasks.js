const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  subTasks: [String],
  status: Number,
  archive: { type: Boolean, default: false },
  dateOfCreation: {
    type: Date,
    default: Date.now,
  },
  deadLine: Date,
  assignees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  priority: String,
});

module.exports = mongoose.model("Tasks", TaskSchema);
