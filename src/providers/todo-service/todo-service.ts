import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TodoItem, TodoList } from "../../models/model";
import { Observable } from "rxjs/Observable";
import 'rxjs/Rx';

/*
  Generated class for the TodoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TodoServiceProvider {

  data: TodoList[] = [
    {
      uuid: "a351e558-29ce-4689-943c-c3e97be0df8b",
      name: "List 13",
      items: [
        {

          uuid: "7dc94eb4-d4e9-441b-b06b-0ca29738c8d2",
          name: "Item 1-1",
          complete: false
        },
        {
          uuid: "20c09bdd-1cf8-43b0-9111-977fc4d343bc",
          name: "Item 1-2",
          complete: false
        }
      ]
    },
    {
      uuid: "90c04913-c1a2-47e5-9535-c7a430cdcf9c",
      name: "List 2",
      items: [
        {
          uuid: "72849f5f-2ef6-444b-98b0-b50fc019f97c",
          name: "Item 2-1",
          complete: false
        },
        {
          uuid: "20c09bdd-1cf8-43b0-9111-977fc4d343bc",
          name: "Item 1-2",
          complete: false
        }
      ]
    }
  ];


  constructor(public http: HttpClient) { }

  private getUuid(name: string) {
    return name;
  }

  public getList(): Observable<TodoList[]> {
    return Observable.of(this.data);
  }

  public getTodos(uuid: String): Observable<TodoItem[]> {
    return Observable.of(this.data.find(d => d.uuid == uuid).items)
  }

  public addTodo(listUuid: String, newItem: TodoItem) {
    newItem.uuid = this.getUuid(newItem.name)

    let items = this.data.find(d => d.uuid == listUuid).items;
    items.push(newItem);
  }

  public editTodo(listUuid: String, editedItem: TodoItem) {
    let items = this.data.find(d => d.uuid == listUuid).items;
    let index = items.findIndex(value => value.uuid == editedItem.uuid);
    items[index] = editedItem;
  }

  public deleteTodo(listUuid: String, uuid: String) {
    let items = this.data.find(d => d.uuid == listUuid).items;
    let index = items.findIndex(value => value.uuid == uuid);
    if (index != -1) {
      items.splice(index, 1);
    }
  }

  public deleteTodoList(uuid: String) {
    const index = this.data.findIndex(d => d.uuid == uuid);
    if (index != -1) {
      this.data.splice(index, 1);
    }
  }

  public addTodoList(newTodoList: TodoList) {
    newTodoList.uuid = this.getUuid(newTodoList.name)
    this.data.push(newTodoList);
  }


}
