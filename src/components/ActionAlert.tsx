import { useState } from 'react'
interface Props {
  parent: string
  close: () => void
  decline: () => void
  advise: string
  accept: () => void
}
const ActionAlert: React.FC<Props> = ({
  parent,
  close,
  advise,
  decline,
  accept
}) => {
  return (
    <div className='todoapp alert'>
      <div
        onClick={() => close()}
        className='align-rigth'>
        x
      </div>
      <div>{parent}</div>
      <div>{advise}</div>
      <div className='btn-container'>
        <button
          onClick={() => decline()}
          className='darkbtn'>
          Decline
        </button>

        <button
          onClick={() => accept!()}
          className='darkbtn'>
          Accept
        </button>
      </div>
    </div>
  )
}

export default ActionAlert
