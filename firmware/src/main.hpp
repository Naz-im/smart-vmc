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

/** @file main.hpp
 *  @brief Déclarations principales pour le firmware de contrôle de fenêtre VMC
 */

/**
 * @brief Variable pin du servomoteur
 */
#define SERVO_PIN 13
/**
 * @brief Variable pin du capteur de courant
 */
#define CURRENT_SENSOR_PIN 34
/**
 * @brief Seuil de courant maximal en mA
 */
#define MAX_CURRENT_THRESHOLD 2500
/**
 * @brief UUIDs pour le service et les caractéristiques BLE
 */
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
/**
 * @brief UUID de la caractéristique de configuration (WiFi, localisation)
 */
#define CHAR_CONFIG_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
/**
 * @brief UUID de la caractéristique d'adresse IP
 */
#define CHAR_IP_UUID "12345678-1234-1234-1234-1234567890ab"

/**
 * @brief Objet servomoteur pour contrôler l'ouverture de la fenêtre
 */
extern Servo windowServo;

/**
 * @brief Objet Preferences pour stocker la configuration persistante
 */
extern Preferences preferences;

/**
 * @brief Objet WebServer pour gérer les requêtes HTTP
 */
extern WebServer server;

/**
 * @brief Caractéristique BLE pour l'adresse IP
 */
extern BLECharacteristic *pIpChar;

/**
 * @brief SSID WiFi
 */
extern String wifi_ssid;
/**
 * @brief Mot de passe WiFi
 */
extern String wifi_pass;

/** 
 * @brief Variable de configuration de localisation
 */
extern float latitude;
/** 
 * @brief Variable de configuration de localisation
 */
extern float longitude;
/**
 * @brief Variables de configuration de la température maximum
 */
extern float tempMax;
/**
 * @brief Variables de configuration de la température minimum
 */
extern float tempMin;
/**
 * @brief Variables de configuration de la qualité de l'air maximum
 */
extern int aqiMax;

/**
 * @brief Indique si la ventilation est ouverte
 */
extern bool isOpen;

/**
 * @brief Indique si le mode automatique est activé
 */
extern bool autoMode;
/**
 * @brief Angle cible pour le servomoteur
 */
extern int targetAngle;
/**
 * @brief Indique si le verrouillage de sécurité est activé
 */
extern bool safetyLockout;
/**
 * @brief Dernière lecture du courant en mA
 */
extern int lastCurrentReading;
/**
 * @brief Angle actuel du servomoteur
 */
extern int currentAngle;
/**
 * @brief Dernière température lue
 */
extern float lastTemp;
/**
 * @brief Dernière qualité de l'air lue
 */
extern int lastAQI;
/**
 * @brief Timestamp de la dernière vérification météo
 */
extern unsigned long lastWeatherCheck;
/**
 * @brief Indique si un redémarrage est nécessaire
 */
extern bool shouldRestart;

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
