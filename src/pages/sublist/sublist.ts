import {
  AlertController,
  IonicPage,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
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
  private email: string;

  constructor(
    public service: TodoServiceProvider,
    public params: NavParams,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public authFire: AngularFireAuth
  ) { }

  ngOnInit() {
    this.todoList = this.params.get('todoList');
  }

  subscribeToList(todoList: TodoList) {
    this.authFire.authState.subscribe(data => {
      this.service.getTodosList(data.email).subscribe(list => {
        this.todoList = list.find(todo => todo.uuid === this.todoList.uuid);
      });

      this.email = data.email;
    });
  }

  newItem(name: string, desc: string, expire: string): TodoItem {
    const todoItem: TodoItem = {
      uuid: null,
      name: name,
      desc: desc,
      complete: false,
      priority: null,
      date: expire
    }

    return todoItem;
  }

  getlimit(date: string) {
    var date1 = new Date();
    var date2 = new Date(date);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (diffDays > 7) return 1;
    if (diffDays == 6) return 10;
    if (diffDays == 5) return 20;
    if (diffDays == 4) return 40;
    if (diffDays == 3) return 60;
    if (diffDays == 2) return 80;
    if (diffDays == 1) return 100;

  }

  goBack() {
    this.navCtrl.pop();
  }

  presentSubMenu() {
    //<upload-images [todoList]="getTodoList()"></upload-images>

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
        }, {
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
            item.name = data.name;
            item.desc = data.desc;
            item.date = data.expire;

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
    return this.todoList.items
  }

  getTodoList(): TodoList {
    return this.todoList;
  }

  reorderItems(indexes) {
    this.service.setItemPriority(this.todoList, indexes);
  }
}
