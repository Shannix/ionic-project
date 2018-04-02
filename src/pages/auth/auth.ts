import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { ToastController, Platform } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
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
    private toastCtrl: ToastController,
    private googlePlus: GooglePlus,
    public plt: Platform
  ) {
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;
        return;
      }

      this.displayName = user.displayName;
    });
  }

  googlePluslogin() {
    this.googlePlus.login({
      'webClientId': '741641947952-5buo9i5j3ed1p6clisa3peo5tp8to4j3.apps.googleusercontent.com',
      'offline': true,
    })
      .then(res => {
        const credential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        this.afAuth.auth.signInWithCredential(credential).then(() => {
          this.authService.login();
          this.navCtrl.setRoot(HomePage);
        });
      }).catch(() => {
        this.failToConnectMessage();
      });
  }

  google() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider)
      .then(() => {
        this.authService.login();
        this.navCtrl.setRoot(HomePage);
      }).catch(() => {
        this.failToConnectMessage();
      });
  }

  googleLogin() {
    if (this.plt.is('ios') || this.plt.is('android')) {
      this.googlePluslogin();
    } else {
      this.google();
    }
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
