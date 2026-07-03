import { Injectable } from "@angular/core"
import { appConfig } from "@app/app.config";

@Injectable({ providedIn: 'root' })
export class SessionStorageService {

  setItem(key: string, value: any): void {
    sessionStorage.setItem(`${appConfig.guid}/${key}`, JSON.stringify(value));
  }

  getItem<T>(key: string): T | null {
    const item = sessionStorage.getItem(`${appConfig.guid}/${key}`);
    return item ? JSON.parse(item) as T : null;
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(`${appConfig.guid}/${key}`);
  }

  clear(): void {
    sessionStorage.clear();
  }

}