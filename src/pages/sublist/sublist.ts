import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
import { TodoItem, TodoList } from '../../models/model'
import { Component } from '@angular/core';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service'

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
    public popoverCtrl: PopoverController
  ) { }

  ngOnInit() {
    this.todoList = this.params.get('todoList');
  }

  subscribeToList(todoList: TodoList) {
    this.service.getTodosList().subscribe(list => {
      this.todoList = list.find(todo => todo.uuid === this.todoList.uuid);
    });
  }

  newItem(name: string, desc: string): TodoItem {
    const todoItem: TodoItem = {
      uuid: null,
      name: name,
      desc: desc,
      complete: false
    }

    return todoItem;
  }

  goBack() {
    this.navCtrl.pop();
  }

  presentSubMenu() {
    //<upload-images [item]="getTodoList()"></upload-images>

    let popover = this.popoverCtrl.create("");
    popover.present();
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
            this.service.addItem(this.todoList, this.newItem(data.name, data.desc));
            this.subscribeToList(this.todoList);
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
    this.subscribeToList(this.todoList);
  }

  getItems(): TodoItem[] {
    return this.todoList.items;
  }

  getTodoList(): TodoList {
    return this.todoList;
  }
}
