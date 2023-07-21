import { type TodoId, type Todo as TodoType } from '../types'
interface Props extends TodoType {
  onRemoveTodo: (id: TodoId) => void
  onToggleCompleteTodo: ({
    id,
    completed
  }: Pick<TodoType, 'id' | 'completed'>) => void
}
export const Todo: React.FC<Props> = ({
  id,
  title,
  completed,
  onToggleCompleteTodo,
  onRemoveTodo
}) => {
  const handleChangeCheckBox = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    onToggleCompleteTodo({ id, completed: e.target.checked })
  }
  return (
    <div className='view'>
      <input
        type='checkbox'
        className='toggle'
        checked={completed}
        onChange={handleChangeCheckBox}
      />
      <label> {title}</label>
      <button
        className='destroy'
        onClick={() => {
          onRemoveTodo({ id })
        }}></button>
    </div>
  )
}
