import { Component } from '@angular/core';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service'
import { TodoList } from '../../models/model'
import { ModalController, AlertController } from 'ionic-angular';
import { SublistPage } from '../../pages/sublist/sublist';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'todos-list',
  templateUrl: 'todo.html'
})

export class TodoComponent {
  private todosList;
  private email: string;

  constructor(
    public modalCtrl: ModalController,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController,
    public service: TodoServiceProvider,
    public authFire: AngularFireAuth
  ) {
  }

  ngOnInit() {
    this.subscribeToTodosList();
  }

  subscribeToTodosList() {
    this.authFire.authState.subscribe(data => {
      this.service.getTodosList(data.email).subscribe(list => {
        this.todosList = list;
      });

      this.email = data.email;
    });
  }

  getTodosList() {
    return this.todosList;
  }

  deleteTodoList(todo: TodoList) {
    let alert = this.alertCtrl.create({
      title: todo.name,
      message: "Do you want to delete this todo ?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Accept',
          handler: () => {
            this.service.deleteTodoList(todo);
          }
        }
      ]
    });
    alert.present();
  }

  newTodoList(name: string): TodoList {
    const authorization = {};
    authorization[this.email.replace(/\./g, "%")] = this.email;

    const todo: TodoList = {
      uuid: null,
      name: name,
      color: 'grey',
      items: [],
      image: null,
      priority: null,
      authorization: authorization
    }

    return todo;
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
            this.service.addTodoList(this.newTodoList(data.name));
          }
        }
      ]
    });
    prompt.present();
  }

  getColor(todo) {
    return todo.color;
  }
  setColor(todo: TodoList, color: string) {
    this.service.setTodoListColor(todo, color);
  }

  validateEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  displayShareManager(todoList: TodoList) {
    let prompt = this.alertCtrl.create({
      title: 'Share this todo',
      message: "Enter a valid email to share this todo",
      inputs: [
        {
          name: 'name',
          placeholder: 'new email'
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
          text: 'Share',
          handler: email => {
            if (this.validateEmail(email.name)) {
              this.service.addAuthorisationToTodoList(todoList, email.name);
            } else {
              alert("Email invalid!")
            }
          }
        }
      ]
    });
    prompt.present();
  }

  displayItemsMonitoring(todoList: TodoList) {

    let todoModal = this.modalCtrl.create(
      SublistPage, { todoList: todoList }
    );
    todoModal.onDidDismiss(data => {
      console.log(data);
    });

    todoModal.present();
  }

  todoIsCompleted(todo: TodoList) {
    if (todo.items.length === 0) { return false; }

    let uncompleted = todo.items.find(item => item.complete === false);
    return !uncompleted;
  }

  reorderTodosList(indexes) {
    this.service.setTodosListPriority(this.todosList, indexes);
  }

  countSharedUsers(todo: TodoList) {
    return Object.keys(todo.authorization).length;
  }

  countItemsChecked(todo: TodoList) {
    return todo.items.filter(item => item.complete === true).length;
  }
}
