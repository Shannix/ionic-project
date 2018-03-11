import { NgModule } from '@angular/core';
import { TodoComponent } from './todo/todo';
import { UploadImagesComponent } from './upload-images/upload-images';

@NgModule({
  declarations: [
    TodoComponent,
    UploadImagesComponent
  ],
  imports: [],
  exports: [
    TodoComponent,
    UploadImagesComponent
  ]
})
export class ComponentsModule { }
