const { estNonVide, estEmailValide } = require("../utils/validators");

// Données des utilisateurs
let users = [
    { id: 1,name: "Aya",email: "aya@gmail.com", role: "admin"},
    {id: 2,name: "Rihab",email: "rihab@gmail.com",role: "user"}
];

let prochainId = 3;


// 1. Récupérer tous les utilisateurs
// avec filtre optionnel ?role=
const getAllUsers = (req, res) => {

    const { role } = req.query;

    let resultat = users;

    if (role) {
        resultat = users.filter(u => u.role === role);
    }

    res.status(200).json({
        total: resultat.length,
        users: resultat
    });
};


// 2. Récupérer un utilisateur par son ID
const getUserById = (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            error: `Utilisateur ${id} introuvable`
        });
    }

    res.status(200).json(user);
};

// 3. Créer un nouvel utilisateur

const createUser = (req, res) => {
    const { name, email, role } = req.body;

    // Vérifier le nom
    if (!estNonVide(name)) {
        return res.status(400).json({
            error: "Le nom est obligatoire et ne doit pas être vide."
        });
    }

    // Vérifier l'email
    if (!estEmailValide(email)) {
        return res.status(400).json({
            error: "L'adresse email est obligatoire ou invalide."
        });
    }

    // Créer l'utilisateur si les données sont valides
    const nouvelUser = {
        id: prochainId++,
        name: name.trim(),
        email: email.trim(),
        role: estNonVide(role) ? role.trim() : "user"
    };

    users.push(nouvelUser);

    return res.status(201).json({
        message: "Utilisateur créé avec succès",
        user: nouvelUser
    });
};



// 4. Supprimer un utilisateur
const deleteUser = (req, res) => {

    const id = Number(req.params.id);

    const userExiste = users.some(u => u.id === id);

    if (!userExiste) {
        return res.status(404).json({
            error: `Utilisateur ${id} introuvable`
        });
    }

    users = users.filter(u => u.id !== id);

    res.status(200).json({
        message: `Utilisateur ${id} supprimé avec succès`
    });
};


// Exporter les fonctions
module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
};


