import { ObjectId } from "mongodb";

export type User = {
  _id: ObjectId;
  name: string;
  email: string;
  image: string;
  age?: string;
  location?: string;
  occupation?: string;
  hobbies?: string;
  goals?: string;
  values?: string;
  personality?: string;
  strengths?: string;
  weaknesses?: string;
  notes?: string;
}