import authService from "../service/auth.service.js";

class AuthController {
  async registerUser(req, res) {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(422).json({ error: "All fields required" });
    }

    try {
      const response = await authService.registerUser({ email, password, name });
      res.cookie("access_token", response.token, { httpOnly: true });
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Email and password required" });
    }

    try {
      const response = await authService.loginUser(email, password);
      res.cookie("access_token", response.token, { httpOnly: true });
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async resetPassword(req, res) {
    const { newPassword } = req.body;
    const userId = req.user.uid;

    if (!newPassword) {
      return res.status(422).json({ error: "New password required" });
    }

    try {
      const response = await authService.resetPassword(userId,newPassword);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async logoutUser(req, res) {
    try {
      await authService.logoutUser();
      res.clearCookie("access_token");
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new AuthController();
