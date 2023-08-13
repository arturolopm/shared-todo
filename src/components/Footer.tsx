import { useState } from 'react'
import { type FilterValue } from '../types'
import ActionAlert from './ActionAlert'
import { Filters } from './Filters'

interface Props {
  activeCount: number
  completedCount: number
  filterSelected: FilterValue
  handleFilterChange: (filter: FilterValue) => void
  onDeleteCompleted: () => void
}
export const Footer: React.FC<Props> = ({
  activeCount = 0,
  completedCount,
  filterSelected,
  handleFilterChange,
  onDeleteCompleted
}) => {
  const [alert, setAlert] = useState(false)
  const handleCloseAlert = () => {
    setAlert(false)
  }
  return (
    <footer className='footer'>
      <span className='todo-count'>
        <strong>{activeCount}</strong> Pending tasks
      </span>
      <Filters
        filterSelected={filterSelected}
        onFilterChange={handleFilterChange}
      />

      {completedCount > 0 && (
        <>
          {alert && (
            <ActionAlert
              accept={() => onDeleteCompleted()}
              decline={() => {
                handleCloseAlert()
              }}
              close={() => {
                handleCloseAlert()
              }}
              parent='Delete all completed'
              advise='You can clean your list from all completed items but you will not be able to recover them'
            />
          )}
          <button
            className='clear-completed'
            onClick={() => {
              setAlert(true)
            }}>
            Delete completed
          </button>
        </>
      )}
    </footer>
  )
}
