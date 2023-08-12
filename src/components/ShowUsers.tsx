import { useState } from 'react'
import { List } from '../types'
interface Props {
  list: List
}
export const ShowUsers: React.FC<Props> = ({ list }) => {
  const [showUsers, setShowUsers] = useState(false)

  const handleShowUsers = (): void => {
    setShowUsers((prev) => !prev)
  }

  return (
    <div className='btn-container'>
      <button
        onClick={() => {
          handleShowUsers()
        }}
        className='darkbtn showUsers'>
        {`${showUsers ? 'Hide' : 'Show'}`} partners
      </button>
      <div>
        {showUsers &&
          list &&
          list.owners?.map((owner, i) => {
            return (
              <div
                key={i}
                className='darkbtn'>
                <div>{owner.name}</div>
                <div>{owner.email}</div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
