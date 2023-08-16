import { useEffect, useState } from 'react'
import { Todos } from './components/Todos'
import {
  type FilterValue,
  type TodoId,
  type Todo as TodoType,
  type User,
  type List,
  type TodoCreate
} from './types'
import { TODO_FILTERS } from './consts'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import useApiFetch from './hooks/useApiFetch'
import LoginForm from './components/LoginForm'
import InvitationButton from './components/InvitationButton'
import TopButtons from './components/TopButtons'
import { ShowUsers } from './components/ShowUsers'

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

  // const [shouldUpdate, setShouldUpdate] = useState(false)

  const [todos, setTodos] = useState<TodoType[]>([])
  console.log('Todos', todos)

  const [toAdd, setToAdd] = useState<TodoType>()

  const [toModify, setToModify] = useState<TodoType>()

  const [toDelete, setToDelete] = useState<TodoId>()
  const [removeCompleted, setRemoveCompleted] = useState(false)
  const [list, setList] = useState<List>()

  // useEffect(() => {
  //   setTimeout(() => {
  //     setShouldUpdate((prev) => !prev)
  //   }, 200)
  // }, [toAdd])
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
    user!
    // shouldUpdate
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
    const newTodos = todos?.filter((todo) => todo._id !== _id)
    setTodos(newTodos)
  }

  const handleCompleted = ({
    _id,
    completed
  }: Pick<TodoType, '_id' | 'completed'>): void => {
    const newTodos = todos?.map((todo) => {
      if (todo._id === _id) {
        const userNameToModify = user!.name
        todo.completedBy = userNameToModify
        todo.completed = completed
        setToModify(todo)
        return {
          ...todo,
          completed,
          completedBy: userNameToModify
        }
      }

      return todo
    })
    setTodos(newTodos)
  }
  const apiUrlWithId =
    toModify?._id !== undefined ? `${apiUrl}/item/${toModify?._id}` : 'Error'

  useApiFetch(apiUrlWithId, 'PUT', toModify, user!) // eslint-disable-line @typescript-eslint/no-unused-vars
  // const modifiedTodo: TodoType[] | undefined =
  //   apiResponse?.response ?? undefined
  // console.log(modifiedTodo)
  const apiUrlWithIdToDelete =
    toDelete?._id !== undefined ? `${apiUrl}/item/${toDelete?._id}` : 'Error'

  useApiFetch(apiUrlWithIdToDelete, 'DELETE', undefined, user!) // eslint-disable-line @typescript-eslint/no-unused-vars

  const handleFilterChange = (filter: FilterValue): void => {
    setFilterSelected(filter)
  }

  const handleRemoveAllCompleted = (): void => {
    const newTodos = todos?.filter((todo) => !todo.completed)
    setTodos(newTodos)
  }
  useEffect(() => {
    handleRemoveAllCompleted()
  }, [removeCompleted])

  const apiUrlDeleteMany = removeCompleted
    ? `${apiUrl}/item/allCompleted/${user?._id}`
    : 'Error'
  useApiFetch(apiUrlDeleteMany, 'DELETE', undefined, user!) // eslint-disable-line @typescript-eslint/no-unused-vars

  const activeCount = todos?.filter((todo) => !todo.completed)?.length
  const completedCount = todos?.length - activeCount

  const filteredTodos = todos?.filter((todo) => {
    if (filterSelected === TODO_FILTERS.ACTIVE) return !todo.completed
    if (filterSelected === TODO_FILTERS.COMPLETED) return todo.completed
    return todo
  })
  const handleAddTodo = async ({ name, time }: TodoCreate): Promise<void> => {
    const data = {
      name,
      completed: false,
      time
    }
    setToAdd(data)

    // setTodos((prevTodos) => [...prevTodos, data])
  }

  const addedTodo =
    useApiFetch(`${apiUrl}/item/${userID}`, 'Post', toAdd, user!)?.response ??
    undefined
  useEffect(() => {
    if (addedTodo) {
      setTodos((prevTodos) => [...prevTodos, addedTodo])
    }
  }, [addedTodo])

  return (
    <>
      {user !== null ? (
        <>
          <TopButtons />
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
          <ShowUsers
            todos={todos}
            list={list!}
          />
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
