import { Injectable } from '@angular/core';
import { TodoList } from "../../models/model";
import { Observable } from "rxjs/Observable";
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class TodoServiceProvider {
  private basePath: string = '/TodoList/';
  private email: string = 'none';

  constructor(public DB: AngularFireDatabase, public authFire: AngularFireAuth) {
    this.authFire.authState.subscribe(data => {
      if (data) { this.email = data.email; }
    });
  }

  public getList(): Observable<TodoList[]> {
    return this.DB.list(this.basePath, ref => ref.orderByChild('email').equalTo(this.email))
      //  return this.DB.list(this.basePath, ref => ref.orderByChild('email2').startAt('derradji2993@gmail.com'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          uuid: c.payload.key,
          items: [],
          ...c.payload.val()
        }));
      });
  }

  public addTodoList(newTodoList: TodoList) {
    return this.DB.list(this.basePath).push(newTodoList);
  }

  public UpdateTodoList(todoList: TodoList) {
    this.DB.list(this.basePath).update(
      todoList.uuid, todoList
    );
  }

  public deleteTodoList(todo: TodoList) {
    const promise = this.DB.list(this.basePath).remove(todo.uuid);
    promise.then(_ => console.log('success'))
      .catch(err => console.log(err, 'fail!'));
  }
}
