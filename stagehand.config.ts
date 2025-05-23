import dotenv from "dotenv";
import type { ConstructorParams } from "@browserbasehq/stagehand";

dotenv.config();


const StagehandConfig: ConstructorParams = {
  verbose: 0,
  domSettleTimeoutMs: 30_000,

  env: "LOCAL",
  modelName: "google/gemini-2.0-flash",
  modelClientOptions: {
    apiKey: process.env.GOOGLE_API_KEY,
  },
  localBrowserLaunchOptions: {
    executablePath: "/usr/bin/brave-browser",
  }
};

export default StagehandConfig;
