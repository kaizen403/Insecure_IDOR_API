const prisma = require("../prismaClient");
const { generateToken, hashPassword, checkPassword } = require("../auth");

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = hashPassword(password);
    const newUser = await prisma.user.create({
      data: { username, password: hashedPassword },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !checkPassword(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const anonymousLogin = (req, res) => {
  const anonymousUser = { id: "anonymous", isAdmin: false };
  const token = generateToken(anonymousUser);
  res.json({ token });
};

module.exports = {
  registerUser,
  loginUser,
  anonymousLogin,
};
