import { FILTER_BUTTONS } from '../consts'
import { type FilterValue } from '../types'

interface Props {
  onFilterChange: (filter: FilterValue) => void
  filterSelected: FilterValue
}

export const Filters: React.FC<Props> = ({
  filterSelected,
  onFilterChange
}) => {
  return (
    <ul className='filters'>
      {Object.entries(FILTER_BUTTONS).map(([key, { href, literal }]) => {
        const isSelected = key === filterSelected
        const className = isSelected ? 'selected' : ''
        return (
          <li key={key}>
            <a
              href={href}
              className={className}
              onClick={(event) => {
                event.preventDefault()
                onFilterChange(key as FilterValue)
              }}>
              {literal}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
