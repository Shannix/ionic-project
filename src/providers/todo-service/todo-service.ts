import { Injectable } from '@angular/core';
import { TodoList, TodoItem, ImageItem } from "../../models/model";
import { Observable } from "rxjs/Observable";
import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase';

import 'rxjs/Rx';

@Injectable()
export class TodoServiceProvider {
  private basePath: string = '/TodoList';

  constructor(public DB: AngularFireDatabase) { }

  public getTodosList(): Observable<TodoList[]> {
    return this.todoListPresenter(
      this.DB.list<TodoList>(this.basePath).snapshotChanges()
    );
  }

  public addTodoList(newTodoList: TodoList) {
    this.DB.list(this.basePath).push(newTodoList);
  }

  public addItem(todoList: TodoList, newtodoItem: TodoItem) {
    this.DB.list(`${this.basePath}/${todoList.uuid}/items`).push(newtodoItem);
  }

  public addImageToTodoList(todoList: TodoList, image: ImageItem) {
    this.DB.object(`${this.basePath}/${todoList.uuid}/image`).set(image);
  }

  public updateTodoItem(todoList: TodoList, todoItem: TodoItem) {
    this.DB.list(`${this.basePath}/${todoList.uuid}/items`).update(
      todoItem.uuid, todoItem
    );
  }

  public updateTodosListPriority(todosList: TodoList[], indexes) {
    todosList = this.reoderList(todosList, indexes);

    for (let i = 0; i < todosList.length; i++) {
      this.DB.object(`${this.basePath}/${todosList[i].uuid}/priority`).set(i);
    }
  }

  public updateItemPriority(todoList: TodoList, indexes) {
    let todoItems = todoList.items;
    todoItems = this.reoderList(todoItems, indexes);

    for (let i = 0; i < todoItems.length; i++) {
      this.DB.object(
        `${this.basePath}/${todoList.uuid}/items/${todoItems[i].uuid}/priority`
      ).set(i);
    }
  }

  public deleteItem(todoList: TodoList, todoItem: TodoItem) {
    this.DB.list(`${this.basePath}/${todoList.uuid}/items`).remove(todoItem.uuid);
  }

  public deleteTodoList(todo: TodoList) {
    const promise = this.DB.list(this.basePath).remove(todo.uuid);
    promise.then(_ => console.log('success'))
      .catch(err => console.log(err, 'fail!'));

    //Remove image from firebase bucket
    todo.image && this.deleteImageIntoBucket(todo.image);
  }

  private deleteImageIntoBucket(image: ImageItem) {
    var desertRef = storage().ref().child(image.bucketLocation);

    desertRef.delete()
      .then(function() {
        console.log('Delete with success');
      })
      .catch(function(error) {
        console.log(error, 'Delete fail!');
      });
  }

  private orderByPriority(list: any[]): any[] {
    return list.sort(function(listA, listB) {
      return listA.priority - listB.priority;
    });
  }

  private todoListPresenter(todoList): Observable<TodoList[]> {
    return todoList.map(changes => {
      return this.orderByPriority(
        changes.map(c => ({
          uuid: c.payload.key,
          ...c.payload.val(),
          items: this.itemsPresenter(c.payload.val().items)
        }))
      )
    })
  }

  private itemsPresenter(items): TodoItem[] {
    if (!items) { return []; }

    return this.orderByPriority(
      Object.keys(items).map(function(key) {
        const item = items[key];
        return {
          uuid: key,
          ...item
        };
      })
    );
  }

  private reoderList(list: any[], indexes): any[] {
    let element = list[indexes.from];
    list.splice(indexes.from, 1);
    list.splice(indexes.to, 0, element);

    return list;
  }
}
