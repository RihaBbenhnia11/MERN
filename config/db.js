const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error("L'URI MongoDB est manquant dans les variables d'environnement (.env)");
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true, // Génère automatiquement les index (ex: unique) en développement
    });
    console.log('Connexion à MongoDB Atlas réussie avec succès !');
  } catch (error) {
    console.error('Erreur lors de la connexion à MongoDB :', error.message);
    throw error;
  }
}

module.exports = connectDB;