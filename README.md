# EsithStorm – Gestion textile

Application web de gestion pour l’écosystème textile : **entreprises**, **fournisseurs**, **ateliers**, **techniciens** et **chercheurs** en matières premières.

---

## Démarrage rapide (sans installer PostgreSQL)

Pour tester l’application **sans base de données externe** :

1. **Démarrer le backend** (base H2 en mémoire, port 8080) :
   ```powershell
   cd C:\Users\badre\Desktop\EsithStorm\backend
   mvnw.cmd clean package tomee:run
   ```
   *Si vous avez Maven installé, vous pouvez utiliser `mvn` à la place de `mvnw.cmd`.*  
   Au premier lancement, le script peut télécharger Maven puis TomEE (quelques minutes). Attendre le message du type « Server startup in … ms ».

2. **Démarrer le frontend** (dans un autre terminal) :
   ```powershell
   cd C:\Users\badre\Desktop\EsithStorm
   npm run start
   ```

3. Ouvrir **http://localhost:4200**, se connecter avec **admin** / **admin123**.

L’API est alors disponible sur **http://localhost:8080/esithstorm-api/api**. Les comptes admin et user sont créés automatiquement au premier appel.

---

## Prérequis

- **Java 17+** (JDK)
- **Maven 3.8+**
- **Node.js 18+** et **npm** (pour le frontend Angular)
- **PostgreSQL** ou **MySQL** (base de données)
- **Serveur d’applications Jakarta EE** : Payara 6+, WildFly 27+, ou TomEE 10+ (pour le backend)

---

## 1. Base de données

### PostgreSQL

1. Créer une base (ex. `esithstorm`) et un utilisateur.
2. Exécuter le script :

```bash
psql -U postgres -d esithstorm -f database/schema.sql
```

### MySQL

```bash
mysql -u root -p esithstorm < database/schema-mysql.sql
```

(Adapter le nom de la base et l’utilisateur.)

Les **utilisateurs** (admin/user) sont créés automatiquement au **premier démarrage** de l’API si la table `user` est vide. Comptes par défaut :

- **admin** / **admin123** (rôle ADMIN)
- **user** / **user123** (rôle USER)

---

## 2. Backend (Java JEE)

### Configuration du serveur

Configurer une **source de données JNDI** nommée `java:app/EsithStormDS` pointant vers votre base (PostgreSQL ou MySQL).

**Exemple Payara** (`domain.xml` ou interface d’admin) :

- JNDI : `java:app/EsithStormDS`
- Driver : `org.postgresql.driver` (ou `com.mysql.cj.jdbc.Driver`)
- URL : `jdbc:postgresql://localhost:5432/esithstorm` (ou équivalent MySQL)
- User / Password : ceux de la base

**Exemple WildFly** : créer un datasource dans le sous-système `datasources` avec le nom JNDI `java:app/EsithStormDS`.

### Compilation et déploiement

```powershell
cd backend
mvnw.cmd clean package
```
*(Ou `mvn clean package` si Maven est installé.)*

Le WAR généré : `backend/target/esithstorm-api.war`.

Déployer ce WAR sur le serveur (copie dans `deployments/` Payara ou WildFly, ou via la console d’administration).

L’API est exposée sous :  
`http://localhost:8080/esithstorm-api/api`  
(adapter le port et le contexte si besoin).

### Vérification

- **Login** :  
  `POST http://localhost:8080/esithstorm-api/api/auth/login`  
  Body JSON : `{"username":"admin","password":"admin123"}`  
  Réponse attendue : `token`, `username`, `role`.
- **Stats** (avec le token dans l’en-tête `Authorization: Bearer <token>`) :  
  `GET http://localhost:8080/esithstorm-api/api/stats/dashboard`

---

## 3. Frontend (Angular)

### Installation et lancement

```bash
cd frontend
npm install
npm start
```

L’application est servie sur **http://localhost:4200**.

### Configuration de l’API

En développement, l’URL de l’API est définie dans `frontend/src/environments/environment.ts` :

```ts
apiUrl: 'http://localhost:8080/esithstorm-api/api'
```

Adapter **host** et **port** si le backend tourne ailleurs.

### Build de production

```bash
npm run build
```

Les fichiers sont dans `frontend/dist/frontend/`. Les déployer sur un serveur web (Nginx, Apache) ou les servir depuis le même domaine que l’API (en configurant `apiUrl` en conséquence dans `environment.prod.ts`).

---

## 4. Utilisation

1. Ouvrir **http://localhost:4200**.
2. Se connecter avec **admin** / **admin123** (ou **user** / **user123**).
3. Accéder au **tableau de bord** (statistiques et répartition par type d’acteur).
4. Utiliser les menus : **Entreprises**, **Fournisseurs**, **Ateliers**, **Techniciens**, **Chercheurs** pour consulter, créer, modifier et supprimer les enregistrements, avec recherche et filtres.

---

## 5. Structure du projet

```
EsithStorm/
├── backend/                 # API Java JEE (JAX-RS, JPA, JWT)
│   ├── src/main/java/.../   # entity, dao, service, rest, security
│   ├── src/main/resources/ # persistence.xml, beans.xml
│   └── pom.xml
├── frontend/               # Application Angular
│   ├── src/app/
│   │   ├── core/            # auth, guards, interceptors, services API
│   │   ├── features/        # login, dashboard, CRUD par entité
│   │   ├── layout/          # sidebar + contenu
│   │   └── shared/          # modèles
│   └── package.json
├── database/               # Scripts SQL (PostgreSQL, MySQL)
│   ├── schema.sql
│   └── schema-mysql.sql
├── docs/                   # Architecture, modèle de données, diagramme de classes
│   ├── ARCHITECTURE.md
│   ├── MODELE_DONNEES.md
│   └── DIAGRAMME_CLASSES.md
└── README.md
```

---

## 6. Dépannage

- **401 sur les requêtes API** : vérifier que le token JWT est bien envoyé (header `Authorization: Bearer <token>`). Se reconnecter si le token a expiré (24 h par défaut).
- **Erreur CORS** : configurer CORS sur le serveur JEE pour autoriser l’origine du frontend (ex. `http://localhost:4200` en dev).
- **Base vide** : exécuter les scripts SQL et redémarrer le backend pour créer les utilisateurs initiaux et les données de test (entreprises, fournisseurs, ateliers, techniciens, chercheurs).

---

## Livrables

- **Architecture** : `docs/ARCHITECTURE.md`
- **Modèle de données** : `docs/MODELE_DONNEES.md`
- **Diagramme de classes** : `docs/DIAGRAMME_CLASSES.md`
- **Scripts BDD** : `database/schema.sql`, `database/schema-mysql.sql`
- **Code backend** : `backend/`
- **Code frontend** : `frontend/`
- **Guide d’installation** : ce README
