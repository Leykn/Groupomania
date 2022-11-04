# Réseau social d'entreprise Groupomania #

Le projet consiste à construire un **réseau social interne** pour les employés de Groupomania.  
Le but de cet outil est de faciliter les interactions entre collègues.

## *Spécifications fonctionnelles* ##

#### **Page de connexion** ####

Une page de connexion permet à l’utilisateur de se connecter, ou bien de créer un compte s’il n’en possède pas.  
La connexion se fait à partir de deux éléments :  
- mail de l’employé.
- mot de passe.

#### **Détails de la fonctionnalité de connexion** ####

- L'utilisateur a la possibilité de se déconnecter.
- La session de l’utilisateur persiste pendant qu’il est connecté.
- Les données de connexion sont sécurisées.

#### **Page d’accueil** ####

La page d’accueil liste les posts créés par les différents utilisateurs.
Ils sont listés de façon antéchronologique (du plus récent au plus ancien).

#### **Création d’un post** ####

- L'utilisateur peut créer un post.
- Un post peut contenir du texte et une image.
- L'utilisateur peut modifier et supprimer ses posts.

#### **Système de like** ####

Un utilisateur peut liker un post, une seule fois pour chaque post.

#### **Rôle administrateur** ####

Dans le but de pouvoir faire de la modération si nécessaire, un utilisateur “administrateur” fut créer.  
Celui-ci a les droits de modification / suppression sur tous les posts du réseau social.
  
## *Technologie* ##

L'utilisation d'un **Framework Frontend** étant obligatoire, le projet est réalisé avec *Vue 3*.  
Le client utilise une base de donnée **non relationnelle** *mongoDB*.

## *Installation* ##  
  
Pour lancer le projet, vous devez avoir Node.js installé sur votre machine.

#### **Étape 1 - Clonage du projet** ####

Avec le terminal, depuis le dossier dans lequel vous souhaitez enregistrer le projet, clonez le projet avec la commande :

```
git clone https://github.com/Leykn/Groupomania.git groupomania
```

Le dossier ainsi créé sur votre machine doit contenir les éléments suivants :

- Un dossier **back** contenant le code de l'API.
- Un dossier **src** contenant le code de l'application frontend.
- Le fichier image **default_avatar.png**.
- Les fichiers **README.md** et **index.html**.

#### **Étape 2 - Installation de l'API** ####

Depuis le dossier **back**, à l'aide de votre terminal, installez les dépendances avec la commande :

```  
npm install  
```

Vous pouvez ensuite vérifier que les différents packages sont **à jour** avec la commande :

```
npm outdated
```

Enfin, vous pouvez vérifier les éventuelles **vulnérabilités** avec la commande :

```
npm audit
```

#### **Étape 3 - Configuration des variables d'environnement et du fichier .gitignore** ####

À la racine du dossier **back**, ajoutez un fichier **.env** avec les éléments suivants :

```
ACCESS_TOKEN_SECRET = "chaîne de caractères aléatoire"
REFRESH_TOKEN_SECRET = "chaîne de caractères aléatoire"
dbUserName = "Identifiant de connexion mongoDB"
dbPassword = "Mot de passe de connexion mongoDB"
EMAIL_CRYPT_KEY = "chaîne de caractères aléatoire"
```

À la racine du dossier **back**, ajoutez un fichier **.gitignore** avec les éléments suivants :

```
/.env
/node_modules
/images
```

#### **Étape 4 - Ajout du dossier images** ####

À la racine du dossier **back**, ajoutez le dossier images.
Placez-y le fichier **default_avatar.png**. 

#### **Étape 5 - Lancement de l'API** ####

Avec le terminal, depuis le dossier back, éxécutez la commande :

```
nodemon server || node server
```

Si tout se passe bien, les messages suivants apparaissent dans le terminal :

```
Listening on port 3000
Connexion à MongoDB réussie !
```

Vous êtes désormais prêt à utiliser l'application.

#### **Étape 6 - Installation de l'application Frontend** ####

Depuis la racine du projet, à l'aide de votre terminal, installez les dépendances avec la commande :

```
npm install
```

Vous pouvez ensuite vérifier que les différents packages sont **à jour** avec la commande :

```
npm outdated
```

Vous pouvez également vérifier les éventuelles **vulnérabilités** avec la commande :

```
npm audit
```

Enfin, lancez l'application avec la commande :

```
npm run dev
```

Ultérieurement, la minification et la compilation pour la mise en production se fera à l'aide de la commande :

```
npm run build
```