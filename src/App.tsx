import { useEffect, useState } from 'react'
import { Todos } from './components/Todos'
import {
  type TodoTitle,
  type FilterValue,
  type TodoId,
  type Todo as TodoType
} from './types'
import { TODO_FILTERS } from './consts'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { DarkMode } from './components/DarkMode'
import useApiFetch from './hooks/useApiFetch'

// const mockTodos = [
//   {
//     id: '1',
//     title: 'Master Typescript ',
//     completed: true
//   },
//   {
//     id: '2',
//     title: 'Build something people can use',
//     completed: false
//   },
//   {
//     id: '3',
//     title: 'improve it',
//     completed: false
//   }
// ]

const App = (): JSX.Element => {
  const [todos, setTodos] = useState<TodoType[]>([])

  const apiUrl =
    typeof import.meta.env.VITE_SERVER_URL === 'string'
      ? `${import.meta.env.VITE_SERVER_URL}`
      : ''
  const {
    data
    //  loading, error
  } = useApiFetch(`${apiUrl}/item`, 'GET')
  useEffect(() => {
    console.log(data)

    if (data !== null) {
      setTodos(data)
    }
  }, [data])
  const [filterSelected, setFilterSelected] = useState<FilterValue>(
    TODO_FILTERS.ALL
  )

  const handleRemove = ({ _id }: TodoId): void => {
    const newTodos = todos.filter((todo) => todo._id !== _id)
    setTodos(newTodos)
  }

  const handleCompleted = ({
    _id,
    completed
  }: Pick<TodoType, '_id' | 'completed'>): void => {
    const newTodos = todos.map((todo) => {
      if (todo._id === _id) {
        return {
          ...todo,
          completed
        }
      }
      return todo
    })
    setTodos(newTodos)
  }
  const handleFilterChange = (filter: FilterValue): void => {
    setFilterSelected(filter)
  }

  const handleRemoveAllCompleted = (): void => {
    const newTodos = todos.filter((todo) => !todo.completed)
    setTodos(newTodos)
  }

  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - activeCount

  const filteredTodos = todos.filter((todo) => {
    if (filterSelected === TODO_FILTERS.ACTIVE) return !todo.completed
    if (filterSelected === TODO_FILTERS.COMPLETED) return todo.completed
    return todo
  })
  const handleAddTodo = ({ name }: TodoTitle): void => {
    const newTodo = {
      name,
      // _id: crypto.randomUUID(),
      completed: false
    }
    const newTodos = [...todos, newTodo]
    setTodos(newTodos)
  }
  return (
    <>
      <DarkMode />
      <div className='todoapp'>
        <Header onAddTodo={handleAddTodo} />
        <Todos
          onToggleCompleteTodo={handleCompleted}
          onRemoveTodo={handleRemove}
          todos={filteredTodos}
        />
        <Footer
          activeCount={activeCount}
          completedCount={completedCount}
          filterSelected={filterSelected}
          onClearCompleted={handleRemoveAllCompleted}
          handleFilterChange={handleFilterChange}
        />
      </div>
    </>
  )
}

export default App
