const User = require('../models/userModel');
const {estNonVide, estEmailValide} = require('../utils/validators');

// 1. Obtenir un utilisateur par son ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: `Utilisateur ${req.params.id} non trouve`
            });
        }

        res.status(200).json(user);
    } 
    catch (err) {
    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Identifiant de ressource invalide (format ObjectId attendu)"
        });
    }

    return res.status(500).json({
        message: err.message
    });
}
};

// 2. Obtenir tous les utilisateurs avec filtre par rôle
const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filtre = role ? { role } : {};

        const users = await User.find(filtre);

        res.status(200).json({
            total: users.length,
            users
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// 3. Créer un nouvel utilisateur
const createUser = async (req, res) => {
  try {
    const { name, email, age, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Le nom et l'email sont requis" });
    }

    // Vérification de doublon d'email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }

    const user = await User.create({ name, email, age, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Supprimer un utilisateur

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "Utilisateur non trouvé"
            });
        }

        // Vérifier si cet utilisateur possède des articles
        const article = await Article.findOne({ author: id });

        if (article) {
            return res.status(400).json({
                message: "Impossible de supprimer un utilisateur ayant des articles publies"
            });
        }

        // Supprimer l'utilisateur s'il n'a aucun article
        await User.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Utilisateur supprimé avec succès"
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Identifiant de ressource invalide (format ObjectId attendu)"
            });
        }

        return res.status(500).json({
            message: err.message
        });
    }
};


// Exporter les fonctions avec les anciens noms
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
};