import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { ToastController } from 'ionic-angular';
import * as firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})

export class AuthPage {
  displayName;

  constructor(
    public authService: AuthServiceProvider,
    public afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController
  ) {
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;
        return;
      }

      this.displayName = user.displayName;
      console.log(this.displayName);
    });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider)
      .then(() => {
        this.authService.login();
        this.navCtrl.setRoot(HomePage);
      }).catch(() => {
        this.failToConnectMessage();
      });
  }

  async userLogin(email, password) {
    if (!email || !password) {
      this.failToConnectMessage();
      return;
    }

    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        this.authService.login();
        this.navCtrl.setRoot(HomePage);
      })
      .catch(() => {
        this.failToConnectMessage();
      });
  }

  isAuthenticated() {
    return this.authService.authenticated();
  }

  failToConnectMessage() {
    let toast = this.toastCtrl.create({
      message: 'Bad email or password',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Fail to connect');
    });

    toast.present();
  }
}
