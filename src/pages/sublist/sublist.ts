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
  private thisTodo: TodoList;

  myColor: string = 'dark';
  constructor(
    public service: TodoServiceProvider,
    public params: NavParams,
    public alertCtrl: AlertController,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
    this.todoName = this.params.get('name');
    this.todoItems = this.params.get('items');
    this.thisTodo = this.params.get('thisTodo');
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

            if (this.thisTodo.items == null) {
              this.thisTodo.items = [this.initItem(data.name, data.desc)];
            } else {
              this.thisTodo.items.push(this.initItem(data.name, data.desc));
            }
            this.service.UpdateTodoList(this.thisTodo.key, this.thisTodo);

          }
        }
      ]
    });

    prompt.present();
  }

  editItem(item: TodoItem, i) {
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

            this.thisTodo.items.splice(i, 1);
            this.thisTodo.items.push(item);
            this.service.UpdateTodoList(this.thisTodo.key, this.thisTodo);
          }
        }
      ]
    });
    prompt.present();
  }

  deleteItem(i) {
    this.thisTodo.items.splice(i, 1);
    this.service.UpdateTodoList(this.thisTodo.key, this.thisTodo);
  }

}
