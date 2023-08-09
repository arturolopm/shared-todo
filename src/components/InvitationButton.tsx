import React, { useRef, useState, LegacyRef, useEffect } from 'react'
import useApiFetch from '../hooks/useApiFetch'
import { Invitation, User } from '../types'
type Props = {
  apiUrl: string
  user: User
  setShouldUpdate: React.Dispatch<React.SetStateAction<boolean>>
}
interface EmailID {
  email: string
  _id: string
}

const InvitationButton: React.FC<Props> = ({
  apiUrl,
  user,
  setShouldUpdate
}) => {
  const emailRef = useRef<HTMLInputElement>()
  const [isActive, setIsActive] = useState(false)
  const [data, setData] = useState<EmailID>()
  const [acceptData, setAcceptData] = useState<object | undefined>()
  const [showInvitations, setShowInvitations] = useState(false)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const invitationUrl = data ? `${apiUrl}/invitation/send` : 'Error'
  const acceptInvitationUrl = acceptData
    ? `${apiUrl}/invitation/accept`
    : 'Error'

  const acceptInvitationsItem = useApiFetch(
    acceptInvitationUrl,
    'POST',
    acceptData,
    user
  )
  useEffect(() => {
    console.log(' accept invitation response', acceptInvitationsItem)
    setAcceptData(undefined)
    // setShouldUpdate((prev) => !prev)
  }, [acceptInvitationsItem])

  const getInvitationsUrl = `${apiUrl}/invitation`
  const invitationsItem = useApiFetch(getInvitationsUrl, 'GET', undefined, user)
  // console.log('invitationsItem', invitationsItem)

  useEffect(() => {
    if (invitationsItem.response) {
      setInvitations(invitationsItem.response)
    }
  }, [invitationsItem])

  const invitation = useApiFetch(invitationUrl, 'POST', data, user)
  // console.log('invitation', invitation)

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
  const handleAccept = (_id: string) => {
    setAcceptData({ _id })
  }

  return (
    <div className='btn-container'>
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
      <div>
        {invitations.length > 0 && (
          <>
            <button
              onClick={() => setShowInvitations((prev) => !prev)}
              className='darkbtn'>
              {showInvitations ? 'Close' : 'Accept invitation'}
            </button>
            {showInvitations &&
              invitations.map((invitation) => {
                return (
                  <div
                    key={invitation._id}
                    className='btn-container'>
                    <div>{invitation.sender}</div>
                    <button
                      onClick={() => handleAccept(invitation._id)}
                      className='darkbtn'>
                      Accept
                    </button>
                  </div>
                )
              })}
          </>
        )}
      </div>
    </div>
  )
}

export default InvitationButton
