# Bienvenue sur SCode

SCode est un éditeur de code open-source basé sur electron.

## Quoi de neuf dans la 0.3.1

La version 0.3.1 introduit git sur toutes les plateformes (Windows et Linux) grâce à simple-git (disponible via npm). Pour utiliser git, vous devez insteller git sur votre système. 

## Comment configurer votre interface

L'interface de SCode n'est pas 100% configurable. Vous pouvez décider ou non d'afficher le répertoire de travail de manière statique en modifiant le fichier se situant dans {dossier utilisateur}/.scode/settings.json 

en ajoutant la ligne <code>"always_show_workdir_and_opened_files":true</code>

Pour customiser l'interface, vous pouvez modifier le fichier ./resources/app/src/style.css

## Raccourcis 

Voici la liste des différents raccourcis clavier de SCode. 

* ``` Control+L ``` Affiche la fenêtre des licenses
* ``` Control+G ``` Affiche l'interface git