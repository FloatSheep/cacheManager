import { PromiseUtils, parseResponse } from "../utils";

interface CacheManagerConfig {
  cachePrefix?: string;
  cacheNamespace?: string;
  broadId?: string;
}

class CacheManager {
  private static instance: CacheManager;
  private cachePrefix!: string;
  private cacheNamespace!: string;
  private broadId!: string;
  private cacheName!: string;
  private cache: Cache | undefined;
  private isInitialized: boolean = false;

  constructor({
    cachePrefix = "app",
    cacheNamespace = "default",
    broadId = "global",
  }: CacheManagerConfig = {}) {
    if (CacheManager.instance) {
      return CacheManager.instance;
    }
    this.cachePrefix = cachePrefix;
    this.cacheNamespace = cacheNamespace;
    this.broadId = broadId;
    this.cacheName = `${this.cachePrefix}-${this.cacheNamespace}-${this.broadId}`;
    CacheManager.instance = this;
  }

  init(): PromiseUtils<Cache> {
    return new PromiseUtils(async (resolve, reject) => {
      try {
        this.cache = await caches.open(this.cacheName);
        this.isInitialized = true;
        resolve(this.cache);
      } catch (error) {
        this.handleError(error);
        reject(error);
      }
    });
  }

  setItem(key: string, value: any, ContentType: string = "text/plain"): PromiseUtils<boolean> {
    return new PromiseUtils(async (resolve, reject) => {
      if (!this.isInitialized) {
        const error = new Error('CacheManager is not initialized. Call init() before using setItem.');
        this.handleError(error);
        reject(error);
        return;
      }

      try {
        const response = new Response(JSON.stringify(value), {
          headers: { "Content-Type": ContentType },
        });
        await this.cache?.put(key, response);
        resolve(true);
      } catch (error) {
        this.handleError(error);
        reject(error);
      }
    });
  }

  getItem<T>(key: string): PromiseUtils<T | null | boolean> {
    return new PromiseUtils(async (resolve, reject) => {
      if (!this.isInitialized) {
        const error = new Error('CacheManager is not initialized. Call init() before using getItem.');
        this.handleError(error);
        reject(error);
        return;
      }

      try {
        const response = await this.cache?.match(key);
        if (!response) {
          resolve(false);
          return;
        };

        const data = await parseResponse(response);

        resolve(data);
      } catch (error) {
        this.handleError(error);
        reject(error);
      }
    });
  }

  removeItem(key: string): PromiseUtils<boolean> {
    return new PromiseUtils(async (resolve, reject) => {
      if (!this.isInitialized) {
        const error = new Error(
          "CacheManager is not initialized. Call init() before using removeItem."
        );
        this.handleError(error);
        reject(error);
        return;
      }

      try {
        await this.cache?.delete(key);
        resolve(true);
      } catch (error) {
        this.handleError(error);
        reject(error);
      }
    });
  }

  private handleError(error: any): void {
    throw new Error(error.stack || error);
  }
}

export { CacheManager };
