import { Injectable } from '@angular/core';
import { TodoList, TodoItem, ImageItem } from "../../models/model";
import { Observable } from "rxjs/Observable";
import { AngularFireDatabase } from 'angularfire2/database';
import { storage } from 'firebase';

import 'rxjs/Rx';

@Injectable()
export class TodoServiceProvider {
  private basePath: string = '/todos';

  constructor(public DB: AngularFireDatabase) { }

  public getTodosList(email: string): Observable<TodoList[]> {
    const emailFormated = this.emailToFirebaseFormat(email);

    return this.todoListPresenter(
      this.DB.list(
        this.basePath,
        ref => ref.orderByChild(
          `authorization/${emailFormated}`
        ).equalTo(email)
      ).snapshotChanges()
    );
  }

  public addTodoList(newTodoList: TodoList) {
    this.DB.list(this.basePath).push(newTodoList);
  }

  public addItem(todoList: TodoList, newtodoItem: TodoItem) {
    this.DB.list(`${this.basePath}/${todoList.uuid}/items`).push(newtodoItem);
  }

  public addImageToTodoList(todoList: TodoList, image: ImageItem) {
    this.DB.list(`${this.basePath}/${todoList.uuid}/images`).push(image);
  }

  addAuthorisationToTodoList(todoList: TodoList, email: string) {
    todoList.authorization[email.replace(/\./g, "%")] = email;

    this.DB.object(
      `${this.basePath}/${todoList.uuid}/authorization`
    ).set(todoList.authorization);
  }

  public updateTodoList(todoList: TodoList) {
    this.DB.list(this.basePath).update(
      todoList.uuid, todoList
    );
  }

  public updateTodoItem(todoList: TodoList, todoItem: TodoItem) {
    this.DB.list(`${this.basePath}/${todoList.uuid}/items`).update(
      todoItem.uuid, todoItem
    );
  }

  public setTodoListColor(todoList: TodoList, color: string) {
    this.DB.object(`${this.basePath}/${todoList.uuid}/color`).set(color);
  }

  public setNote(todoList: TodoList, note: string) {
    this.DB.object(`${this.basePath}/${todoList.uuid}/note`).set(note);
  }

  public setTodosListPriority(todosList: TodoList[], indexes) {
    todosList = this.reoderList(todosList, indexes);

    for (let i = 0; i < todosList.length; i++) {
      this.DB.object(`${this.basePath}/${todosList[i].uuid}/priority`).set(i);
    }
  }

  public setItemPriority(todoList: TodoList, indexes) {
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
    todo.images && todo.images.forEach(image => this.deleteImageIntoBucket(image));
  }

  public deleteImage(todo: TodoList, image: ImageItem) {
    this.DB.object(`${this.basePath}/${todo.uuid}/images/${image.uuid}`).remove();
    this.deleteImageIntoBucket(image);
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
          items: this.itemsPresenter(c.payload.val().items),
          images: this.imagesPresenter(c.payload.val().images)
        }))
      )
    })
  }
  private imagesPresenter(images): TodoItem[] {
    if (!images) { return []; }

    return this.orderByPriority(
      Object.keys(images).map(function(key) {
        const image = images[key];
        return {
          uuid: key,
          ...image
        };
      })
    );
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

  private emailToFirebaseFormat(email: string): string {
    return email.replace(/\./g, "%");
  }
}
