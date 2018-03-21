export interface TodoList {
  uuid: string,
  name: string,
  color: string,
  items: TodoItem[],
  image: ImageItem,
  priority: number,
  authorization: {}
}

export interface TodoItem {
  uuid: string,
  name: string,
  desc: string,
  complete: boolean,
  priority: number,
  date: string
}

export interface ImageItem {
  bucketLocation: string,
  urlLocation: string,
  title: string
}
