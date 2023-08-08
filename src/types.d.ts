import { type TODO_FILTERS } from './consts'

export interface Todo {
  _id?: string
  name: string
  completed: boolean
}

export type TodoTitle = Pick<Todo, 'name'>
export type TodoId = Pick<Todo, '_id'>
export type TodoCompleted = Pick<Todo, 'completed'>

export type ListOfTodos = Todo[]

export type FilterValue = (typeof TODO_FILTERS)[keyof typeof TODO_FILTERS]

export interface List {
  _id: string
  name: string
  owners: string[]
  items: ListOfTodos
}
export interface User {
  token?: string
  _id: string
  name?: string
  email: string
  password?: string
  lists?: List[]
}

export type UserValidation = Omit<User, '_id'>

export interface Invitation {
  sender: string
  senderId: string
  receiver: string
}
