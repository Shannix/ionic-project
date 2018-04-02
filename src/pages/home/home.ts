import { AngularFireAuth } from 'angularfire2/auth';
import { AuthPage } from '../auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(
    public AuthFire: AngularFireAuth,
    public navCtrl: NavController,
    private localNotifications: LocalNotifications) { }

  ngOnInit() {
    this.AuthFire.authState.subscribe(data => {
      if (!data) {
        this.navCtrl.setRoot(AuthPage);
      }
    });
  }




}
