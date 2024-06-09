# Utiliser une image Node.js avec un utilisateur non root
FROM ghcr.io/puppeteer/puppeteer:19.11.1

# Définir les variables d'environnement pour Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Créer un répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances du projet, y compris puppeteer-extra et le plugin stealth
RUN npm install puppeteer-extra puppeteer-extra-plugin-stealth

# Copier le reste des fichiers du projet dans le répertoire de travail
COPY . .

# Exécuter l'application
CMD [ "node", "index.js" ]
