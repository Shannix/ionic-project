export interface TodoList {
  uuid: string,
  name: string,
  items: TodoItem[],
  image: ImageItem,
  authorization: string[]
}

export interface TodoItem {
  uuid: string,
  name: string,
  desc: string,
  complete: boolean
}

export interface ImageItem {
  bucketLocation: string,
  urlLocation: string,
  title: string
}
