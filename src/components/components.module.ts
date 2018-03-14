import { NgModule } from '@angular/core';
import { TodoComponent } from './todo/todo';
import { UploadImagesComponent } from './upload-images/upload-images';
import { IonicModule } from 'ionic-angular';

@NgModule({
  declarations: [
    TodoComponent,
    UploadImagesComponent
  ],
  imports: [
    IonicModule
  ],
  exports: [
    TodoComponent,
    UploadImagesComponent
  ]
})
export class ComponentsModule { }
