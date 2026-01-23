# WikipediaGame

WikipediaGame est un jeu sur le naviguateur inspirée du jeu de la *course Wikipédia* mais avec un systeme de partie permettant le multijoueur de maniere plus simplifiée.

Le principe est simple : partir d’une page Wikipédia aléatoire et atteindre une autre page cible, elle aussi aléatoire, **en naviguant uniquement via les liens présents dans les pages**.  
Pas de recherche, pas d’URL tapée à la main. Juste du clic, du cerveau, et un peu de chance.

---

## Objectif du jeu

- Une page de départ Wikipédia est choisie aléatoirement
- Une page cible est également choisie aléatoirement
- Le joueur doit atteindre la page cible **uniquement en utilisant les liens (`<a href>`) présents dans les articles**
- Le but est d’y arriver en un minimum d’étapes

---

## Installation et lancement

Le projet peut etre lancer via docker ou avec nodeJS.

## Docker

Pour lancer le projet il suffit de faire la commande `docker compose up -d ` à la racine du projet

## Avec NodeJS

Pour lancer le projet avec NodejS il suffit de se placer dans le dossier `./game` et faire la commande `npm start`
