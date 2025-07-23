import { Injectable } from '@angular/core';

type StorageType = 'local' | 'session';

@Injectable({
  providedIn: 'root'
})
export abstract class StorageService<T> {
  private readonly storage: Storage;

  constructor(protected readonly storageKey: string, type: StorageType = 'local') {
    this.storage = type === 'local' ? localStorage : sessionStorage;
  }

  protected getItem(): T | null {
    const data = this.storage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  protected setItem(value: T): void {
    this.storage.setItem(this.storageKey, JSON.stringify(value));
  }

  protected removeItem(): void {
    this.storage.removeItem(this.storageKey);
  }

  clear(): void {
    this.storage.clear();
  }
}