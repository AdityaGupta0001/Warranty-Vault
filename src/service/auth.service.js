import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "../config/firebase.js";
import { getDB } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userSchema } from "../schema/auth.schema.js";

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userSchema({
      uid: user.uid,
      email,
      password: hashedPassword,
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

  async resetPassword(email, newPassword) {
    const db = getDB();
    const usersCollection = db.collection("users");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await usersCollection.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 0) {
      throw new Error("User not found");
    }

    await sendPasswordResetEmail(auth, email);

    return { message: "Password updated successfully" };
  }

  async logoutUser() {
    await signOut(auth);
    return { message: "User logged out successfully" };
  }
}

export default new AuthService();
