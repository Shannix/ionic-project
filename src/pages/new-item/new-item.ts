import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service';
import { TodoItem, TodoList } from '../../models/model';
@IonicPage()
@Component({
  selector: 'page-new-item',
  templateUrl: 'new-item.html',
})
export class NewItemPage {
  private todoList: TodoList;
  public name = "";
  public desc = "";
  public expire = "";

  constructor(
    public service: TodoServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ngOnInit() {
    const todo = this.navParams.get('todoList');
    this.todoList = todo;
  }

  newItem(name: string, desc: string, expire: string): TodoItem {
    const todoItem: TodoItem = {
      uuid: null,
      name: name,
      desc: desc,
      complete: false,
      priority: null,
      dateCreate: new Date().toString(),
      dateExpire: expire
    }
    return todoItem;
  }

  goBack() {
    this.navCtrl.pop();
  }

  addItem() {
    if (this.name != "") {
      this.service.addItem(this.todoList, this.newItem(this.name, this.desc, this.expire));
      this.navCtrl.pop();
    } else {
      alert("Enter a valid name")
    }

  }





}
