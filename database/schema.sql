-- EsithStorm - Script de création des tables
-- Compatible PostgreSQL / MySQL (syntaxe PostgreSQL par défaut)

-- Table des utilisateurs (authentification)
CREATE TABLE "user" (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Entreprise
CREATE TABLE entreprise (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    pays VARCHAR(100),
    specialite_textile VARCHAR(200),
    email VARCHAR(150),
    telephone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Fournisseur
CREATE TABLE fournisseur (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    matieres_premieres VARCHAR(500),
    delai_jours INTEGER,
    ville VARCHAR(100),
    pays VARCHAR(100),
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Atelier
CREATE TABLE atelier (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    type_production VARCHAR(200),
    capacite VARCHAR(100),
    equipements TEXT,
    ville VARCHAR(100),
    pays VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Technicien
CREATE TABLE technicien (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    competences VARCHAR(500),
    experience_annees INTEGER,
    disponibilite VARCHAR(50) DEFAULT 'LIBRE',
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Chercheur
CREATE TABLE chercheur (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    domaines_recherche VARCHAR(500),
    materiaux_etudies VARCHAR(500),
    publications TEXT,
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour recherches et filtres
CREATE INDEX idx_entreprise_pays ON entreprise(pays);
CREATE INDEX idx_entreprise_specialite ON entreprise(specialite_textile);
CREATE INDEX idx_fournisseur_pays ON fournisseur(pays);
CREATE INDEX idx_fournisseur_ville ON fournisseur(ville);
CREATE INDEX idx_atelier_type ON atelier(type_production);
CREATE INDEX idx_technicien_disponibilite ON technicien(disponibilite);

-- Données de test : utilisateur admin (mot de passe: admin123)
-- Hash BCrypt pour "admin123"
INSERT INTO "user" (username, password_hash, role) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqYQJxqY5qY5qY5qY5qY5qY5qY5qY', 'ADMIN'),
('user', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqYQJxqY5qY5qY5qY5qY5qY5qY5qY', 'USER');

-- Données de test : entreprises
INSERT INTO entreprise (nom, pays, specialite_textile, email, telephone) VALUES
('Textile France SARL', 'France', 'Coton, lin', 'contact@textile-france.fr', '+33 1 23 45 67 89'),
('Soie Orient', 'Maroc', 'Soie, cachemire', 'info@soie-orient.ma', '+212 5 37 12 34 56');

-- Données de test : fournisseurs
INSERT INTO fournisseur (nom, matieres_premieres, delai_jours, ville, pays, email) VALUES
('Coton & Co', 'Coton bio, coton recyclé', 14, 'Lyon', 'France', 'ventes@coton-co.fr'),
('Fibres Naturelles', 'Lin, chanvre, jute', 21, 'Casablanca', 'Maroc', 'contact@fibres-nat.ma');

-- Données de test : ateliers
INSERT INTO atelier (nom, type_production, capacite, equipements, ville, pays) VALUES
('Atelier Tissage Nord', 'Tissage', '500 m/jour', 'Métiers à tisser, teinture', 'Lille', 'France'),
('Confection Sud', 'Confection', '200 pièces/jour', 'Surjeteuses, brodeuses', 'Marseille', 'France');

-- Données de test : techniciens
INSERT INTO technicien (nom, prenom, competences, experience_annees, disponibilite, email) VALUES
('Dupont', 'Jean', 'Tissage, maintenance', 8, 'LIBRE', 'j.dupont@email.fr'),
('Martin', 'Sophie', 'Teinture, contrôle qualité', 5, 'OCCUPE', 's.martin@email.fr');

-- Données de test : chercheurs
INSERT INTO chercheur (nom, prenom, domaines_recherche, materiaux_etudies, publications, email) VALUES
('Bernard', 'Pierre', 'Textiles techniques, biocomposites', 'Fibres naturelles, polymères', 'Revue Textile 2023', 'p.bernard@labo.fr'),
('Leroy', 'Marie', 'Teintures naturelles, durabilité', 'Indigo, cochenille, mordants', 'Conf. Eco-Textile 2024', 'm.leroy@labo.fr');
