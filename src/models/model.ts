export interface TodoList {
  uuid: string,
  name: string,
  items: TodoItem[],
  image: ImageItem,
  priority: number
}

export interface TodoItem {
  uuid: string,
  name: string,
  desc: string,
  complete: boolean,
  priority: number
}

export interface ImageItem {
  bucketLocation: string,
  urlLocation: string,
  title: string
}
