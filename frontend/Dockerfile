FROM node:22-alpine


WORKDIR /home/node/app

# Copier les fichiers de configuration du projet
COPY package.json .

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port utilisé par Vite
EXPOSE 5173

# Démarrer le serveur de développement Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]