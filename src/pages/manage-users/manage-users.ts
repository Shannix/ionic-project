import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TodoList } from '../../models/model'


@IonicPage()
@Component({
  selector: 'page-manage-users',
  templateUrl: 'manage-users.html',
})
export class ManageUsersPage {
  public todoList: TodoList;
  constructor(public navCtrl: NavController, public params: NavParams) {
    this.todoList = this.params.get('todoList');
  }

  getUsersEmail() {
    let usersHash = this.todoList.authorization;
    var keys = Object.keys(usersHash);
    return keys.map(function(v) { return usersHash[v]; });
  }

  goBack() {
    this.navCtrl.pop();
  }
}
