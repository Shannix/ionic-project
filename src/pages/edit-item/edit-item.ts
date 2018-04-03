import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service';
import { TodoItem, TodoList } from '../../models/model';


@IonicPage()
@Component({
  selector: 'page-edit-item',
  templateUrl: 'edit-item.html',
})
export class EditItemPage {
  public todoList: TodoList;
  public item: TodoItem;
  public name;
  public desc;
  public expire;

  constructor(public service: TodoServiceProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ngOnInit() {
    const getitem = this.navParams.get('item');
    const gettodo = this.navParams.get('todo');
    this.item = getitem;
    this.todoList = gettodo;
    this.name= this.item.name;
    this.desc= this.item.desc;
    this.expire= this.item.dateExpire;
  }

  goBack() {
    this.navCtrl.pop();
  }

  getItem() {
    return this.item;
  }

  editItem() {
      this.item.name = this.name;
      this.item.desc = this.desc;
      this.item.dateExpire = this.expire;
      this.service.updateTodoItem(this.todoList, this.item);
      this.navCtrl.pop();
  }


}
