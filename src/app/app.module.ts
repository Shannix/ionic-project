import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ProgressBarModule } from "angular-progress-bar";
import { FIREBASE_CONFIG } from './firebase.config';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthPage } from '../pages/auth/auth';
import { SublistPage } from '../pages/sublist/sublist';
import { TodoComponent } from '../components/todo/todo';
import { UploadImagesComponent } from '../components/upload-images/upload-images';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { TodoServiceProvider } from '../providers/todo-service/todo-service';
import { ImageServiceProvider } from '../providers/image-service/image-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AuthPage,
    SublistPage,
    TodoComponent,
    UploadImagesComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule,
    ProgressBarModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AuthPage,
    SublistPage
  ],
  providers: [
    AuthServiceProvider,
    Camera,
    StatusBar,
    SplashScreen,
    TodoServiceProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ImageServiceProvider,
  ]
})
export class AppModule { }
