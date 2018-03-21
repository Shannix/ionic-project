import { AngularFireAuth } from 'angularfire2/auth';
import { AuthPage } from '../auth/auth';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProgressBar } from "angular-progress-bar"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(
    public AuthFire: AngularFireAuth,
    public navCtrl: NavController) { }

  ngOnInit() {
    this.AuthFire.authState.subscribe(data => {
      if (!data) {
        this.navCtrl.setRoot(AuthPage);
      }
    });
  }
}
