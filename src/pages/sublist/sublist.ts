import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TodoItem, TodoList } from '../../models/model'
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
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.todoList = this.params.get('todoList');
  }

  newItem(name: string, desc: string): TodoItem {
    const item: TodoItem = {
      uuid: null,
      name: name,
      desc: desc,
      complete: false
    }

    return item;
  }

  addItem() {
    let prompt = this.alertCtrl.create({
      title: 'Create item',
      inputs: [
        {
          name: 'name',
          placeholder: "Item name",
        },
        {
          name: 'desc',
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
            this.todoList.items.push(this.newItem(data.name, data.desc));
            this.service.UpdateTodoList(this.todoList);
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

            this.service.UpdateTodoList(this.todoList);
          }
        }
      ]
    });

    prompt.present();
  }

  deleteItem(item: TodoItem) {
    this.todoList.items = this.todoList.items.filter(
      currentItem => currentItem.uuid !== item.uuid
    )
    this.service.UpdateTodoList(this.todoList);
  }

  getTodos(): TodoItem[] {
    const todoItems = this.todoList.items;
    return todoItems ? todoItems : [];
  }
}
