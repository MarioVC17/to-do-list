import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonIcon, IonList, IonCheckbox, IonPopover, IonListHeader, IonCard, IonCardContent, IonItemSliding, ModalController, IonButton, IonButtons, IonBadge, IonSelectOption, IonSelect } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, pricetagOutline, returnUpBackOutline, createOutline, pencilOutline } from 'ionicons/icons';
import { StorageService } from 'src/app/services/storage/storage.service';
import { AddTaskComponent } from 'src/app/components/modals/add-task/add-task.component';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from 'src/app/components/modals/categories/categories.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
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
    IonCheckbox,
    ReactiveFormsModule,
    IonListHeader,
    CommonModule,
    IonButton,
    IonButtons,
    IonCard,
    IonBadge,
    FormsModule,
    IonSelectOption,
    IonSelect
  ]
})

export class TaskListComponent  implements OnInit {

  /**
   * @property taskList
   * @type {Array<{ name: string; status: boolean, categorie: string }>}
   * @description Array que almacena todas las tareas. Cada tarea tiene un nombre, estado (completada o no) y categoría.
   */
  public taskList: Array<{ name: string; status: boolean, categorie: string }> = [];

  /**
   * @property filteredTaskList
   * @type {Array<{ name: string; status: boolean, categorie: string }>}
   * @description Array que contiene la lista de tareas después de aplicar el filtro por categoría.
   */
  public filteredTaskList: Array<{ name: string; status: boolean, categorie: string }> = [];

  /**
   * @property categoryList
   * @type {Array<string>}
   * @description Array que contiene la lista de categorías disponibles para las tareas. Inicializada con valores por defecto.
   */
  public categoryList: Array<string> = ['Urgente', 'Normal', 'No urgente'];

  /**
   * @property selectedFilterCategory
   * @type {string}
   * @description Almacena la categoría seleccionada para filtrar la lista de tareas. Un valor vacío indica que no hay filtro aplicado.
   */
  public selectedFilterCategory: string = '';

  /**
   * @constructor
   * @param {ModalController} _modalCtrl 
   * @param {StorageService} _storageService 
   */
  constructor(
    private _modalCtrl: ModalController,
    private _storageService: StorageService
  ) {
    addIcons({
      add,
      trash,
      pencilOutline,
      createOutline,
      pricetagOutline,
      returnUpBackOutline,
    });
  }

  /**
   * @OnInit
   * @async
   * @description Hook del ciclo de vida que se ejecuta una vez que el componente ha sido inicializado, en este
   * se carga las tareas y las categorías desde el almacenamiento local y aplica el filtro inicial.
   */
  async ngOnInit() {
    await this.loadTasksFromStorage();
    await this.loadCategoriesFromStorage();
    this.applyCategoryFilter();
  }

  /**
   * @method pendingTasks
   * @returns {Array<{ name: string; status: boolean, categorie: string }>}
   * @description Getter que devuelve la lista de tareas pendientes (aquellas dónde la propiedad 'status' es false).
   */
  public get pendingTasks(): Array<{ name: string; status: boolean, categorie: string }> {
    return this.filteredTaskList.filter(task => !task.status);
  }

  /**
   * @method completedTasks
   * @returns {Array<{ name: string; status: boolean, categorie: string }>}
   * @description Getter que devuelve la lista de tareas completadas (aquellas dónde la propiedad 'status' es true).
   */
  public get completedTasks(): Array<{ name: string; status: boolean, categorie: string }> {
    return this.filteredTaskList.filter(task => task.status);
  }

  /**
   * @method applyCategoryFilter 
   * @param {string} categorie - La categoría por la cual filtrar. Si no se proporciona, se utiliza la 'selectedFilterCategory' actual.
   * @description Filtra la 'taskList' y actualiza la 'filteredTaskList' basándose en la categoría seleccionada.
   * Si no hay una categoría seleccionada, se muestran todas las tareas.
   */
  public applyCategoryFilter(categorie?: string) {
    this.selectedFilterCategory = categorie !== undefined ? categorie : this.selectedFilterCategory;
    if (!this.selectedFilterCategory) {
      this.filteredTaskList = [...this.taskList];
    } else {
      this.filteredTaskList = this.taskList.filter(task => task.categorie === this.selectedFilterCategory);
    }
  }

