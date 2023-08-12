import React, {
  useRef,
  useState,
  LegacyRef,
  useEffect,
  useCallback
} from 'react'
import useApiFetch from '../hooks/useApiFetch'
import { Invitation, User } from '../types'
import ActionAlert from './ActionAlert'
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

  const [sendInvitationAlert, setSendInvitationAlert] = useState(false)
  const [acceptInvitationAlert, setAcceptInvitationAlert] = useState(false)
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

  const sendInvitation = () => {
    setData((prevData) => ({
      ...prevData,
      email: emailRef.current?.value as unknown as string,
      _id: user._id
    }))
    setSendInvitationAlert(false)
    if (emailRef.current) {
      emailRef.current.value = ''
    }
  }
  const handleIsActive = () => {
    setIsActive((prev) => !prev)
  }
  const handleAccept = useCallback((_id: string) => {
    setAcceptData({ _id })

    const newInvitations = invitations.filter(
      (invitation) => invitation._id !== _id
    )

    setInvitations(newInvitations)
    // setShouldUpdate(true)
    setAcceptInvitationAlert(false)
    window.location.reload()
    // setAcceptData(undefined)
  }, [])
  const handleAcceptAlertClose = useCallback(() => {
    setAcceptInvitationAlert(false)
  }, [acceptInvitationAlert])

  return (
    <>
      <div className='btn-container'>
        <div>
          <button
            className='darkbtn'
            onClick={() => handleIsActive()}>
            {isActive ? 'Close' : 'Add Someone'}
          </button>
          {isActive && (
            <div>
              <input
                type='email'
                placeholder='Enter email'
                required
                ref={emailRef as LegacyRef<HTMLInputElement> | undefined}
              />
              {sendInvitationAlert && (
                <ActionAlert
                  parent={'Continue'}
                  advise=''
                  decline={() => setSendInvitationAlert(false)}
                  accept={() => sendInvitation()}
                  close={() => setSendInvitationAlert(false)}
                />
              )}
              <button
                onClick={() => setSendInvitationAlert(true)}
                className='darkbtn'>
                Send
              </button>
            </div>
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
                        onClick={() =>
                          // handleAccept(invitation._id)
                          setAcceptInvitationAlert(true)
                        }
                        className='darkbtn'>
                        Accept
                      </button>
                      {acceptInvitationAlert && (
                        <ActionAlert
                          parent={'Accept Invitation'}
                          advise={
                            'You can only be in one shared todo list, if you accept this invitation you will left the current list to join the new one'
                          }
                          decline={() => handleAcceptAlertClose()}
                          accept={() => handleAccept(invitation._id)}
                          close={() => handleAcceptAlertClose()}
                        />
                      )}
                    </div>
                  )
                })}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default InvitationButton
