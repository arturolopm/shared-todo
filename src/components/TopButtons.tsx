import { List, User } from '../types'
import { DarkMode } from './DarkMode'
import { ShowUsers } from './ShowUsers'
interface Props {
  list: List
}
const TopButtons: React.FC<Props> = ({ list }) => {
  return (
    <div className='btn-container'>
      <DarkMode />
      <ShowUsers list={list} />
    </div>
  )
}

export default TopButtons
