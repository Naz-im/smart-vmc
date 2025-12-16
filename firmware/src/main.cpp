#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <NimBLEDevice.h>
#include <Preferences.h>

#define SERVO_PIN 13
Servo windowServo;
Preferences preferences;
WebServer server(3001);

#define SERVICE_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHAR_CONFIG_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHAR_IP_UUID "12345678-1234-1234-1234-1234567890ab"

BLECharacteristic *pIpChar;

String wifi_ssid = "";
String wifi_pass = "";
float latitude = 45.18;
float longitude = 5.72;

bool isOpen = false;
bool autoMode = true;
int targetAngle = 0;

float lastTemp = 0.0;
int lastAQI = 0;
unsigned long lastWeatherCheck = 0;

int currentAngle = -1;

void setWindow(int angle) {
    if (angle < 0) angle = 0;
    if (angle > 90) angle = 90;
    
    if (currentAngle == angle) return;

    windowServo.write(angle);
    currentAngle = angle;
    isOpen = (angle > 0);
}

void handleStatus() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    
    JsonDocument doc;
    doc["isOpen"] = isOpen;
    doc["temp"] = lastTemp;
    doc["aqi"] = lastAQI;
    doc["targetAngle"] = targetAngle;
    doc["autoMode"] = autoMode;
    
    String response;
    serializeJson(doc, response);
    server.send(200, "application/json", response);
}

void handleControl() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    
    if (server.method() == HTTP_OPTIONS) {
        server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
        server.send(204);
        return;
    }

    if (!server.hasArg("plain")) {
        server.send(400, "application/json", "{\"error\":\"Body missing\"}");
        return;
    }

    String body = server.arg("plain");
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, body);

    if (error) {
        server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
        return;
    }

    if (doc.containsKey("autoMode")) {
        autoMode = doc["autoMode"];
    }
    
    if (doc.containsKey("angle")) {
        autoMode = false;
        targetAngle = doc["angle"];
        setWindow(targetAngle);
    } 
    else if (doc.containsKey("action")) {
        autoMode = false;
        String action = doc["action"];
        if (action == "open") targetAngle = 90;
        if (action == "close") targetAngle = 0;
        setWindow(targetAngle);
    }

    JsonDocument resDoc;
    resDoc["success"] = true;
    
    JsonObject state = resDoc.createNestedObject("state");
    state["isOpen"] = isOpen;
    state["temp"] = lastTemp;
    state["aqi"] = lastAQI;
    state["targetAngle"] = targetAngle;
    state["autoMode"] = autoMode;

    String response;
    serializeJson(resDoc, response);
    server.send(200, "application/json", response);
}

class ConfigCallbacks : public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
        std::string value = pCharacteristic->getValue();
        if (value.length() > 0) {
            String data = String(value.c_str());
            int s1 = data.indexOf(';');
            int s2 = data.indexOf(';', s1 + 1);
            int s3 = data.indexOf(';', s2 + 1);
            
            if (s3 > 0) {
                wifi_ssid = data.substring(0, s1);
                wifi_pass = data.substring(s1 + 1, s2);
                latitude = data.substring(s2 + 1, s3).toFloat();
                
                int s4 = data.indexOf(';', s3 + 1);
                if (s4 > 0) longitude = data.substring(s3 + 1, s4).toFloat();
                else longitude = data.substring(s3 + 1).toFloat();

                preferences.begin("config", false);
                preferences.putString("ssid", wifi_ssid);
                preferences.putString("pass", wifi_pass);
                preferences.putFloat("lat", latitude);
                preferences.putFloat("lon", longitude);
                preferences.end();
                ESP.restart();
            }
        }
    }
};

void setup() {
    Serial.begin(115200);
    windowServo.setPeriodHertz(50);
    windowServo.attach(SERVO_PIN, 500, 2400);

    preferences.begin("config", true);
    wifi_ssid = preferences.getString("ssid", "");
    wifi_pass = preferences.getString("pass", "");
    latitude = preferences.getFloat("lat", 45.18);
    longitude = preferences.getFloat("lon", 5.72);
    preferences.end();

    if (wifi_ssid != "") {
        WiFi.begin(wifi_ssid.c_str(), wifi_pass.c_str());
        Serial.print("Connexion WiFi...");
        int tries = 0;
        while (WiFi.status() != WL_CONNECTED && tries < 30) {
            delay(500); 
            Serial.print("."); 
            tries++;
        }
        if (WiFi.status() == WL_CONNECTED) {
            Serial.println("\n✅ WiFi Connecté ! IP: " + WiFi.localIP().toString());
            
            // Démarrage Serveur Web
            server.on("/api/window/status", HTTP_GET, handleStatus);
            server.on("/api/window/control", HTTP_POST, handleControl);
            server.onNotFound([]() { server.send(404, "text/plain", "Not Found"); });
            server.begin();
        } else {
            Serial.println("\n❌ Échec WiFi (Mauvais MDP ?)");
        }
    }

    BLEDevice::init("ESP32_SmartWindow");
    BLEServer *pServer = BLEDevice::createServer();
    BLEService *pService = pServer->createService(SERVICE_UUID);
    
    BLECharacteristic *pChar = pService->createCharacteristic(CHAR_CONFIG_UUID, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE);
    pChar->setCallbacks(new ConfigCallbacks());
    
    pIpChar = pService->createCharacteristic(CHAR_IP_UUID, NIMBLE_PROPERTY::READ);
    
    String currentIp = (WiFi.status() == WL_CONNECTED) ? WiFi.localIP().toString() : "0.0.0.0";
    pIpChar->setValue(std::string(currentIp.c_str())); 

    pService->start();
    BLEDevice::getAdvertising()->addServiceUUID(SERVICE_UUID);
    BLEDevice::getAdvertising()->start();
}

void loop() {
    server.handleClient();

    if (millis() - lastWeatherCheck > 60000 || lastWeatherCheck == 0) {
        if (WiFi.status() == WL_CONNECTED) {
            HTTPClient http;
            http.begin("https://api.open-meteo.com/v1/forecast?latitude=" + String(latitude) + "&longitude=" + String(longitude) + "&current=temperature_2m,european_aqi");
            int code = http.GET();
            if (code > 0) {
                String payload = http.getString();
                JsonDocument doc; deserializeJson(doc, payload);
                lastTemp = doc["current"]["temperature_2m"];
                lastAQI = doc["current"]["european_aqi"];
                if (doc["current"]["european_aqi"].isNull()) lastAQI = 20;
                
                if (autoMode) {
                    if (lastTemp > 30.0 || lastAQI > 50) setWindow(0);
                    else setWindow(90);
                }
            }
            http.end();
        }
        lastWeatherCheck = millis();
    }
    delay(5);
}