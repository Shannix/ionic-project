import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  PopoverController,
  ModalController
} from 'ionic-angular';
import { ManageUsersPage } from '../../pages/manage-users/manage-users'
import { TodoItem, TodoList } from '../../models/model'
import { Component } from '@angular/core';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service';
import { AngularFireAuth } from 'angularfire2/auth';
import { NewItemPage } from '../../pages/new-item/new-item';
import { EditItemPage } from '../../pages/edit-item/edit-item';

@IonicPage()
@Component({
  selector: 'page-sublist',
  templateUrl: 'sublist.html',
})

export class SublistPage {
  public todoList: TodoList;

  constructor(
    public service: TodoServiceProvider,
    public params: NavParams,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public authFire: AngularFireAuth,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    const todo = this.params.get('todoList');
    this.todoList = todo;
    this.subscribeToList(todo);
  }

  subscribeToList(todoList: TodoList) {
    this.authFire.authState.subscribe(data => {
      this.service.getTodosList(data.email).subscribe(list => {
        this.todoList = list.find(todo => {
          if (this.todoList) {
            return todo.uuid === this.todoList.uuid;
          }
          return false;
        });
      });
    });
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

  getLeftDays(item: TodoItem): number {
    const dateToday = new Date().getTime();
    const dateExpire = new Date(item.dateExpire).getTime();

    const leftTime = Math.ceil((dateExpire - dateToday) / 86400000);
    return leftTime < 0 ? 0 : leftTime;
  }

  getTimeUsed(item: TodoItem): number {
    const dateToday = new Date().getTime();
    const dateCreate = new Date(item.dateCreate).getTime();
    const dateExpire = new Date(item.dateExpire).getTime();

    const givenTime = Math.round((dateExpire - dateCreate) / 86400) / 1000;
    const leftTime = Math.round((dateExpire - dateToday) / 86400) / 1000;
    const timeUsed = givenTime - leftTime;

    if (givenTime <= 0 || leftTime <= 0) {
      return 100;
    } else {
      return (timeUsed / givenTime) * 100;
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  manageUser() {
    let profileModal = this.modalCtrl.create(ManageUsersPage, { todoList: this.todoList });
    profileModal.present();
  }

  addItem(todoList: TodoList) {
    let todoModal = this.modalCtrl.create(
      NewItemPage, { todoList: todoList }
    );
    todoModal.onDidDismiss(data => {
      console.log(data);
    });

    todoModal.present();
  }

  editItem(item: TodoItem) {
    let todoModal = this.modalCtrl.create(
      EditItemPage, { item: item, todo: this.todoList }
    );
    todoModal.onDidDismiss(data => {
      console.log(data);
    });

    todoModal.present();

  }

  onToggleCompletedItem(item: TodoItem) {
    item.complete = !item.complete;
    this.service.updateTodoItem(this.todoList, item);
  }

  deleteItem(item: TodoItem) {
    this.service.deleteItem(this.todoList, item);
  }

  getItems(): TodoItem[] {
    return this.todoList.items
  }

  getTodoList(): TodoList {
    return this.todoList;
  }

  reorderItems(indexes) {
    this.service.setItemPriority(this.todoList, indexes);
  }

  setNote(text) {
    this.service.setNote(this.todoList, text);
  }
}
