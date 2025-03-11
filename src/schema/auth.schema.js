export const userSchema = (user) => ({
    uid: user.uid,
    email: user.email,
    password: user.password, //hashed password
    name: user.name,
    createdAt: new Date(),
  });