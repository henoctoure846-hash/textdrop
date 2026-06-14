# 📝 TextDrop

**Partagez vos textes instantanément. Lisible par les humains ET les IA.**

Collez n'importe quel texte (court ou long), obtenez un lien unique, et partagez-le. Le lien est accessible par tous — humains et intelligences artificielles (ChatGPT, Claude, Gemini, etc.).

![TextDrop](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green?style=flat-square)

## ✨ Fonctionnalités

- 🔗 **Lien unique** — Chaque texte obtient une URL courte et permanente
- 🤖 **Lisible par les IA** — Endpoint texte brut accessible par toute IA
- ⚡ **Instantané** — Collez, cliquez, partagez. Pas d'inscription
- 📱 **Responsive** — Interface moderne qui fonctionne partout
- 🌐 **3 formats** — HTML (humains), texte brut (IA), JSON (API)

## 🚀 Déploiement sur Render

### Option 1 : Déploiement en 1 clic

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Option 2 : Déploiement manuel

1. **Fork ce repo** sur GitHub

2. **Connectez-vous à [Render](https://render.com)**

3. **Créez une base PostgreSQL** :
   - Dashboard → New → PostgreSQL
   - Name: `textdrop-db`
   - Plan: Free
   - Copiez l'**Internal Database URL**

4. **Créez le Web Service** :
   - Dashboard → New → Web Service
   - Connectez votre repo GitHub
   - Settings :
     - Build Command: `npm install && npm run build`
     - Start Command: `npm run start`
   - Environment Variables :
     - `DATABASE_URL` = (collez l'Internal Database URL)
     - `NODE_ENV` = `production`

5. **Initialisez la base de données** :
   ```bash
   # Dans le shell Render ou en local avec DATABASE_URL
   npx drizzle-kit push
   ```

## 🛠️ Développement local

```bash
# Cloner le repo
git clone https://github.com/VOTRE_USER/textdrop.git
cd textdrop

# Installer les dépendances
npm install

# Configurer la base de données
cp .env.example .env
# Éditez .env avec votre DATABASE_URL PostgreSQL

# Appliquer le schéma
npx drizzle-kit push

# Lancer le serveur de dev
npm run dev
```

## 📡 API

### Créer un paste
```bash
POST /api/pastes
Content-Type: application/json

{
  "title": "Mon titre (optionnel)",
  "content": "Mon texte à partager..."
}
```

### Lire un paste (JSON)
```bash
GET /api/pastes/{slug}
```

### Lire un paste (texte brut - pour IA)
```bash
GET /api/pastes/{slug}/raw
```

## 🤖 Utilisation avec les IA

Pour donner un texte à une IA :

1. Collez votre texte sur TextDrop
2. Copiez le **lien brut** (`/api/pastes/{slug}/raw`)
3. Donnez ce lien à ChatGPT, Claude, Gemini, etc.
4. L'IA peut lire et reproduire l'intégralité du contenu !

## 📄 License

MIT
