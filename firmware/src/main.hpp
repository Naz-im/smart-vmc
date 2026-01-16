#ifndef MAIN_HPP
#define MAIN_HPP

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <NimBLEDevice.h>
#include <Preferences.h>

/**
 * @defgroup Pin Definitions
 * @brief Configuration des pins ESP32
 * @{
 */

/// @brief pin du servo moteur
#define SERVO_PIN 13
/// @brief pin de courant pour la sécurité
#define CURRENT_SENSOR_PIN 34
/// @brief Seuil maximum de courant avant déclenchement du verrouillage de sécurité
#define MAX_CURRENT_THRESHOLD 2500

/// @brief UUID du service BLE principal
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
/// @brief UUID de la caractéristique BLE pour la configuration WiFi et localisation
#define CHAR_CONFIG_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
/// @brief UUID de la caractéristique BLE pour lire l'adresse IP de l'appareil
#define CHAR_IP_UUID "12345678-1234-1234-1234-1234567890ab"
/** @} */

/**
 * @defgroup Global Objects
 * @{
 */
/// @brief Instance du servomoteur contrôlant l'ouverture de la fenêtre
extern Servo windowServo;

/// @brief Gestionnaire des préférences
extern Preferences preferences;

/// @brief Serveur HTTP pour les API REST sur le port 3001
extern WebServer server;

/// @brief Pointeur vers la caractéristique BLE affichant l'adresse IP
extern BLECharacteristic *pIpChar;

/** @} */

/**
 * @defgroup Configuration WIFI
 * @brief Identifiants de connexion au réseau WiFi
 * @{
 */

/// @brief SSID du réseau WiFi à connecter
extern String wifi_ssid;

/// @brief Mot de passe du réseau WiFi
extern String wifi_pass;
/** @} */

/**
 * @defgroup Localisation
 * @brief Coordonnées géographiques pour les requêtes météo
 * @{
 */

/// @brief Latitude actuelle (défaut: Grenoble 45.18°)
extern float latitude;

/// @brief Longitude actuelle (défaut: Grenoble 5.72°)
extern float longitude;
/** @} */


/**
 * @defgroup Environment Exterieur
 * @brief Seuils de température et qualité d'air
 * @{
 */

/// @brief Température maximale (°C) avant ouverture automatique
extern float tempMax;

/// @brief Température minimale (°C) avant fermeture automatique
extern float tempMin;

/// @brief Indice de qualité de l'air maximum avant fermeture automatique
extern int aqiMax;
/** @} */

/**
 * @defgroup état de la VMC
 * @brief État courant du système de ventilation
 * @{
 */

/// @brief Indique si la fenêtre est actuellement ouverte (angle > 0)
extern bool isOpen;

/// @brief Mode automatique activé (régulation basée sur météo)
extern bool autoMode;

/// @brief Angle cible du servomoteur (0-90°)
extern int targetAngle;

/// @brief Verrouillage de sécurité actif suite à une surintensité
extern bool safetyLockout;

/// @brief Dernière lecture du capteur de courant
extern int lastCurrentReading;

/// @brief Angle actuel du servomoteur (0-90°)
extern int currentAngle;

/** @} */

/**
 * @defgroup mesures environnementaux
 * @brief Dernières mesures enregistrées
 * @{
 */
/// @brief Dernière température relevée (°C) via API météo
extern float lastTemp;

/// @brief Dernier indice AQI relevé via API météo
extern int lastAQI;

/// @brief Timestamp du dernier appel API météo
extern unsigned long lastWeatherCheck;
/** @} */

/**
 * @defgroup état du System
 * @brief État système
 * @{
 */
/// @brief indique si on doit redémarrer le système
extern bool shouldRestart;
/** @} */

/**
 * @defgroup Fonctions Principales
 * @brief Déclarations des fonctions principales
 * @{
 */

/**
 * @brief Vérifie l'état de sécurité du système
 * @details Lit le capteur de courant et vérifie s'il dépasse le seuil
 * @return true si sécurisé, false si surintensité détectée
 */
bool checkSafety();

/**
 * @brief Commande le servomoteur à un angle spécifique
 * @param angle Angle cible en degrés (0-90)
 * @details Vérifie la sécurité, contraint l'angle et met à jour l'état
 */
void setVMC(int angle);

/**
 * @brief Gestionnaire HTTP GET /api/window/status
 * @details Retourne l'état complet du système en JSON
 */
void handleStatus();

/**
 * @brief Gestionnaire HTTP POST /api/window/control
 * @details Reçoit les commandes pour contrôler la fenêtre
 */
void handleControl();

/**
 * @brief Initialisation de la connexion (WiFi, BLE, serveur)
 */
void setup();
/**
 * @brief Boucle d'exécution principale
 * @details Gère les requêtes HTTP, la météo et les redémarrages
 */
void loop();

/** @} */

/**
 * @class ConfigCallbacks
 * @brief Traite les configurations WiFi et de localisation
 */
class ConfigCallbacks : public BLECharacteristicCallbacks {
    /**
     * @brief Appelé lors de l'écriture sur la caractéristique de configuration
     * @param pCharacteristic wifi_ssid;wifi_pass;latitude;longitude
     */
    void onWrite(BLECharacteristic *pCharacteristic);
};

#endif // MAIN_HPP
