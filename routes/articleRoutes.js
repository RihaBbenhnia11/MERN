const express = require('express');
const router = express.Router();

// Importation des méthodes du contrôleur
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles
} = require('../controllers/articleController');

// Importation du middleware d'authentification JWT
const { protect } = require('../middlewares/authMiddleware');

// Routes publiques (Consultation sans authentification)

// GET /api/articles (Récupérer tous les articles)
router.get('/', getAllArticles);

router.get('/my-articles', protect, getMyArticles);

// GET /api/articles/:id (Récupérer un article par son ID)
router.get('/:id', getArticleById);

// Routes protégées (Nécessitent un token JWT valide)
// POST /api/articles (Créer un nouvel article)
router.post('/', protect, createArticle);

// PUT /api/articles/:id (Modifier un article existant)
router.put('/:id', protect, updateArticle);

// DELETE /api/articles/:id (Supprimer un article)
router.delete('/:id', protect, deleteArticle);


module.exports = router;