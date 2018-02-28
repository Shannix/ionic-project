import { Component } from '@angular/core';
import { TodoServiceProvider } from '../../providers/todo-service/todo-service'
import { TodoList } from '../../models/model'
import { ModalController, AlertController } from 'ionic-angular';
import { SublistPage } from '../../pages/sublist/sublist';
import { FirebaseObjectObservable } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'todo-comp',
  templateUrl: 'todo.html'
})
export class TodoComponent {
  private todosList: FirebaseObjectObservable<TodoList>;
  private email: string = "none";
  constructor(
    public modalCtrl: ModalController,
    public todoServiceProvider: TodoServiceProvider,
    public alertCtrl: AlertController,
    public service: TodoServiceProvider,
    public authFire: AngularFireAuth
  ) { }

  ngOnInit() {
    this.service.getList().subscribe(list => {
      this.todosList = list;
      console.log("todolist", this.todosList);
    });
    this.authFire.authState.subscribe(data => {
      if (data) { this.email = data.email; }
    });
  }

  deleteTodoList(todo: TodoList) {
    this.service.deleteTodoList(todo);
  }

  newTodoList(name: string) {
    const todo: TodoList = {
      email: this.email,
      uuid: null,
      name: name,
      items: []
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

  displayItemsManager(todoList: TodoList) {
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