  /**
   * @method openAddTaskModal
   * @async
   * @returns {Promise<void>}
   * @description Abre un modal para agregar una nueva tarea. Pasa la lista de categorías al modal.
   * Después de que el modal se cierra con éxito ('saved'), recarga la lista de tareas.
   */
  public async openAddTaskModal(): Promise<void> {
    const modal = await this._modalCtrl.create({
      component: AddTaskComponent,
      componentProps: {
        'categoryList': this.categoryList
      }
    });
    modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'saved') {
      await this.loadTasksFromStorage();
    }
  }

  /**
   * @method removeTask
   * @async
   * @param {number} index Número del índice de la tarea a eliminar en la 'taskList'.
   * @returns {Promise<void>}
   * @description Elimina una tarea de la 'taskList' en el índice especificado y guarda la lista actualizada en el almacenamiento local.
   */
  public async removeTask(index: number): Promise<void> {
    this.taskList.splice(index, 1);
    await this.saveTasksToStorage();
  }

  /**
   * @method toggleTaskStatus
   * @async
   * @param {any} task El objeto de la tarea dónde el estado se va a cambiar.
   * @returns {Promise<void>}
   * @description Cambia el estado de completado ('status') de una tarea y guarda la lista actualizada en el almacenamiento local
   */
  public async toggleTaskStatus(task: any): Promise<void> {
    task.status = !task.status;
    await this.saveTasksToStorage();
  }

  /**
   * @method openCategoriesModal
   * @async
   * @returns {Promise<void>}
   * @description Abre un modal para gestionar las categorías, si el modal se cierra con éxito ('saved') y devuelve 
   * una lista de categorías actualizada, actualiza la 'categoryList' local y la guarda en el almacenamiento.
   */
  public async openCategoriesModal(): Promise<void> {
    const modal = await this._modalCtrl.create({
      component: CategoriesComponent,
      componentProps: {
        'categoryList': this.categoryList
      }
    });
    modal.present();
    const { role, data } = await modal.onDidDismiss();
    if (role === 'saved' && data?.updatedCategories) {
      this.categoryList = data.updatedCategories;
      await this.saveCategoriesToStorage();
      this.applyCategoryFilter();
    }
  }

  /**
   * @private
   * @method loadTasksFromStorage
   * @async
   * @returns {Promise<void>}
   * @description Carga la lista de tareas desde el almacenamiento local y actualiza la 'taskList'.
   */
  private async loadTasksFromStorage(): Promise<void> {
    const storedTasks = await this._storageService.getValue('tasks');
    this.taskList = storedTasks ? JSON.parse(storedTasks) : [];
    this.applyCategoryFilter();
  }

  /**
   * @private
   * @method saveTasksToStorage
   * @async
   * @returns {Promise<void>}
   * @description Guarda la 'taskList' actual en el almacenamiento local.
   */
  private async saveTasksToStorage(): Promise<void> {
    await this._storageService.setValue('tasks', this.taskList);
  }

  /**
   * @private
   * @method loadCategoriesFromStorage
   * @async
   * @returns {Promise<void>}
   * @description Carga la lista de categorías desde el almacenamiento local y actualiza la 'categoryList', en caso de
   * que la lista este vacía, guarda la lista por defecto.
   */
  private async loadCategoriesFromStorage(): Promise<void> {
    const storedCategories = await this._storageService.getValue('categories');
    if (storedCategories) {
      this.categoryList = JSON.parse(storedCategories);
    } else {
      await this.saveCategoriesToStorage();
    }
  }

  /**
   * @private
   * @method saveCategoriesToStorage
   * @async
   * @returns {Promise<void>}
   * @description uarda la 'categoryList' actual en el almacenamiento local.
   */
  private async saveCategoriesToStorage(): Promise<void> {
    await this._storageService.setValue('categories', this.categoryList);
  }
}