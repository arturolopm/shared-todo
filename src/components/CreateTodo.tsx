import { useState } from 'react'
import { type TodoTitle } from '../types'

interface Props {
  saveTodo: ({ name }: TodoTitle) => Promise<void>
}
export const CreateTodo: React.FC<Props> = ({ saveTodo }) => {
  const [inputValue, setInputValue] = useState('')
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void saveTodo({ name: inputValue })
    setInputValue('')
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
      {inputValue && <button className='darkbtn'>add</button>}
    </form>
  )
}
