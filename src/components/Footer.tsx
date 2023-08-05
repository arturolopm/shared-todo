import { type FilterValue } from '../types'
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
        <button
          className='clear-completed'
          onClick={() => {
            onDeleteCompleted()
          }}>
          Delete completed
        </button>
      )}
    </footer>
  )
}
