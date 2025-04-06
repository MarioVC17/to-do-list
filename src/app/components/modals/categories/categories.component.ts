import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonIcon, IonList, IonButton, IonButtons, IonItemSliding, IonFab, IonFabButton, IonItemOption, ModalController, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonList,
    IonButton,
    IonButtons,
    IonItem,
    IonFabButton,
    IonFab,
    FormsModule,
    IonInput
  ]
})
export class CategoriesComponent  implements OnInit {

  /**
   * @property categoryList
   * @type {Array<string>}
   * @description Array de categorías que se pasa desde el componente padre (TaskListComponent)
   * para que el usuario pueda seleccionar una al crear la tarea.
   */
  @Input() categoryList: Array<string> = [];

  /**
   * @property newCategoryName
   * @type {string}
   * @description Modelo para el input de la nueva categoría. Almacena el nombre de la categoría que el usuario quiere agregar.
   */
  public newCategoryName: string = '';

  /**
   * @property editingCategoryIndex
   * @type {number | null}
   * @description Almacena el índice de la categoría que el usuario está editando.
   * Si no se está editando ninguna categoría, su valor es null.
   */
  public editingCategoryIndex: number | null = null;

  /**
   * @constructor
   * @param {ModalController} _modalCtrl 
   * @param {StorageService} _storageService 
   */
  constructor(
    private _modalCtrl: ModalController,
    private _storageService: StorageService
  ) { }

  /**
   * @OnInit
   */
  ngOnInit() { }

  /**
   * @method closeModalWithSave
   * @returns {void}
   * @description Cierra el modal y pasa la lista de categorías actualizada al componente padre con el rol 'saved'.
   */
  public closeModalWithSave(): void {
    this._modalCtrl.dismiss({ updatedCategories: this.categoryList }, 'saved');
  }

  /**
   * @method addCategory
   * @async
   * @returns {void}
   * @description Agrega una nueva categoría a la 'categoryList' si el nombre no está vacío.
   * Luego, guarda la lista actualizada en el almacenamiento local y limpia el input.
   */
  public async addCategory(): Promise<void> {
    if (this.newCategoryName.trim() !== '') {
      this.categoryList.push(this.newCategoryName.trim());
      await this.saveCategoriesToStorage();
      this.newCategoryName = '';
    }
  }

  /**
   * @method startEditCategory
   * @param {number} index Número del índice de la categoría que se va a editar.
   * @returns {void}
   * @description Establece el índice de la categoría que se está editando para mostrar el input de edición.
   */
  public startEditCategory(index: number): void {
    this.editingCategoryIndex = index;
  }

  /**
   * @method saveEditedCategory
   * @async
   * @returns {void}
   * @description Guarda la categoría editada en la 'categoryList' y restablece el índice de edición.
   * Luego, guarda la lista actualizada en el almacenamiento local
   */
  public async saveEditedCategory(): Promise<void> {
    this.editingCategoryIndex = null;
    await this.saveCategoriesToStorage();
  }

  /**
   * @method deleteCategory
   * @async
   * @param {number} index Número del índice de la categoría que se va a eliminar.
   * @returns {void}
   * @description Elimina una categoría de la 'categoryList' en el índice especificado y guarda la lista actualizada en 
   * el almacenamiento local.
   */
  public async deleteCategory(index: number): Promise<void> {
    this.categoryList.splice(index, 1);
    await this.saveCategoriesToStorage();
  }

  /**
   * @private
   * @async
   * @method saveCategoriesToStorage
   * @returns {Promise<void>}
   * @description Guarda la 'categoryList' actual en el almacenamiento local.
   */
  private async saveCategoriesToStorage(): Promise<void> {
    await this._storageService.setValue('categories', this.categoryList);
  }
}
