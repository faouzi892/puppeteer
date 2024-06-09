# Utiliser une image de base Puppeteer
FROM ghcr.io/puppeteer/puppeteer:22.10.0

# Définir les variables d'environnement pour Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Changer les permissions pour éviter les erreurs de permission
RUN chown -R pptruser:pptruser /usr/src/app

# Passer à l'utilisateur pptruser
USER pptruser

# Installer les dépendances du projet, y compris puppeteer-extra et le plugin stealth
RUN npm install puppeteer-extra puppeteer-extra-plugin-stealth && npm ci

# Copier le reste des fichiers du projet dans le répertoire de travail
COPY . .

# Définir la commande par défaut pour démarrer l'application
CMD [ "node", "index.js" ]
