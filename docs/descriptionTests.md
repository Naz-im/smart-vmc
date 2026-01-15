# Documentation des Tests - Smart VMC

Ce document décrit la stratégie de test pour valider le fonctionnement de la Smart VMC (Firmware ESP32 + Application Mobile).

## Vue d'ensemble

Nous utilisons 3 niveaux de tests :
1.  **Tests Unitaires Firmware (C++)** : Valident les règles de décision (Météo -> Ouverture) sans modifier le code principal.
2.  **Tests Unitaires Mobile (Jest)** : Valident l'affichage et les composants de l'application React Native.
3.  **Tests d'Intégration (Script & Manuel)** : Valident la communication réelle entre l'App et l'ESP32.

---

## 1. Tests Unitaires Firmware (Logique)

Ces tests vérifient que l'algorithme de décision (Seuils Température/Pollution) fonctionne correctement. Ils utilisent une approche "Shadow Testing" (copie de la logique dans le test) pour ne pas avoir à modifier la structure du `main.cpp`.

* **Fichier de test** : `firmware/test/test_logic_rules.cpp`
* **Outil** : PlatformIO / Unity

### Comment lancer les tests ?

1.  Connectez votre ESP32 à l'ordinateur via USB.
2.  Ouvrez un terminal dans le dossier `firmware/` (ou utilisez le terminal PlatformIO dans VSCode).
3.  Exécutez la commande :

```bash
pio test -e esp32dev
```

### Résultats attendus
Vous devriez voir une série de succès (PASSED) correspondant aux scénarios :
* `test_cas_nominal_ouverture`
* `test_protection_chaleur`
* `test_protection_pollution`
* `test_conservation_chaleur`

---

## 2. Tests Unitaires Mobile (Interface)

Ces tests vérifient que l'interface utilisateur réagit correctement aux données (affichage des alertes, changement de couleur, etc.).

* **Dossier de tests** : `mobile/__tests__/`
* **Outil** : Jest (inclus dans React Native)

### Comment lancer les tests ?

1.  Ouvrez un terminal dans le dossier `mobile/`.
2.  Exécutez la commande :

\`\`\`bash
npm test
\`\`\`

### Ce qui est testé
* **StatusDisplay** : Vérifie que le sens interdit rouge s'affiche en cas de sécurité active.
* **SensorRow** : Vérifie l'affichage correct des températures et AQI.
* **ControlPanel** : Vérifie que les boutons de contrôle manuel sont désactivés/remplacés en cas d'urgence.

---

## 3. Tests d'Intégration (Robot Testeur)

Ce script automatique ("Robot") se comporte comme une application mobile. Il envoie des ordres à l'ESP32 via le réseau WiFi et vérifie que l'ESP32 obéit.

* **Fichier de script** : `scripts/test-api.js`
* **Pré-requis** : Node.js installé.

### Comment lancer le test ?

1.  Assurez-vous que l'ESP32 est allumé et connecté au même réseau WiFi que votre ordinateur.
2.  Récupérez son **adresse IP** (via le Moniteur Série ou l'écran de l'application).
3.  À la racine du projet, lancez :

\`\`\`bash
node scripts/test-api.js <IP_DE_VOTRE_ESP32>
\`\`\`
*Exemple : `node scripts/test-api.js 192.168.1.45`*

### Scénario exécuté
Le script va automatiquement :
1.  Vérifier la connexion (Ping/Status).
2.  Forcer le mode manuel et ouvrir la trappe.
3.  Vérifier que la trappe est bien à 90°.
4.  Fermer la trappe et vérifier le retour à 0°.
5.  Réactiver le mode automatique.
6.  **(Interactif)** Vous demander de déclencher la sécurité manuellement pour valider l'arrêt d'urgence.

---

## 4. Validation Manuelle (Cahier de Recette)

Pour les tests physiques impliquant le matériel (Moteur, Capteur de courant), référez-vous au document de validation manuelle.

### Test Critique : Sécurité Hardware
Pour valider l'exigence 07 sans endommager le moteur :
1.  Lancer le système.
2.  Utiliser un fil (jumper) pour relier brièvement le **PIN 34** au **3.3V**.
3.  **Résultat immédiat attendu** :
    * Arrêt du moteur (si en mouvement).
    * Apparition de l'écran "SÉCURITÉ ACTIVE" sur l'application mobile.
    * Verrouillage des commandes jusqu'au clic sur "DÉBLOQUER".
