import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service'
import { HomePage } from '../pages/home/home';
import { AuthPage } from '../pages/auth/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { GooglePlus } from '@ionic-native/google-plus';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public authService: AuthServiceProvider,
    public AuthFire: AngularFireAuth,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private googlePlus: GooglePlus
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


  googlePluslogout() {
    this.googlePlus.logout()
      .then(res => {
        this.AuthFire.auth.signOut();
        this.nav.setRoot(AuthPage);
      })
      .catch(err => {
        this.AuthFire.auth.signOut();
        this.nav.setRoot(AuthPage);
      });
  }

  googleLogout() {
    this.authService.logout();
    this.AuthFire.auth.signOut();
    this.nav.setRoot(AuthPage);
  }

  logout() {
    if (this.platform.is('ios') || this.platform.is('android')) {
      this.googlePluslogout();
    } else {
      this.googleLogout();
    }
  }
}
