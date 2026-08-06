import { Injectable } from "@angular/core";
import { appConfig } from "@app/app.config";

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  private cache: Record<string, any> = {};
  private getCache(key: string): any {
    if (typeof this.cache[key] === 'boolean' 
      || typeof this.cache[key] === 'number' 
      || typeof this.cache[key] === 'string') {
      return this.cache[key];
    }
    return this.cache[key] || null;
  }

  setItem(key: string, value: any): void {
    this.cache[key] = value;
    localStorage.setItem(`${appConfig.guid}/${key}`, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(`${appConfig.guid}/${key}`);
    return item ? JSON.parse(item) as T : this.getCache(key);
  }

  removeItem(key: string): void {
    delete this.cache[key];
    localStorage.removeItem(`${appConfig.guid}/${key}`);
  }

  clear(): void {
    this.cache = {};
    localStorage.clear();
  }

}