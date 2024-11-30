import fs from "fs";
import path from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

// Config schema for validation
const schema = {
    type: "object",
    properties: {
        mqttBrokerUrl: { type: "string", format: "uri" },
        logFormat: { type: "string", enum: ["console", "ecs"] },
    },
    required: ["mqttBrokerUrl", "logFormat"],
    additionalProperties: false,
};

class Config {
    private static instance?: Config = undefined;
    private readonly config: Record<string, any>;

    private constructor() {
        const env = process.env.NODE_ENV || "development";
        const basePath = path.resolve(__dirname, "../config");
        const baseConfigPath = path.join(basePath, "config.json");
        const envConfigPath = path.join(basePath, `config.${env}.json`);

        // Load base configuration
        const baseConfig = JSON.parse(fs.readFileSync(baseConfigPath, "utf8"));
        let envConfig = {};

        // Load environment-specific configuration if it exists
        if (fs.existsSync(envConfigPath)) {
            envConfig = JSON.parse(fs.readFileSync(envConfigPath, "utf8"));
        }

        // Merge configurations
        this.config = { ...baseConfig, ...envConfig };

        // Validate configuration
        const ajv = new Ajv();
        addFormats(ajv);
        const validate = ajv.compile(schema);
        if (!validate(this.config)) {
            throw new Error(
                `Invalid configuration: ${JSON.stringify(validate.errors)}`
            );
        }

        console.log(`Loaded configuration for environment: ${env}`);
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    public get(key: string): any {
        return this.config[key];
    }
}

export default Config;
