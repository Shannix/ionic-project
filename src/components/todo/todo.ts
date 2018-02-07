import { Component } from '@angular/core';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service'
import { TodoList } from '../../models/model'
import { ModalController, AlertController } from 'ionic-angular';
import { SublistPage } from '../../pages/sublist/sublist';
import { AngularFireDatabase } from 'angularfire2/database';
/**
 * Generated class for the TodoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'todo-comp',
  templateUrl: 'todo.html'
})
export class TodoComponent {

  private todosList: TodoList[];
  arrayData = [];

  constructor(
    public modalCtrl: ModalController,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController,
    public service: TodoServiceProvider,
    public DB: AngularFireDatabase
  ) {
    //this.DB.list('/data/').subscribe(data => { this.arrayData = data; });
    //alert(this.arrayData);
  }

  ngOnInit() {
    this.todoServiceProvider.getList().subscribe(res => {
      this.todosList = res;
    });
  }


  initTodo(name: string) {
    const todo: TodoList = {
      uuid: null,
      name: name,
      items: []
    }

    return todo
  }

  todoIsCompleted(todo: TodoList) {
    if (todo.items.length === 0) {
      return false;
    }

    let uncompleted = todo.items.find(item => item.complete === false);
    return !uncompleted;
  }

  addTodo() {
    let prompt = this.alertCtrl.create({
      title: 'Create a new todo',
      message: "Enter a name for this new todo",
      inputs: [
        {
          name: 'name',
          placeholder: 'Your todo name'
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
            this.service.addTodoList(this.initTodo(data.name));
          }
        }
      ]
    });

    prompt.present();
  }

  presentTodoModal(todo: TodoList) {
    let todoModal = this.modalCtrl.create(
      SublistPage, { uuid: todo.uuid, name: todo.name }
    );
    todoModal.onDidDismiss(data => {
      console.log(data);
    });
    todoModal.present();
  }

  deleteTodoList(todo: TodoList) {
    this.presentConfirm(todo);
  }

  presentConfirm(todo: TodoList) {
    let alert = this.alertCtrl.create({
      title: 'Confirm remove',
      message: `Do you want to remove the ${todo.name} ?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Validate',
          handler: () => {
            this.service.deleteTodoList(todo.uuid);
          }
        }
      ]
    });

    alert.present();
  }

}
