export interface TodoList {
  email: string,
  uuid: string,
  name: string,
  authorization: [],
  items: TodoItem[]
}

export interface TodoItem {
  uuid: string,
  name: string,
  desc: string,
  complete: boolean
}
