import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SublistPage } from './sublist';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SublistPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(SublistPage),
  ],
  exports: [
    SublistPage
  ]
})
export class SublistPageModule { }
