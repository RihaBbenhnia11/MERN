const express = require('express');
const router = express.Router();

// Importation des contrôleurs utilisateurs
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updatePassword,
  updateUserRole
} = require('../controllers/userController');

// Importation des middlewares de sécurité
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// ----------------------------------------------------
// Routes publiques (Authentification)
// ----------------------------------------------------

// POST /api/users/register (Inscription d'un nouvel utilisateur)
router.post('/register', registerUser);

// POST /api/users/login (Connexion et génération du token JWT)
router.post('/login', loginUser);

// ----------------------------------------------------
// Routes privées (Nécessitent un token JWT valide)
// ----------------------------------------------------

// GET /api/users/profile (Accéder à son propre profil utilisateur)
router.get('/profile', protect, getUserProfile);

// ----------------------------------------------------
// Routes administrateur (Token JWT valide + rôle Admin obligatoire)
// ----------------------------------------------------

// GET /api/users (Récupérer la liste complète des utilisateurs)
router.get('/', protect, adminOnly, getAllUsers);

router.put('/update-password', protect, updatePassword);

router.put('/:id/role', protect, adminOnly, updateUserRole);

module.exports = router;