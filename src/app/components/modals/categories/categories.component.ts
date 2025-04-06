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

  @Input() categoryList: Array<string> = [];  

  // public categoryList: Array<string> = ['Urgente', 'Normal', 'No urgente'];

  public newCategoryName: string = '';

  public editingCategoryIndex: number | null = null;

  constructor(
    private _modalCtrl: ModalController,
    private _storageService: StorageService
  ) { }

  ngOnInit() {
    // this.loadCategories();
  }

  closeModal() {
    this._modalCtrl.dismiss();
  }

  public closeModalWithSave() {
    this._modalCtrl.dismiss({ updatedCategories: this.categoryList }, 'saved');
  }

  public async addCategory() {
    if (this.newCategoryName.trim() !== '') {
      this.categoryList.push(this.newCategoryName.trim());
      await this.saveCategorie();
      this.newCategoryName = '';
    }
  }

  public startEditCategory(index: number) {
    this.editingCategoryIndex = index;
  }

  public async saveEditedCategory() {
    this.editingCategoryIndex = null;
    await this.saveCategorie();
  }

  public async deleteCategory(index: number) {
    this.categoryList.splice(index, 1);
    await this.saveCategorie();
  }

  // private async loadCategories() {
  //   const storedCategories = await this._storageService.getValue('categories');
  //   if(storedCategories) this.categoryList = JSON.parse(storedCategories);
  // }

  private async saveCategorie() {
    await this._storageService.setValue('categories', this.categoryList);
  }
}
