import pino from "pino";
import ecsFormat from "@elastic/ecs-pino-format";
import Config from "./config";

class Logger {
    private static instance?: pino.Logger = undefined;

    private constructor() {}

    public static getInstance(): pino.Logger {
        if (!Logger.instance) {
            const logFormat = Config.getInstance().get("logFormat");

            const options =
                logFormat === "ecs"
                    ? ecsFormat() // Use ECS format
                    : { transport: { target: "pino-pretty" } }; // Use pretty console logs for default

            Logger.instance = pino(options);
        }

        return Logger.instance;
    }
}

export default Logger;
