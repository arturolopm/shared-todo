import { useState, useMemo, useEffect, useRef, LegacyRef } from 'react'
import useAuth from '../hooks/useAuth'
import type { User, UserValidation } from '../types'
import GeneralAlert from './GeneralAlert'

type logOrRegister = 'login' | 'register' | 'none'

interface LoginFormProps {
  apiUrl: string

  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const LoginForm = ({ apiUrl, setUser }: LoginFormProps): JSX.Element => {
  const [logOrRegister, setLogOrRegister] = useState<logOrRegister>('none')
  const [action, setAction] = useState<logOrRegister>('none')
  const [alert, setAlert] = useState(false)
  const [data, setData] = useState<UserValidation | undefined>()
  const [adviseForm, setAdviseForm] = useState('')

  const emailRef = useRef<HTMLInputElement>()
  const passwordRef = useRef<HTMLInputElement>()
  const nameRef = useRef<HTMLInputElement>()
  const confirmPasswordRef = useRef<HTMLInputElement>()

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setData({
      email: emailRef.current?.value as unknown as string,
      password: passwordRef.current?.value as unknown as string
    })
    setAction('login')
  }

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (passwordRef.current?.value !== confirmPasswordRef.current?.value) {
      setAdviseForm("Passwords don't match")
      setAlert(true)
    } else {
      setData({
        name: nameRef.current?.value as unknown as string,
        email: emailRef.current?.value as unknown as string,
        password: passwordRef.current?.value as unknown as string
      })
      setAction('register')
    }
  }
  const handleClose = () => {
    setAlert(false)
  }

  const urlToValidate = useMemo(() => (data ? apiUrl : 'Error'), [apiUrl, data])

  const { response } = useAuth(action, urlToValidate, 'POST', data)

  useEffect(() => {
    if (response === 'ALREADY_USER') {
      setAdviseForm('Email already registered please click on log In instead')
      setAlert(true)
      setAction('none')
    }
    if (response === 'USER_NOT_FOUND') {
      setAdviseForm('User not found please verify email or register instead')
      setAlert(true)
      setAction('none')
    }
    if (response === 'INCORRECT_PASSWORD') {
      setAdviseForm('Incorrect Password')
      setAlert(true)
      setAction('none')
    }

    if (
      response !== null &&
      response !== 'ALREADY_USER' &&
      response !== 'USER_NOT_FOUND' &&
      response !== 'INCORRECT_PASSWORD'
    ) {
      localStorage.setItem('user', JSON.stringify(response))
      setUser(response as User)
    }

    setAction('none')
  }, [response, action])

  return (
    <>
      {logOrRegister === 'none' ? (
        <div className='todoapp'>
          <h2 className='selection'>
            <button
              className='darkbtn'
              onClick={() => setLogOrRegister('login')}>
              Login
            </button>

            <button
              className='darkbtn'
              onClick={() => setLogOrRegister('register')}>
              Register
            </button>
          </h2>
        </div>
      ) : logOrRegister === 'login' ? (
        <div className='todoapp'>
          {alert && (
            <GeneralAlert
              advise={adviseForm}
              close={() => handleClose()}
            />
          )}
          <h2>Login </h2>
          <form
            className='main'
            onSubmit={(e) => handleLogin(e)}>
            <input
              type='text'
              className='new-todo'
              required
              placeholder='Email'
              ref={emailRef as LegacyRef<HTMLInputElement> | undefined}
            />
            <input
              type='password'
              className='new-todo'
              required
              placeholder='Password'
              ref={passwordRef as LegacyRef<HTMLInputElement> | undefined}
            />
            <div>
              <button
                type='submit'
                className='darkbtn'>
                Login
              </button>
            </div>
          </form>
          <div>
            or if you don't have an account{' '}
            <button
              className='text-underlined'
              onClick={() => setLogOrRegister('register')}>
              click here
            </button>
          </div>
        </div>
      ) : (
        <div className='todoapp'>
          {alert && (
            <GeneralAlert
              advise={adviseForm}
              close={() => handleClose()}
            />
          )}
          <h2>Register</h2>
          <form
            className='main'
            onSubmit={(e) => handleRegister(e)}>
            <input
              type='text'
              className='new-todo'
              required
              placeholder='Name'
              ref={nameRef as LegacyRef<HTMLInputElement> | undefined}
            />
            <input
              type='email'
              className='new-todo'
              required
              placeholder='Email'
              ref={emailRef as LegacyRef<HTMLInputElement> | undefined}
            />
            <input
              type='password'
              className='new-todo'
              required
              placeholder='Password'
              ref={passwordRef as LegacyRef<HTMLInputElement> | undefined}
            />
            <input
              type='password'
              className='new-todo'
              required
              placeholder='Confirm Password'
              ref={
                confirmPasswordRef as LegacyRef<HTMLInputElement> | undefined
              }
            />
            <div>
              <button
                type='submit'
                className='darkbtn'>
                Register
              </button>
            </div>
          </form>
          <div>
            or if you already have an account an account{' '}
            <button
              className='text-underlined'
              onClick={() => setLogOrRegister('login')}>
              click here
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default LoginForm
