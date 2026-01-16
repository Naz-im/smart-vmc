# Manuel Utilisateur

## Installation et déploiement

Ce document décrit les procédures techniques pour flasher le microcontrôleur **ESP32** et déployer l'application mobile de monitoring.

### Flashage du Firmware sur ESP32

Le projet Le projet utilise PlatformIO pour la gestion du firmware, comme indiqué par le fichier de configuration `firmware/platformio.ini`.

#### Prérequis logiciels

- Installer [PlatformIO](https://platformio.org/install/ide?install=vscode) (extension pour VSCode recommandée).
![alt text](assets/ExtensionPlatIO.png)
- Avoir les drivers USB pour ESP32 installés.

#### Étapes de flashage

- Ouvrir le dossier firmware dans VSCode avec PlatformIO.
- PlatformIO détectera automatiquement le fichier `platformio.ini`.
- Connecter l'ESP32 via USB à l'ordinateur.
- Lorsque vous êtes prêt à flasher, placer vous sur le fichier `src/main.cpp` et cliquer sur l'icône "Upload" dans la barre d'outils en bas de VSCode.

![alt text](assets/Upload.png)
- Attendre la fin du processus de compilation et de flashage. Vous verrez les logs dans la console PlatformIO.
- Pour vérifier que le firmware fonctionne, ouvrez le moniteur série en cliquant sur l'icône "Serial Monitor" dans la barre d'outils afin de voir les messages de debug.

![alt text](assets/SerialMonitor.png)

*Note: Il est possible selon votre configuration machine que vscode n'ai pas les droits nécessaires pour accéder au port série. Dans ce cas, vous pouvez utiliser une solution immédiate mais pas très sécurisée:*

```bash
sudo chmod 666 /dev/ttyUSB0
```

*Remplacez `/dev/ttyUSB0` par le port série correspondant à votre ESP32.*

### Lancement de l'application mobile (Mode développement)

L'application mobile est développée avec React Native. Voici comment la lancer en mode développement.

#### Prérequis logiciels

- Installer [Node.js](https://nodejs.org/) version 20 ou supérieure sur votre machine.
- Installer JDK 17 pour être compatible avec gradle.
- Installer Android Studio pour émuler un appareil Android ou utiliser un appareil physique.

#### Installation des dépendances

- Ouvrir un terminal et naviguer vers le dossier `mobile`.
- Exécuter la commande suivante pour installer les dépendances :
  ```bash
  npm install
  ```

#### Lancement de l'application

Vous avez besoin de deux terminaux :

1. Dans le premier terminal, toujours dans le dossier `mobile`, lancer le serveur Metro avec la commande :
   ```bash
   npm start
   ```

2. Dans le second terminal, lancer l'application sur un émulateur ou un appareil connecté avec la commande :
   ```bash
    npm run android
    ```

*Note : Assurez-vous qu'Android Studio est lancé avec un émulateur lancé ou un téléphone Android branché avec le "Débogage USB" activé.*

L'application devrait se lancer sur l'émulateur ou l'appareil connecté. Vous pouvez maintenant interagir avec l'application mobile pour le monitoring et le contrôle de la ventilation.

#### Génération d'un APK pour distribution

Si vous souhaitez installer l'application sur un téléphone sans utiliser le mode développement (usage "client"), vous devez générer un fichier APK.

Pour des notions de praticité, un apk de l'état du projet au rendu est disponible dans le dossier `mobile/apk`

Sinon vous pouvez le générer:

1. Générer l'APK en mode release avec la commande :
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
2. L'APK généré se trouvera dans le dossier `android/app/build/outputs/apk/release/`. Vous pouvez l'installer sur un appareil Android soit:
   - En le transférant via USB et en l'ouvrant sur l'appareil.
   - Avec adbr sideloading :
     ```bash
     adb install -r mobile/android/app/build/outputs/apk/release/app-release.apk
     ```

L'application devrait maintenant être installée et prête à l'emploi sur votre appareil Android.

## Utilisation de l'application

L'application mobile permet de surveiller et de contrôler le dispositif de ventilation. Voici les principales fonctionnalités :

### Première connexion

- Ouvrez l'application sur votre appareil Android.
- L'application doit tout d'abord permettre de configurer les paramètres wi-fi pour que l'ESP32 puisse se connecter à votre réseau domestique.
- Suivez les instructions à l'écran pour entrer le SSID et le mot de passe de votre réseau Wi-Fi. Vous verrer également la possibilité de configurer la latitude et la longitude pour la récupération des données météo, celle-ci sont pré-remplis selon votre position GPS si vous avez autorisé l'application à y accéder sinon par défaut sur Grenoble.

<p align="center">
    <img src="assets/FirstConnection.png" alt="First Connection" width="300"/>
</p>

### Dashboard principal

- Après la connexion, vous serez redirigé vers le tableau de bord principal. (Il n'est plus nécessaire de se reconnecter à chaque ouverture de l'application, les paramètres sont sauvegardés localement).
- Le tableau de bord affiche l'état actuel du clapet de ventilation (ouvert/fermé), le pourcentage d'ouverture, ainsi que les données météo et qualité de l'air en temps réel.

<p align="center">
    <img src="assets/Dashboard.png" alt="Dashboard" width="300"/>
</p>

D'ici, vous pouvez switcher entre le mode automatique et manuel, une fois en mode manuel vous pouvez régler l'ouverture du clapet via le slider ou les boutons d'ouverture/fermeture rapide.

<p align="center">
    <img src="assets/ManualControl.png" alt="Manual Control" width="300"/>
</p>

En cas d'activation de la sécurité de blocage, un message d'alerte s'affichera:

<p align="center">
    <img src="assets/Error.jpg" alt="Alert" width="300"/>
</p>

### Paramétrage des seuils

- Accédez à l'écran des paramètres en cliquant sur l'icône d'engrenage suivi de reglages.
- Ici, vous pouvez définir les seuils pour le mode automatique.

<p align="center">
    <img src="assets/Settings.png" alt="Settings" width="300"/>
</p>
