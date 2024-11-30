import mqtt from "mqtt";
import Config from "./config";
import Logger from "./logger";
import type pino from "pino";

// Load configuration
const config = Config.getInstance();
const MQTT_BROKER_URL = config.get("mqttBrokerUrl");
const TOPIC_BASE = "mes/production";
const INTERVAL_MS = 1000;

// Sample Device IDs (numeric) and Statuses
const DEVICES = [101, 102, 103, 104];
const STATUSES = ["Running", "Idle", "Maintenance", "Error"];

const _logger: pino.Logger = Logger.getInstance();

// Generate random data
function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function generateRandomTraffic(): Record<string, any> {
    const deviceId = getRandomElement(DEVICES);
    const status = getRandomElement(STATUSES);

    return {
        deviceId,
        status,
        timestamp: new Date().toISOString(),
        productionCount: Math.floor(Math.random() * 1000),
        qualityMetrics: {
            defects: Math.floor(Math.random() * 10),
            inspection: Math.random() > 0.9 ? "Failed" : "Passed",
        },
    };
}

// MQTT Client
const client = mqtt.connect(MQTT_BROKER_URL);

client.on("connect", () => {
    _logger.info(`Connected to MQTT broker at ${MQTT_BROKER_URL}`);
    setInterval(() => {
        const traffic = generateRandomTraffic();
        const topic = `${TOPIC_BASE}/${traffic.deviceId}`;
        const message = JSON.stringify(traffic);

        client.publish(topic, message, { qos: 1 }, (err) => {
            if (err) {
                _logger.error({ err }, "Error publishing message");
            } else {
                _logger.info({ topic, message }, "Published message");
            }
        });
    }, INTERVAL_MS);
});

client.on("error", (err) => {
    _logger.error({ err }, "MQTT connection error");
    client.end();
});
