import { Injectable } from "@angular/core";
import { appConfig } from "@app/app.config";

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  setItem(key: string, value: any): void {
    localStorage.setItem(`${appConfig.guid}/${key}`, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(`${appConfig.guid}/${key}`);
    return item ? JSON.parse(item) as T : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(`${appConfig.guid}/${key}`);
  }

  clear(): void {
    localStorage.clear();
  }

}