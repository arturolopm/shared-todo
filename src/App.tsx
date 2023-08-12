import { useEffect, useState } from 'react'
import { Todos } from './components/Todos'
import {
  type TodoTitle,
  type FilterValue,
  type TodoId,
  type Todo as TodoType,
  type User,
  List
} from './types'
import { TODO_FILTERS } from './consts'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import useApiFetch from './hooks/useApiFetch'
import LoginForm from './components/LoginForm'
import InvitationButton from './components/InvitationButton'
import TopButtons from './components/TopButtons'
import ActionAlert from './components/ActionAlert'

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
  const dataFromStorage = localStorage.getItem('user') ?? null
  const userFromStorage: User | null =
    dataFromStorage !== null ? JSON.parse(dataFromStorage) : null

  const [user, setUser] = useState<User | null>(userFromStorage)
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }, [user])
  console.log('User', user)

  const [shouldUpdate, setShouldUpdate] = useState(false)
  const initialTodos =
    user?.lists && user.lists[0]?.items ? user.lists[0].items : []
  const [todos, setTodos] = useState<TodoType[]>(initialTodos)

  const [toAdd, setToAdd] = useState<TodoType>()

  const [toModify, setToModify] = useState<TodoType>()
  const [toDelete, setToDelete] = useState<TodoId>()
  const [removeCompleted, setRemoveCompleted] = useState(false)
  const [list, setList] = useState<List>()

  useEffect(() => {
    setTimeout(() => {
      setShouldUpdate((prev) => !prev)
    }, 50)
  }, [toAdd])
  const apiUrl: string =
    typeof import.meta.env.VITE_SERVER_URL === 'string'
      ? `${import.meta.env.VITE_SERVER_URL}`
      : ''
  const userID = user !== null ? user._id : 'ERROR'
  const {
    response
    //  loading, error
  } = useApiFetch(
    `${apiUrl}/item/${userID}`,
    'GET',
    undefined,
    user!,
    shouldUpdate
  )
  useEffect(() => {
    if (response !== null) {
      setTodos(response.items)
      setList(response)
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
    toModify?._id !== undefined ? `${apiUrl}/item/${toModify?._id}` : 'Error'

  const apiResponse = useApiFetch(apiUrlWithId, 'PUT', toModify, user!) // eslint-disable-line @typescript-eslint/no-unused-vars
  // const modifiedTodo: TodoType[] | undefined =
  //   apiResponse?.response ?? undefined
  // console.log(modifiedTodo)
  const apiUrlWithIdToDelete =
    toDelete?._id !== undefined ? `${apiUrl}/item/${toDelete?._id}` : 'Error'

  const deleteResponse = useApiFetch(
    apiUrlWithIdToDelete,
    'DELETE',
    undefined,
    user!
  ) // eslint-disable-line @typescript-eslint/no-unused-vars

  const handleFilterChange = (filter: FilterValue): void => {
    setFilterSelected(filter)
  }

  const handleRemoveAllCompleted = (): void => {
    const newTodos = todos.filter((todo) => !todo.completed)
    setTodos(newTodos)
  }
  useEffect(() => {
    handleRemoveAllCompleted()
  }, [removeCompleted])

  const apiUrlDeleteMany = removeCompleted
    ? `${apiUrl}/item/allCompleted/${user?._id}`
    : 'Error'
  const deleteAllCompletedResponse = useApiFetch(
    apiUrlDeleteMany,
    'DELETE',
    undefined,
    user!
  ) // eslint-disable-line @typescript-eslint/no-unused-vars

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
    useApiFetch(`${apiUrl}/item/${userID}`, 'Post', toAdd, user!)?.response ??
    undefined

  return (
    <>
      {user !== null ? (
        <>
          <TopButtons list={list!} />
          <div className='todoapp'>
            <Header onAddTodo={handleAddTodo} />
            <Todos
              onToggleCompleteTodo={handleCompleted}
              onRemoveTodo={handleRemove}
              todos={filteredTodos}
            />
            <InvitationButton
              apiUrl={apiUrl}
              user={user}
              setShouldUpdate={setShouldUpdate}
            />
            <Footer
              activeCount={activeCount}
              completedCount={completedCount}
              filterSelected={filterSelected}
              onDeleteCompleted={() => {
                setRemoveCompleted((prev) => !prev)
              }}
              handleFilterChange={handleFilterChange}
            />
          </div>
        </>
      ) : (
        <LoginForm
          apiUrl={apiUrl}
          setUser={setUser}
        />
      )}
    </>
  )
}

export default App
