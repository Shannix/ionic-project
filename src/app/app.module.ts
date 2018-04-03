import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { FIREBASE_CONFIG } from './firebase.config';

import { MyApp } from './app.component';

import { HomePageModule } from '../pages/home/home.module';
import { AuthPageModule } from '../pages/auth/auth.module';
import { SublistPageModule } from '../pages/sublist/sublist.module';
import { ManageUsersPageModule } from '../pages/manage-users/manage-users.module';
import { NewItemPageModule } from '../pages/new-item/new-item.module';
import { ComponentsModule } from '../components/components.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { GooglePlus } from '@ionic-native/google-plus';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { TodoServiceProvider } from '../providers/todo-service/todo-service';
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserModule,
    ComponentsModule,
    HomePageModule,
    AuthPageModule,
    SublistPageModule,
    ManageUsersPageModule,
    NewItemPageModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    AuthServiceProvider,
    Camera,
    GooglePlus,
    StatusBar,
    SplashScreen,
    TodoServiceProvider,
    LocalNotifications,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
