const User = require('../backend/models/user'); 

const showUser = async (req, res) => {
  const { id } = req.params; 
  const loggedInUserId = req.userId; 

  if (loggedInUserId !== id && !req.isAdmin) {
    return res.status(403).json({ message: 'Você não tem permissão para acessar este usuário.' });
  }

  try {
    const userQuery = User.findById(id);
    
    if (req.isAdmin || loggedInUserId === id) {
      const user = await userQuery.select('+password +email'); 

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password, 
      };

      return res.status(200).json(userData);
    } else {
      const user = await userQuery.select("-password", "+email"); 

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const userData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
      };

      return res.status(200).json(userData);
    }

  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).json({ message: 'Erro ao buscar dados do usuário.' });
  }
};

module.exports = { showUser };
