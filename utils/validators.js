
const estNonVide = (chaine) => {
    return typeof chaine === "string" && chaine.trim().length > 0;
};

const estEmailValide = (email) => {
    return (
        typeof email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
};

module.exports = {
    estNonVide,
    estEmailValide
};
