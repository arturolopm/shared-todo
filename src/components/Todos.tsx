import type { Todo as TodoType, TodoId, ListOfTodos } from '../types'
import { Todo } from './Todo'
interface Props {
  todos: ListOfTodos
  onRemoveTodo: (id: TodoId) => void
  onToggleCompleteTodo: ({
    _id,
    completed
  }: Pick<TodoType, '_id' | 'completed'>) => void
}
export const Todos: React.FC<Props> = ({
  todos,
  onRemoveTodo,
  onToggleCompleteTodo
}) => {
  return (
    <ul className='todo-list'>
      {todos?.map((todo) => (
        <li
          key={todo._id}
          className={`${todo.completed ? 'completed' : ''}`}>
          <Todo
            key={todo._id}
            _id={todo._id}
            name={todo.name}
            time={todo.time}
            completed={todo.completed}
            completedBy={todo.completedBy ?? ''}
            onToggleCompleteTodo={onToggleCompleteTodo}
            onRemoveTodo={onRemoveTodo}
          />
        </li>
      ))}
    </ul>
  )
}
