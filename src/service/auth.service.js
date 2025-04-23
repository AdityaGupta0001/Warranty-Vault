import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "../config/firebase.js";
import { getDB } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userSchema } from "../schema/user.schema.js";

const auth = getAuth();

class AuthService {
  async registerUser(userData) {
    const db = getDB();
    const usersCollection = db.collection("users");
    const { email, password, name } = userData;

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const newUser = userSchema({
      uid: user.uid,
      email,
      name
    });
    await usersCollection.insertOne(newUser);

    const token = jwt.sign({ uid: user.uid, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return { message: "User registered successfully", token };
  }

  async loginUser(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const token = jwt.sign({ uid: user.uid, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return { message: "User logged in successfully", token };
  }

  async resetPassword(uid, newPassword) {
    const db = getDB();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ uid });
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }

    await sendPasswordResetEmail(auth, user.email);
    return { message: "Password reset email sent. Please check your inbox." };
  }

  async logoutUser() {
    await signOut(auth);
    return { message: "User logged out successfully" };
  }
}

export default new AuthService();
