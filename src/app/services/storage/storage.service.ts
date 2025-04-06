import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private _storage: Storage) {
    this.init();
  }

  private async init() {
    const storage = await this._storage.create();
    this._storage = storage;
  }

  public async setValue(key: string, data: object): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      try {
        await this._storage.set(key, JSON.stringify(data));
        resolve(true);
      } catch(error) {
        resolve(false);
      }
    });
  }

  public async getValue(key: string): Promise<string> {
    return await this._storage.get(key);
  }

  public async removeValue(key: string): Promise<void> {
    await this._storage.remove(key);
  }
}
