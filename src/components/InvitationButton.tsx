import React, { useRef, useState, LegacyRef } from 'react'
import useApiFetch from '../hooks/useApiFetch'
import { User } from '../types'
type Props = {
  apiUrl: string
  user: User
}
interface EmailID {
  email: string
  _id: string
}

const InvitationButton: React.FC<Props> = ({ apiUrl, user }) => {
  const emailRef = useRef<HTMLInputElement>()
  const [isActive, setIsActive] = useState(false)
  const [data, setData] = useState<EmailID>()
  const invitationUrl = data ? `${apiUrl}/invitation/send` : 'Error'

  const invitation = useApiFetch(invitationUrl, 'POST', data, user)
  console.log('invitation', invitation)

  const sendInvitation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setData({
      email: emailRef.current?.value as unknown as string,
      _id: user._id
    })
  }
  const handleIsActive = () => {
    setIsActive((prev) => !prev)
  }

  return (
    <div>
      <button
        className='darkbtn'
        onClick={() => handleIsActive()}>
        {isActive ? 'Close' : 'Add Someone'}
      </button>
      {isActive && (
        <form onSubmit={(e) => sendInvitation(e)}>
          <input
            type='email'
            placeholder='Enter email'
            required
            ref={emailRef as LegacyRef<HTMLInputElement> | undefined}
          />
          <button className='darkbtn'>Send</button>
        </form>
      )}
    </div>
  )
}

export default InvitationButton
