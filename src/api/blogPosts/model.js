import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number },
    },
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
    content: { type: String, required: true },
    comments: [
      {
        comment: String,
        createdAt: Date,
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true, // this option automatically the createdAt and updatedAt fields
  }
);

export default model("BlogPost", blogPostsSchema); // this model is now automagically linked to the "blogPosts" collection, if collection is not there it will be created
