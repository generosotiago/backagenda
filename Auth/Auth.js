const User = require("../user");
const bcrypt = require("bcrypt");

exports.register = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nome e senha obrigatorios." });
  }

  if (password.length < 4) {
    return res
      .status(400)
      .json({ message: "Senha deve ter pelo menos 4 caracteres" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Usuário já existe" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: { id: newUser._id, username: newUser.username },
    });
  } catch (err) {
    console.error("Erro ao criar usuário:", err);
    res.status(500).json({
      message: "Erro ao criar usuário.",
      error: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({
        message: "Nome de usuário ou senha não fornecidos.",
      });
    }
  
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({
          message: "Erro ao realizar login",
          error: "Usuário não encontrado",
        });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Erro ao realizar login",
          error: "Senha incorreta",
        });
      }
  
      res.status(200).json({
        message: "Login com sucesso",
        user: {
          id: user._id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
      });
    } catch (err) {
      console.error("Erro no login:", err);
      res.status(400).json({
        message: "Ocorreu um erro",
        error: err.message,
      });
    }
  };
  
exports.deleteUser = async (req, res, next) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    await user.remove();
    res.status(200).json({
      message: "Usuário deletado com sucesso",
      user: { id: user._id, username: user.username },
    });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({
      message: "Erro ao deletar usuário",
      error: error.message,
    });
  }
};
