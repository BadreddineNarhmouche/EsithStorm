-# EsithStorm – Architecture globale

## 1. Vue d'ensemble

Application web de gestion pour l'écosystème textile : entreprises, fournisseurs, ateliers, techniciens et chercheurs en matières premières.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Navigateur)                               │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │              Angular SPA (TypeScript)                               │  │
│  │  • Login • Dashboard • CRUD Entités • Recherche & Filtres          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS / REST (JSON)
                                    │ Authorization: Bearer <JWT>
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    SERVEUR (Java JEE / Jakarta EE)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  REST       │  │  Service    │  │  DAO        │  │  Entity     │    │
│  │  (JAX-RS)   │──│  (Business) │──│  (Repository)│──│  (JPA)      │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│         │                  │                │                │           │
│         └──────────────────┴────────────────┴────────────────┘       │
│                                    │                                     │
│                         JWT Filter / Security                            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ JDBC
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Base de données (PostgreSQL / MySQL)                  │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2. Backend – Couches

| Couche        | Rôle                                      | Technologies      |
|---------------|-------------------------------------------|-------------------|
| **REST**      | Endpoints API, validation, sérialisation  | JAX-RS (RESTEasy) |
| **Service**   | Logique métier, transactions              | CDI, EJB ou CDI   |
| **DAO**       | Accès données, requêtes                   | JPA / Hibernate   |
| **Entity**    | Modèle persistant                         | JPA               |
| **Security**  | JWT, rôles                                | Filter + JWT lib  |

## 3. Frontend – Structure Angular

```
src/
├── app/
│   ├── core/           # Auth, interceptors, guards
│   ├── shared/         # Pipes, directives, modèles
│   ├── features/
│   │   ├── auth/       # Login
│   │   ├── dashboard/  # Tableau de bord
│   │   ├── entreprises/
│   │   ├── fournisseurs/
│   │   ├── ateliers/
│   │   ├── techniciens/
│   │   └── chercheurs/
│   └── app-routing.module.ts
├── assets/
└── environments/
```

## 4. Sécurité

- **Login** : POST `/api/auth/login` → renvoie un JWT.
- **Rôles** : `ADMIN`, `USER` (stockés dans le JWT et en base).
- **Guards Angular** : routes protégées ; redirection vers `/login` si non authentifié.
- **Backend** : filtre sur chaque requête (sauf `/api/auth/login`) pour vérifier le JWT et les rôles.

## 5. API REST (préfixe `/api`)

| Méthode | Ressource              | Description        |
|---------|------------------------|--------------------|
| POST    | /auth/login            | Connexion, retour JWT |
| GET     | /entreprises           | Liste + filtres    |
| GET     | /entreprises/{id}      | Détail             |
| POST    | /entreprises           | Création           |
| PUT     | /entreprises/{id}      | Mise à jour        |
| DELETE  | /entreprises/{id}      | Suppression        |
| *       | /fournisseurs, /ateliers, /techniciens, /chercheurs | Même pattern CRUD |

Endpoints communs : `/api/stats/dashboard` pour les statistiques du tableau de bord.
