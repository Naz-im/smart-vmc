#include <unity.h>
#include <Arduino.h>

// =========================================================================
// LOGIQUE MIROIR (Copiée depuis main.cpp pour validation)
// =========================================================================
int decisionVMC(float lastTemp, int lastAQI, float tempMax, float tempMin, int aqiMax) {
    
    // Règle 1 : Protection (Trop chaud OU Trop pollué)
    if (lastTemp > tempMax || lastAQI > aqiMax) {
        return 0; // Doit fermer
    }
    // Règle 2 : Confort (Température idéale > Min)
    else if (lastTemp > tempMin) {
        return 90; // Doit ouvrir
    }
    // Règle 3 : Hiver (Trop froid)
    else {
        return 0; // Doit fermer
    }
}

// =========================================================================
// LES SCÉNARIOS DE TESTS
// =========================================================================

// Test 1 : Tout va bien, il fait bon
void test_cas_nominal_ouverture(void) {
    // Temp 22°C (entre 18 et 30), AQI 20 (propre)
    int angle = decisionVMC(22.0, 20, 30.0, 18.0, 50);
    TEST_ASSERT_EQUAL_MESSAGE(90, angle, "Devrait OUVRIR car 22C est ideal");
}

// Test 2 : Canicule (Exigence 01)
void test_protection_chaleur(void) {
    // Temp 35°C (Supérieur à Max 30), AQI 20
    int angle = decisionVMC(35.0, 20, 30.0, 18.0, 50);
    TEST_ASSERT_EQUAL_MESSAGE(0, angle, "Devrait FERMER car 35C > 30C");
}

// Test 3 : Pollution (Exigence 01)
void test_protection_pollution(void) {
    // Temp 22°C (Bonne), mais AQI 80 (Supérieur à Max 50)
    int angle = decisionVMC(22.0, 80, 30.0, 18.0, 50);
    TEST_ASSERT_EQUAL_MESSAGE(0, angle, "Devrait FERMER car AQI 80 > 50");
}

// Test 4 : Grand Froid (Hiver)
void test_conservation_chaleur(void) {
    // Temp 10°C (Inférieur à Min 18)
    int angle = decisionVMC(10.0, 20, 30.0, 18.0, 50);
    TEST_ASSERT_EQUAL_MESSAGE(0, angle, "Devrait FERMER car 10C < 18C");
}

// Test 5 : Limites exactes (Edge Case)
void test_limites_exactes(void) {
    // Que se passe-t-il exactement à 30.0°C ?
    // Votre code dit: if (temp > tempMax) -> 30 > 30 est FAUX.
    // Donc ça passe au 'else if (temp > tempMin)' -> VRAI.
    // Donc à 30.0°C pile, ça reste OUVERT. C'est le comportement testé ici.
    int angle = decisionVMC(30.0, 20, 30.0, 18.0, 50);
    TEST_ASSERT_EQUAL_MESSAGE(90, angle, "A 30C pile, ca devrait rester ouvert selon la logique actuelle");
}

void setup() {
    delay(2000); 
    UNITY_BEGIN();
    RUN_TEST(test_cas_nominal_ouverture);
    RUN_TEST(test_protection_chaleur);
    RUN_TEST(test_protection_pollution);
    RUN_TEST(test_conservation_chaleur);
    RUN_TEST(test_limites_exactes);
    UNITY_END();
}

void loop() {}
