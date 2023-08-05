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
  const [toAdd, setToAdd] = useState<TodoType>()
  const [toModify, setToModify] = useState<TodoType>()
  const [toDelete, setToDelete] = useState<TodoId>()
  console.log('todelete', toDelete)

  console.log('to modify ', toModify)

  const apiUrl =
    typeof import.meta.env.VITE_SERVER_URL === 'string'
      ? `${import.meta.env.VITE_SERVER_URL}`
      : ''
  const {
    response
    //  loading, error
  } = useApiFetch(`${apiUrl}/item`, 'GET')
  useEffect(() => {
    console.log(response)

    if (response !== null) {
      setTodos(response)
    }
  }, [response])
  const [filterSelected, setFilterSelected] = useState<FilterValue>(
    TODO_FILTERS.ALL
  )

  const handleRemove = ({ _id }: TodoId): void => {
    setToDelete({ _id })
    const newTodos = todos.filter((todo) => todo._id !== _id)
    setTodos(newTodos)
  }

  const handleCompleted = ({
    _id,
    completed
  }: Pick<TodoType, '_id' | 'completed'>): void => {
    const newTodos = todos.map((todo) => {
      if (todo._id === _id) {
        setToModify(todo)
        return {
          ...todo,
          completed
        }
      }
      return todo
    })
    setTodos(newTodos)
  }
  const apiUrlWithId =
    toModify?._id !== undefined ? `${apiUrl}/item/${toModify._id}` : 'Error'

  const apiResponse = useApiFetch(apiUrlWithId, 'PUT', toModify) // eslint-disable-line @typescript-eslint/no-unused-vars
  // const modifiedTodo: TodoType[] | undefined =
  //   apiResponse?.response ?? undefined
  // console.log(modifiedTodo)
  const apiUrlWithIdToDelete =
    toDelete?._id !== undefined ? `${apiUrl}/item/${toDelete._id}` : 'Error'

  const deleteResponse = useApiFetch(apiUrlWithIdToDelete, 'DELETE') // eslint-disable-line @typescript-eslint/no-unused-vars

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
  const handleAddTodo = async ({ name }: TodoTitle): Promise<void> => {
    const data = {
      name,
      completed: false
    }
    setToAdd(data)

    setTodos((prevTodos) => [...prevTodos, data])
  }
  const addedTodo: TodoType[] | undefined =
    useApiFetch(`${apiUrl}/item`, 'Post', toAdd)?.response ?? undefined
  console.log('Added ', addedTodo)

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
