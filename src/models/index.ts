import { Schema, model, Document } from "mongoose";

export interface ImodelUrl extends Document {
  url: string;
  shortUrl: string;
  createDate: Date;
  lastAccess: Date;
  timesAccess: number;
}

const urlSchema = new Schema({
  url: {
    type: String,
    unique: true,
    required: true,
  },
  shortUrl: {
    type: String,
    unique: true,
    required: true,
  },
  createDate: {
    type: Date,
    required: true,
  },
  lastAccess: {
    type: Date,
    required: true,
  },
  timesAccess: {
    type: Number,
    required: true,
  },
});

export default model<ImodelUrl>("ShortUrl", urlSchema);
