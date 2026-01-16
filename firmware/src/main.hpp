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

#define SERVO_PIN 13
#define CURRENT_SENSOR_PIN 34
#define MAX_CURRENT_THRESHOLD 2500
#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHAR_CONFIG_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHAR_IP_UUID "12345678-1234-1234-1234-1234567890ab"

extern Servo windowServo;


extern Preferences preferences;


extern WebServer server;


extern BLECharacteristic *pIpChar;


extern String wifi_ssid;
extern String wifi_pass;

extern float latitude;
extern float longitude;
extern float tempMax;
extern float tempMin;
extern int aqiMax;

extern bool isOpen;
extern bool autoMode;
extern int targetAngle;

extern bool safetyLockout;

extern int lastCurrentReading;
extern int currentAngle;

extern float lastTemp;
extern int lastAQI;
extern unsigned long lastWeatherCheck;

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
