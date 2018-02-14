import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoItem, TodoList } from "../../models/model";
import { Observable } from "rxjs/Observable";
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import 'rxjs/Rx';
/*
  Generated class for the TodoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TodoServiceProvider {

  private basePath: string = '/TodoList/';
  private todosList: FirebaseObjectObservable<TodoList>;
  private todoObject: FirebaseListObservable<TodoList>;

  constructor(public DB: AngularFireDatabase) { }

  public getList(): Observable<TodoList[]> {
    return this.DB.list(this.basePath, ref => ref.orderByChild('name')).snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }
  public addTodoList(newTodoList: TodoList) {
    return this.DB.list(this.basePath).push(newTodoList);
  }

  public UpdateTodoList(id: string, upTodo: TodoList) {
    return this.DB.list(this.basePath).update(id, upTodo);
  }

  public deleteTodoList(id: string) {
    const promise = this.DB.list(this.basePath).remove(id);
    promise.then(_ => console.log('success'))
      .catch(err => console.log(err, 'You do not have access!'));
  }

  /*
    public getTodos(name: string) {
      let item = this.getList().find(d => d.name === 'a1');
      return item.items;
    }
  */
  public deleteEverything() {
    const promise = this.DB.list(this.basePath).remove();
    promise.then(_ => console.log('success'))
      .catch(err => console.log(err, 'You do not have access!'));
  }

}
