const Article = require('../models/articleModel');

// 1. Récupérer tous les articles (avec filtre optionnel par auteur)
// GET /api/articles
// GET /api/articles?author=ID_AUTEUR
const getAllArticles = async (req, res) => {
  try {
    const filter = {};
    if (req.query.author) {
      filter.author = req.query.author;
    }

    const articles = await Article.find(filter).populate('author', 'name email role');
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Récupérer un article par son ID
// GET /api/articles/:id
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'name email role');

    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    res.status(200).json(article);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        message: "Identifiant invalide (format ObjectId attendu)"
      });
    }

    return res.status(500).json({
      message: err.message
    });
  }
};

// 3. Créer un nouvel article (Protégé : l'auteur est extrait du token JWT / req.user)
// POST /api/articles
const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Titre et contenu sont obligatoires" });
    }

    // L'auteur est automatiquement l'utilisateur connecté (req.user)
    const newArticle = await Article.create({
      title,
      content,
      author: req.user._id
    });

    const populatedArticle = await newArticle.populate('author', 'name email role');
    res.status(201).json(populatedArticle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Mettre à jour un article (Protégé : auteur ou admin uniquement)
// PUT /api/articles/:id
const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    // Vérification des droits de propriété : auteur ou admin
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: "Action interdite : vous n'êtes pas l'auteur de cet article"
      });
    }

    // Mise à jour des champs
    article.title = req.body.title || article.title;
    article.content = req.body.content || article.content;

    const updatedArticle = await article.save();
    const populated = await updatedArticle.populate('author', 'name email role');

    res.status(200).json(populated);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Identifiant invalide" });
    }
    res.status(500).json({ message: err.message });
  }
};

// 5. Supprimer un article (Protégé : auteur ou admin uniquement)
// DELETE /api/articles/:id
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article non trouvé" });
    }

    // Vérification des droits de propriété : auteur ou admin
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: "Action interdite : vous n'êtes pas l'auteur de cet article"
      });
    }

    await Article.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Article supprimé avec succès",
      id: req.params.id
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Identifiant invalide" });
    }
    res.status(500).json({ message: err.message });
  }
};
// GET /api/articles/my-articles
const getMyArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      author: req.user._id
    }).populate('author', 'name email');

    return res.status(200).json(articles);
  } catch (err) {
    return res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getMyArticles
};