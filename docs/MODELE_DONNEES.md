# Modèle de données – EsithStorm

## Entités et relations

- **User** : utilisateurs du système (login, mot de passe hashé, rôle ADMIN/USER).
- **Entreprise** : nom, pays, spécialité textile, contacts (email, téléphone).
- **Fournisseur** : matières premières, délais (jours), localisation (ville, pays).
- **Atelier** : type de production, capacité (ex. unités/jour), équipements (texte ou liste).
- **Technicien** : compétences, années d’expérience, disponibilité (libre/occupé).
- **Chercheur** : domaines de recherche, matériaux étudiés, publications (texte ou liste).

Relations prévues (optionnel en v1) :
- Entreprise ↔ Fournisseur (N–N) : partenariats.
- Atelier ↔ Technicien (N–N) : affectation.
- Chercheur indépendant ; lien possible avec Entreprise plus tard.

## Schéma relationnel (tables)

```
user (id, username, password_hash, role, created_at)
entreprise (id, nom, pays, specialite_textile, email, telephone, created_at)
fournisseur (id, nom, matieres_premieres, delai_jours, ville, pays, email, created_at)
atelier (id, nom, type_production, capacite, equipements, ville, pays, created_at)
technicien (id, nom, prenom, competences, experience_annees, disponibilite, email, created_at)
chercheur (id, nom, prenom, domaines_recherche, materiaux_etudies, publications, email, created_at)
```

Toutes les tables ont un `id` (PK, auto-incrémenté) et un `created_at` (timestamp).

Le script SQL détaillé est dans `database/schema.sql`.
