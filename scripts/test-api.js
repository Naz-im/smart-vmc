// Script de test d'intégration pour Smart VMC
// Utilisation : node test-api.js <IP_ESP32>
// Exemple : node test-api.js 192.168.1.50

const ip = process.argv[2];

if (!ip) {
    console.error("❌ Erreur : Veuillez fournir l'IP de l'ESP32.");
    console.log("Usage : node test-api.js 192.168.X.X");
    process.exit(1);
}

const BASE_URL = `http://${ip}:3001/api/window`;

async function runTests() {
    console.log(`🚀 Démarrage des tests sur l'ESP32 à l'adresse ${ip}...\n`);

    try {
        // --- TEST 1 : Vérifier que l'API répond (Ping) ---
        console.log("Test 1: Lecture du statut initial...");
        const statusResponse = await fetch(`${BASE_URL}/status`);
        if (!statusResponse.ok) throw new Error("API inaccessible");
        const initialStatus = await statusResponse.json();
        console.log(`✅ Statut reçu. Temp: ${initialStatus.temp}°C, Mode: ${initialStatus.autoMode ? 'Auto' : 'Manuel'}`);

        // --- TEST 2 : Passer en Mode Manuel et Ouvrir ---
        console.log("\nTest 2: Commande 'Ouvrir' (Mode Manuel)...");
        await fetch(`${BASE_URL}/control`, {
            method: 'POST',
            body: JSON.stringify({ action: 'open' })
        });
        
        // Petite pause pour laisser le moteur bouger
        await new Promise(r => setTimeout(r, 1000));
        
        const openStatus = await (await fetch(`${BASE_URL}/status`)).json();
        if (openStatus.targetAngle === 90 && openStatus.isOpen === true) {
            console.log("✅ Succès : La fenêtre est marquée OUVERTE (90°).");
        } else {
            console.error(`❌ Échec : Attendait 90°, reçu ${openStatus.targetAngle}°`);
        }

        // --- TEST 3 : Fermer la fenêtre ---
        console.log("\nTest 3: Commande 'Fermer'...");
        await fetch(`${BASE_URL}/control`, {
            method: 'POST',
            body: JSON.stringify({ action: 'close' })
        });
        
        await new Promise(r => setTimeout(r, 1000));
        const closedStatus = await (await fetch(`${BASE_URL}/status`)).json();
        if (closedStatus.targetAngle === 0 && closedStatus.isOpen === false) {
            console.log("✅ Succès : La fenêtre est marquée FERMÉE (0°).");
        } else {
            console.error(`❌ Échec : Attendait 0°, reçu ${closedStatus.targetAngle}°`);
        }

        // --- TEST 4 : Retour au Mode Auto ---
        console.log("\nTest 4: Réactivation du Mode Auto...");
        await fetch(`${BASE_URL}/control`, {
            method: 'POST',
            body: JSON.stringify({ autoMode: true })
        });
        
        const autoStatus = await (await fetch(`${BASE_URL}/status`)).json();
        if (autoStatus.autoMode === true) {
            console.log("✅ Succès : Mode Auto réactivé.");
        } else {
            console.error("❌ Échec : Le mode auto ne s'est pas activé.");
        }
        
        console.log("\n🎉 TOUS LES TESTS API SONT PASSÉS !");

    } catch (error) {
        console.error("\n💥 ERREUR CRITIQUE PENDANT LES TESTS :", error.message);
    }
}

runTests();
