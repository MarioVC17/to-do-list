import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonItem, IonLabel, IonButton, IonInput, IonSelect, IonSelectOption, ModalController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    FormsModule,
    IonSelect,
    IonSelectOption
  ]
})
export class AddTaskComponent  implements OnInit {

  /**
   * @property categoryList
   * @type {Array<string>}
   * @description Array de categorías que se pasa desde el componente padre (TaskListComponent)
   * para que el usuario pueda seleccionar una al crear la tarea.
   */
  @Input() categoryList: Array<string> = [];

  /**
   * @property taskName
   * @type {string}
   * @description Modelo para el input del nombre de la tarea. Almacena el texto ingresado por el usuario.
   */
  public taskName: string = ''

  /**
   * @property selectedCategory
   * @type {string}
   * @description Modelo para el select de la categoría. Almacena la categoría seleccionada por el usuario para la nueva tarea.
   */
  public selectedCategory: string = '';

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
   * @method closeModal
   * @returns {void}
   * @description Cierra el modal sin guardar la tarea. Llama al método 'dismiss' del ModalController.
   */
  public closeModal(): void {
    this._modalCtrl.dismiss();
  }

  /**
   * @method saveNewTask
   * @returns {void}
   * @description Guarda la nueva tarea si el nombre no está vacío y luego cierra el modal
   * con el rol 'saved' para indicar que se guardó la tarea.
   */
  public saveNewTask(): void {
    if(this.taskName.trim()) {
      const newTask: { name: string; status: boolean, categorie: string } = { name: this.taskName, status: false, categorie: this.selectedCategory };
      this.saveTaskToStorage(newTask);
      this._modalCtrl.dismiss(null, 'saved');
    }
  }

  /**
   * @private
   * @async
   * @method saveTaskToStorage
   * @param {} task Objeto que representa la nueva tarea a guardar.
   * @returns {Promise<void>}
   * @description Guarda la nueva tarea en el almacenamiento local. Recupera la lista de tareas existente,
   * agrega la nueva tarea y guarda la lista actualizada.
   */
  private async saveTaskToStorage(task: { name: string; status: boolean, categorie: string }): Promise<void> {
    const storedTasks = await this._storageService.getValue('tasks');
    let taskList: { name: string; status: boolean, categorie: string }[] = storedTasks ? JSON.parse(storedTasks) : [];
    taskList.push(task);
    await this._storageService.setValue('tasks', taskList);
  }
}