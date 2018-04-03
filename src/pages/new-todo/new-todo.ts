import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service';
import { TodoList } from '../../models/model';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-new-todo',
  templateUrl: 'new-todo.html',
})
export class NewTodoPage {
  public name = "";
  private email: string;
  private authorization = {};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public service: TodoServiceProvider,
    public authFire: AngularFireAuth) {
  }

  ngOnInit() {
    this.authFire.authState.subscribe(data => {
      this.email = data.email;
      this.authorization[this.email.replace(/\./g, "%")] = this.email;
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  newTodoList(name: string): TodoList {
    const todo: TodoList = {
      uuid: null,
      name: name,
      color: 'grey',
      items: [],
      images: [],
      priority: null,
      authorization: this.authorization,
      note: null
    }

    return todo;
  }

  addTodo() {
    if (this.name != "") {
      this.service.addTodoList(this.newTodoList(this.name));
      this.navCtrl.pop();
    } else {
      alert("Enter a valid name")
    }
  }


}
