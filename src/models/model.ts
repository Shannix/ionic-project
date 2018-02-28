export interface TodoList {
  email: string,
  uuid: string,
  name: string,
  readers: [],
  items: TodoItem[]
}

export interface TodoItem {
  uuid: string,
  name: string,
  desc: string,
  complete: boolean
}
