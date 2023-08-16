import { useState } from 'react'
import type { List, Todo } from '../types'
interface Props {
  list: List
  todos: Todo[]
}
interface GetTimeProps {
  todoList: Todo[]
  name: string
}
export const ShowUsers: React.FC<Props> = ({ list, todos }) => {
  const [showUsers, setShowUsers] = useState(false)

  console.log('Todolist', todos)
  const handleShowUsers = (): void => {
    setShowUsers((prev) => !prev)
  }
  const getTimeByUser = ({ name, todoList }: GetTimeProps): number => {
    const totalTime = todoList.reduce((accumulator, todo) => {
      if (todo.completed && todo.completedBy === name) {
        return accumulator + todo.time
      }
      return accumulator
    }, 0)

    return totalTime
  }

  return (
    <div className='btn-container'>
      <button
        onClick={() => {
          handleShowUsers()
        }}
        className='darkbtn showUsers'>
        {`${showUsers ? 'Hide' : 'Show'}`} results
      </button>
      <div>
        {showUsers &&
          list &&
          list.owners?.map((owner, i) => {
            return (
              <div
                className='btn-container'
                key={i}>
                <div className='darkbtn'>
                  <div>
                    {owner.name}{' '}
                    {getTimeByUser({ name: owner.name!, todoList: todos })}{' '}
                    minutes
                  </div>
                  <div>{owner.email}</div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
