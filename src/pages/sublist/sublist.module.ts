import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SublistPage } from './sublist';

@NgModule({
  declarations: [
    SublistPage,
  ],
  imports: [
    IonicPageModule.forChild(SublistPage),
  ],
})
export class SublistPageModule {}
