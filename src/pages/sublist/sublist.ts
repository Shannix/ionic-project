import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { TodoItem } from '../../models/model'
import { TodoServiceProvider } from '../../providers/todo-service/todo-service'
import { HomePage } from '../home/home';
/**
 * Generated class for the SublistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sublist',
  templateUrl: 'sublist.html',
})
export class SublistPage {
  private todoName: String;
  private todoUuid: String;
  private todoItems: TodoItem[];

  myColor: string = 'dark';
  constructor(
    public service: TodoServiceProvider,
    public params: NavParams,
    public alertCtrl: AlertController,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.todoUuid = this.params.get('uuid');
    this.todoName = this.params.get('name');

    this.service.getTodos(this.todoUuid).subscribe(res => {
      this.todoItems = res;
    });
  }


  initItem(name: string, desc: string) {
    const item: TodoItem = {
      uuid: null,
      name: name,
      desc: desc,
      complete: false
    }

    return item
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
            this.service.addTodo(
              this.todoUuid,
              this.initItem(data.name, data.desc)
            );
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

            this.service.editTodo(this.todoUuid, item);
          }
        }
      ]
    });


    prompt.present();
  }

  deleteItem(item: TodoItem) {
    this.service.deleteTodo(this.todoUuid, item.uuid);
  }

}
