export interface TodoList {
  uuid: string,
  name: string,
  color: string,
  items: TodoItem[],
  image: ImageItem,
  authorization: string[]
}

export interface TodoItem {
  uuid: string,
  name: string,
  desc: string,
  complete: boolean,
  expire: Date
}

export interface ImageItem {
  bucketLocation: string,
  urlLocation: string,
  title: string
}
