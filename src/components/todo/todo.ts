import { Component } from '@angular/core';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service'
import { TodoList } from '../../models/model'
import { ModalController, AlertController } from 'ionic-angular';
import { SublistPage } from '../../pages/sublist/sublist';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'todo-comp',
  templateUrl: 'todo.html'
})
export class TodoComponent {
  private todosList;
  private email: string = "none";

  constructor(
    public modalCtrl: ModalController,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController,
    public service: TodoServiceProvider,
    public authFire: AngularFireAuth
  ) { }

  ngOnInit() {
    this.authFire.authState.subscribe(data => {
      if (data) {
        this.email = data.email.replace(/\./g, '%');
        this.service.getTodosList(data.email.replace(/\./g, '%')).subscribe(list => {
          this.todosList = list;
          console.log("todolist", list);
        });
      }
    });
  }


  getTodosList() {
    return this.todosList;
  }

  deleteTodoList(todo: TodoList) {
    this.service.deleteTodoList(todo);
  }

  newTodoList(name: string) {
    const todo: TodoList = {
      uuid: null,
      name: name,
      items: []
    }
    todo.authorization = {};
    todo.authorization[this.email] = true;
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
          text: 'Share',
          handler: data => {
            this.service.addTodoList(this.newTodoList(data.name));
          }
        }
      ]
    });
    prompt.present();
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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
          handler: data => {
            if (this.validateEmail(data.name)) {
              this.service.updateAuthorization(todoList, data.name);
            } else {
              alert("Email invalid!")
            }

          }
        }
      ]
    });
    prompt.present();
  }


  displayItemsManager(todoList: TodoList) {
    console.log(todoList);

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
}
