import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    googleId: string,
    email?: string,
    displayName: string
}

const userSchema = new mongoose.Schema<IUser>({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    email: String,
    displayName: String
}, { timestamps: true });

const User = mongoose.model('users', userSchema);

export default User;