import { parse } from "https://deno.land/std/yaml/mod.ts";
import { Config } from "./config.interface.ts";

export class ConfigService {
  private static instance: ConfigService;
  private config: Config | null = null;

  private constructor() {}

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  async loadConfig(path: string = "./config.yaml"): Promise<void> {
    try {
      const file = await Deno.readTextFile(path);
      this.config = parse(file) as Config;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error loading config: ${error.message}`);
      }
      throw new Error('Error desconocido al cargar la configuración');
    }
  }

  getConfig(): Config {
    if (!this.config) {
      throw new Error("Config not loaded");
    }
    return this.config;
  }
}