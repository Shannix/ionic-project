import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthPage } from '../auth/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public AuthFire: AngularFireAuth) {

  }

  ngOnInit() {
    this.AuthFire.authState.subscribe(data => {
      if (!data) {
        this.navCtrl.setRoot(AuthPage);
      }
    });
  }

}
