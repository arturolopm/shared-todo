import { DarkMode } from './DarkMode'
import { ShowUsers } from './ShowUsers'
interface Props {
  apiUrl: string
}
const TopButtons: React.FC<Props> = ({ apiUrl }) => {
  return (
    <div className='btn-container'>
      <DarkMode />
      <ShowUsers apiUrl={apiUrl} />
    </div>
  )
}

export default TopButtons
