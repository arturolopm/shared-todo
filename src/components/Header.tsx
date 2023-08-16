import { type TodoCreate } from '../types'
import { CreateTodo } from './CreateTodo'

interface Props {
  onAddTodo: ({ name, time }: TodoCreate) => Promise<void>
}
export const Header: React.FC<Props> = ({ onAddTodo }) => {
  return (
    <header className='header'>
      <h1>
        todo
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png'
          style={{ width: '60px', height: 'auto' }}
          alt='typescript img'
        />
      </h1>

      <CreateTodo saveTodo={onAddTodo} />
    </header>
  )
}
