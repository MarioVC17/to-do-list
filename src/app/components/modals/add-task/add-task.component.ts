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

  @Input() categoryList: Array<string> = [];

  taskName: string = ''

  selectedCategory: string = '';

  // categories: Array<string> = [];

  constructor(
    private _modalCtrl: ModalController,
    private _storageService: StorageService
  ) { }

  async ngOnInit() {
    // await this.loadCategories();
  }

  closeModal() {
    this._modalCtrl.dismiss();
  }

  saveTask() {
    if(this.taskName.trim()) {
      const newTask: { name: string; status: boolean, categorie: string } = { name: this.taskName, status: false, categorie: this.selectedCategory };
      this.saveNewTask(newTask);
      this._modalCtrl.dismiss(null, 'saved');
    }
  }

  private async saveNewTask(task: { name: string; status: boolean, categorie: string }) {
    const storedTasks = await this._storageService.getValue('tasks');
    let taskList: { name: string; status: boolean, categorie: string }[] = storedTasks ? JSON.parse(storedTasks) : [];
    taskList.push(task);
    await this._storageService.setValue('tasks', taskList);
  }

  // private async loadCategories() {
  //   const storedCategories = await this._storageService.getValue('categories');
  //   if (storedCategories) {
  //     this.categories = JSON.parse(storedCategories);
  //   } else {
  //     this.categories = [];
  //   }
  // }

}
