import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthPage } from '../pages/auth/auth';
import { SublistPage } from '../pages/sublist/sublist';
import { TodoComponent } from '../components/todo/todo';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { TodoServiceProvider } from '../providers/todo-service/todo-service';


const firebaseConfig = {
  apiKey: "AIzaSyCeeLRPi_bSSouxqODE-VdvxUUQaiixtbo",
  authDomain: "ionic-project-4327c.firebaseapp.com",
  databaseURL: "https://ionic-project-4327c.firebaseio.com",
  projectId: "ionic-project-4327c",
  storageBucket: "ionic-project-4327c.appspot.com",
  messagingSenderId: "741641947952"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AuthPage,
    SublistPage,
    TodoComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpClientModule,
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
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthServiceProvider,
    TodoServiceProvider
  ]
})
export class AppModule { }
