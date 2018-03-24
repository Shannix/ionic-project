export interface TodoList {
  uuid: string,
  name: string,
  color: string,
  items: TodoItem[],
  images: ImageItem[],
  priority: number,
  authorization: {}
}

export interface TodoItem {
  uuid: string,
  name: string,
  desc: string,
  complete: boolean,
  priority: number
}

export interface ImageItem {
  uuid: string,
  bucketLocation: string,
  urlLocation: string,
  title: string
}
