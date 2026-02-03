# Diagramme de classes (UML) – Backend

## Entités JPA (modèle persistant)

```
┌─────────────────────┐
│       User          │
├─────────────────────┤
│ - id: Long          │
│ - username: String   │
│ - passwordHash: String │
│ - role: Role        │
│ - createdAt: LocalDateTime │
├─────────────────────┤
│ + getters/setters   │
└─────────────────────┘

┌─────────────────────┐
│    Entreprise       │
├─────────────────────┤
│ - id: Long          │
│ - nom: String       │
│ - pays: String      │
│ - specialiteTextile: String │
│ - email: String     │
│ - telephone: String │
│ - createdAt: LocalDateTime │
├─────────────────────┤
│ + getters/setters   │
└─────────────────────┘

┌─────────────────────┐
│   Fournisseur       │
├─────────────────────┤
│ - id: Long          │
│ - nom: String       │
│ - matieresPremieres: String │
│ - delaiJours: Integer │
│ - ville: String     │
│ - pays: String      │
│ - email: String     │
│ - createdAt: LocalDateTime │
├─────────────────────┤
│ + getters/setters   │
└─────────────────────┘

┌─────────────────────┐
│     Atelier         │
├─────────────────────┤
│ - id: Long          │
│ - nom: String       │
│ - typeProduction: String │
│ - capacite: String  │
│ - equipements: String │
│ - ville: String     │
│ - pays: String      │
│ - createdAt: LocalDateTime │
├─────────────────────┤
│ + getters/setters   │
└─────────────────────┘

┌─────────────────────┐
│   Technicien        │
├─────────────────────┤
│ - id: Long          │
│ - nom: String       │
│ - prenom: String    │
│ - competences: String │
│ - experienceAnnees: Integer │
│ - disponibilite: String │
│ - email: String     │
│ - createdAt: LocalDateTime │
├─────────────────────┤
│ + getters/setters   │
└─────────────────────┘

┌─────────────────────┐
│    Chercheur        │
├─────────────────────┤
│ - id: Long          │
│ - nom: String       │
│ - prenom: String    │
│ - domainesRecherche: String │
│ - materiauxEtudies: String │
│ - publications: String │
│ - email: String     │
│ - createdAt: LocalDateTime │
├─────────────────────┤
│ + getters/setters   │
└─────────────────────┘
```

## Couches applicatives

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  *Resource   │────▶│  *Service    │────▶│  *Dao        │────▶│  *Entity     │
│  (REST)      │     │  (Business)  │     │  (Repository)│     │  (JPA)       │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

Une ressource par entité (EntrepriseResource, FournisseurResource, etc.), un service, un DAO et une entité JPA associés.
