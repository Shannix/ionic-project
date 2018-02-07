import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import * as firebase from 'firebase/app';



@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})

export class AuthPage {
  login = "";
  password = "";

  constructor(public authService: AuthServiceProvider, public AuthFire: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
  }


  loginGoogle() {
    const result = this.AuthFire.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    if (this.AuthFire.authState) {
      this.authService.login();
      this.navCtrl.setRoot(HomePage);
    }
  }

  async loginUser(login, password) {
    const result = this.AuthFire.auth.signInWithEmailAndPassword(login, password);
    if (result) {
      this.authService.login();
      this.navCtrl.setRoot(HomePage);
    }
  }

  isAuthenticated() {
    return this.authService.authenticated();
  }



}
