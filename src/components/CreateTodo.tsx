import { useState } from 'react'
import { type TodoCreate } from '../types'

interface Props {
  saveTodo: ({ name, time }: TodoCreate) => Promise<void>
}
export const CreateTodo: React.FC<Props> = ({ saveTodo }) => {
  const [inputValue, setInputValue] = useState('')
  const [timeToComplete, setTimeToComplete] = useState(15)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void saveTodo({ name: inputValue, time: timeToComplete })
    setInputValue('')
  }
  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setTimeToComplete(parseInt(e.target.value))
  }
  return (
    <form
      className='btn-container'
      onSubmit={handleSubmit}>
      <input
        className='new-todo'
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
        }}
        placeholder='What do you want to do?'
        autoFocus
      />
      <select
        className=''
        value={timeToComplete}
        onChange={handleTimeChange}>
        <option value={15}>15 minutes</option>
        <option value={30}>30 minutes</option>
        <option value={45}>45 minutes</option>
        {/* Add more options as needed */}
      </select>
      {inputValue && <button className='darkbtn'>add</button>}
    </form>
  )
}
