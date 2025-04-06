import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  /**
   * @constructor
   * @param {Storage} _storage 
   */
  constructor(private _storage: Storage) {
    this.init();
  }

  /**
   * @private
   * @async
   * @method init
   * @returns {Promise<void>}
   * @description Inicializa el servicio de almacenamiento de Ionic. Debe ser llamado antes de usar el almacenamiento.
   */
  private async init(): Promise<void> {
    const storage = await this._storage.create();
    this._storage = storage;
  }

  /**
   * @async
   * @method setValue
   * @param {string} key Clave única bajo la cual se guardarán los datos.
   * @param {object} data Objeto que se va a guardar. Se serializará a JSON antes de ser almacenado.
   * @returns {Promise<boolean>}
   * @description Establece el valor en el almacenamiento
   */
  public async setValue(key: string, data: object): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      try {
        await this._storage.set(key, JSON.stringify(data));
        resolve(true);
      } catch(error) {
        console.error('Error saving data to storage:', error);
        resolve(false);
      }
    });
  }

  /**
   * @async
   * @method getValue
   * @param {string} key Clave bajo la cual se guardaron los datos.
   * @returns {Promise<string>}
   * @description Obtiene el valor en el almacenamiento usando la key
   */
  public async getValue(key: string): Promise<string> {
    return await this._storage.get(key);
  }

  /**
   * @async
   * @method removeValue
   * @param {string} key Clave del valor que se va a eliminar del almacenamiento.
   * @returns {Promise<void>}
   * @description Elimina un valor del almacenamiento usando la key
   */
  public async removeValue(key: string): Promise<void> {
    await this._storage.remove(key);
  }
}
