export interface TodoList {
  uuid: string,
  name: string,
  color: string,
  items: TodoItem[],
  images: ImageItem[],
  priority: number,
  authorization: {},
  note: string
}

export interface TodoItem {
  uuid: string,
  name: string,
  desc: string,
  complete: boolean,
  priority: number,
  dateCreate: string,
  dateExpire: string
}

export interface ImageItem {
  uuid: string,
  bucketLocation: string,
  urlLocation: string,
  title: string
}
