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

@IonicPage()
@Component({
  selector: 'page-sublist',
  templateUrl: 'sublist.html',
})

export class SublistPage {
  private todoList: TodoList;

  constructor(
    public service: TodoServiceProvider,
    public params: NavParams,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public authFire: AngularFireAuth,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
    const todo = this.params.get('todoList');
    this.todoList = todo;
    this.subscribeToList(todo);
  }

  subscribeToList(todoList: TodoList) {
    this.authFire.authState.subscribe(data => {
      this.service.getTodosList(data.email).subscribe(list => {
        this.todoList = list.find(todo => todo.uuid === this.todoList.uuid);
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

  getTimeUsed(item: TodoItem): number {
    const dateToday = new Date().getTime();
    const dateCreate = new Date(item.dateCreate).getTime();
    const dateExpire = new Date(item.dateExpire).getTime();

    const givenTime = Math.ceil((dateExpire - dateCreate) / 86400000);
    const leftTime = Math.ceil((dateExpire - dateToday) / 86400000);
    const timeUsed = givenTime - leftTime;

    if (givenTime <= 0 || leftTime <= 0) {
      return 100;
    } else {
      return (timeUsed / givenTime) * 100 << 0;
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  manageUser() {
    let profileModal = this.modalCtrl.create(ManageUsersPage, { todoList: this.todoList });
    profileModal.present();
  }

  addItem() {
    let prompt = this.alertCtrl.create({
      title: 'Create item',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: "Item name",
        },
        {
          name: 'desc',
          type: 'text',
          placeholder: 'Write your description'
        },
        {
          name: 'expire',
          type: 'date'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.service.addItem(this.todoList, this.newItem(data.name, data.desc, data.expire));
          }
        }
      ]
    });

    prompt.present();
  }

  editItem(item: TodoItem) {
    let prompt = this.alertCtrl.create({
      title: 'Update item',
      inputs: [
        {
          name: 'name',
          value: item.name,
        },
        {
          name: 'desc',
          value: item.desc,
          placeholder: 'Write your description'
        },
        {
          name: 'expire',
          value: item.dateExpire,
          type: 'date'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            item.name = data.name;
            item.desc = data.desc;
            item.dateExpire = data.expire;
            this.service.updateTodoItem(this.todoList, item);
          }
        }
      ]
    });

    prompt.present();
  }

  onToggleCompletedItem(item: TodoItem) {
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
