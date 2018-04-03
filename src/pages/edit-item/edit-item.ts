import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service';
import { TodoItem, TodoList } from '../../models/model';

/**
 * Generated class for the EditItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-item',
  templateUrl: 'edit-item.html',
})
export class EditItemPage {
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
    this.item = getitem;
    console.log(this.item);
  }

  goBack() {
    this.navCtrl.pop();
  }

  getItem() {
    return this.item;
  }

  editItem(item: TodoItem) {
    //  item.name = data.name;
    //  item.desc = data.desc;
    //  item.dateExpire = data.expire;
    //  this.service.updateTodoItem(this.todoList, item);
    this.navCtrl.pop();
  }


}
