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
    IonPopover,
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

  public taskList: Array<{ name: string; status: boolean, categorie: string }> = [];

  public selectedFilterCategory: string = '';

  public filteredTaskList: Array<{ name: string; status: boolean, categorie: string }> = [];

  public categoryList: Array<string> = ['Urgente', 'Normal', 'No urgente'];

  constructor(
    private _storageService: StorageService,
    private _modalCtrl: ModalController
  ) {
    addIcons({
      add,
      trash,
      pricetagOutline,
      returnUpBackOutline,
      createOutline,
      pencilOutline
    });
  }

  async ngOnInit() {
    await this.loadTasks();
    await this.loadCategories();
    this.filterTasks();
  }

  public get pendingTasks(): Array<{ name: string; status: boolean, categorie: string }> {
    return this.filteredTaskList.filter(task => !task.status);
  }

  public get completedTasks(): Array<{ name: string; status: boolean, categorie: string }> {
    return this.filteredTaskList.filter(task => task.status);
  }

  public filterTasks(category?: string) {
    this.selectedFilterCategory = category !== undefined ? category : this.selectedFilterCategory;
    if (!this.selectedFilterCategory) {
      this.filteredTaskList = [...this.taskList]; // Mostrar todas las tareas si no hay filtro seleccionado
    } else {
      this.filteredTaskList = this.taskList.filter(task => task.categorie === this.selectedFilterCategory);
    }
  }

  public async  addTask() {
    const modal = await this._modalCtrl.create({
      component: AddTaskComponent,
      componentProps: {
        'categoryList': this.categoryList
      }
    });
    modal.present();
    const { role } = await modal.onDidDismiss();
    if (role === 'saved') {
      await this.loadTasks();
    }
  }

  public async removeTask(index: number) {
    this.taskList.splice(index, 1);
    await this.saveTask();
  }

  public async updateTaskStatus(task: any) {
    task.status = !task.status;
    await this.saveTask();
  }

  public async openCategoriesModal() {
    const modal = await this._modalCtrl.create({
      component: CategoriesComponent,
      componentProps: {
        'categoryList': this.categoryList
      }
    });
    modal.present();
  }

  private async loadTasks() {
    const storedTasks = await this._storageService.getValue('tasks');
    this.taskList = storedTasks ? JSON.parse(storedTasks) : [];
    this.filterTasks();
  }

  private async saveTask() {
    await this._storageService.setValue('tasks', this.taskList);
  }

  private async loadCategories() {
    const storedCategories = await this._storageService.getValue('categories');
    if (storedCategories) {
      this.categoryList = JSON.parse(storedCategories);
    } else {
      await this.saveCategories(); // Guarda la lista por defecto si no existe
    }
  }

  private async saveCategories() {
    await this._storageService.setValue('categories', this.categoryList);
  }
}
