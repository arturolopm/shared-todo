import { useState, useEffect } from 'react'
import useApiFetch from '../hooks/useApiFetch'
interface Props {
  apiUrl: string
}
export const ShowUsers: React.FC<Props> = ({ apiUrl }) => {
  const [showUsers, setShowUsers] = useState(false)
  const [usersOnList, setUsersOnList] = useState([])

  const handleShowUsers = (): void => {
    setShowUsers((prev) => !prev)
  }
  const response = useApiFetch(`${apiUrl}/item/list`, 'GET', undefined)
  // useEffect(() => {
  //   setUsersOnList(response)
  // }, [response])

  return (
    <div className='btn-container'>
      <button
        onClick={() => {
          handleShowUsers()
        }}
        className='darkbtn showUsers'>
        {`${showUsers ? 'Hide' : 'Show'}`} partners
      </button>
      {showUsers && ''}
    </div>
  )
}
