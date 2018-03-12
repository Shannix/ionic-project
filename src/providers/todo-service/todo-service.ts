import { Injectable } from '@angular/core';
import { TodoList, TodoItem } from "../../models/model";
import { Observable } from "rxjs/Observable";
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class TodoServiceProvider {
  private basePath: string = '/TodoList';

  constructor(public DB: AngularFireDatabase, public authFire: AngularFireAuth) { }


  public getTodosList(email: string): Observable<TodoList[]> {
    return this.todoListPresenter(
      this.DB.list(this.basePath, ref => ref.orderByChild('authorization/' + email).equalTo(true))
        .snapshotChanges());
  }

  public addTodoList(newTodoList: TodoList) {
    this.DB.list(this.basePath).push(newTodoList);
  }

  public addItem(todoList: TodoList, newtodoItem: TodoItem) {
    this.DB.list(`${this.basePath}/${todoList.uuid}/items`).push(newtodoItem);
  }

  public updateAuthorization(todoList: TodoList, email: string) {
    todoList.authorization[email.replace(/\./g, '%')] = true;
    this.UpdateTodoList(todoList);
  }

  public UpdateTodoList(todoList: TodoList) {
    this.DB.list(this.basePath).update(
      todoList.uuid, todoList
    );
  }

  public UpdateTodoItem(todoList: TodoList, todoItem: TodoItem) {
    this.DB.list(`${this.basePath}/${todoList.uuid}/items`).update(
      todoItem.uuid, todoItem
    );
  }

  public deleteItem(todoList: TodoList, todoItem: TodoItem) {
    this.DB.list(`${this.basePath}/${todoList.uuid}/items`).remove(todoItem.uuid);
  }

  public deleteTodoList(todo: TodoList) {
    const promise = this.DB.list(this.basePath).remove(todo.uuid);
    promise.then(_ => console.log('success'))
      .catch(err => console.log(err, 'fail!'));
  }

  private test(todoList) {
    console.log(todoList);
    return todoList.map(changes => {
      return changes.map(c => ({
        uuid: c.payload.key,
        ...c.payload.val()
      }));
    });
  }

  private todoListPresenter(todoList) {
    return todoList.map(changes => {
      return changes.map(c => ({
        uuid: c.payload.key,
        ...c.payload.val(),
        items: this.itemsPresenter(c.payload.val().items)
      }));
    });
  }

  public itemsPresenter(items) {
    if (!items) { return []; }

    return Object.keys(items).map(function(key) {
      const item = items[key];
      return {
        uuid: key,
        ...item
      };
    });
  }
}
