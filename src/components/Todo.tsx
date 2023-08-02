import { type TodoId, type Todo as TodoType } from '../types'
interface Props extends TodoType {
  onRemoveTodo: (id: TodoId) => void
  onToggleCompleteTodo: ({
    _id,
    completed
  }: Pick<TodoType, '_id' | 'completed'>) => void
}
export const Todo: React.FC<Props> = ({
  _id,
  name,
  completed,
  onToggleCompleteTodo,
  onRemoveTodo
}) => {
  const handleChangeCheckBox = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    onToggleCompleteTodo({ _id, completed: e.target.checked })
  }
  return (
    <div className='view'>
      <input
        type='checkbox'
        className='toggle'
        checked={completed}
        onChange={handleChangeCheckBox}
      />
      <label> {name}</label>
      <button
        className='destroy'
        onClick={() => {
          onRemoveTodo({ _id })
        }}></button>
    </div>
  )
}
