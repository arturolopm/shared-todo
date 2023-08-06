import { useState, useMemo, useEffect, useRef, LegacyRef } from 'react'
import useAuth from '../hooks/useAuth'
import type { User, UserValidation } from '../types'

type logOrRegister = 'login' | 'register' | 'none'

interface LoginFormProps {
  apiUrl: string
  user: User
}

const LoginForm = ({ apiUrl, user }: LoginFormProps): JSX.Element => {
  const [logOrRegister, setLogOrRegister] = useState<logOrRegister>('none')
  const [action, setAction] = useState<logOrRegister>('none')
  const [data, setData] = useState<UserValidation | undefined>()
  console.log('data', data)

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

  const handleRegister = () => {
    setData({
      name: nameRef.current?.value as unknown as string,
      email: emailRef.current?.value as unknown as string,
      password: passwordRef.current?.value as unknown as string
    })
    setAction('register')
  }

  useEffect(() => {
    setData(data)
  }, [data])

  const urlToValidate = useMemo(() => (data ? apiUrl : 'Error'), [apiUrl, data])

  useAuth(action, urlToValidate, 'POST', data)

  return (
    <>
      {!logOrRegister ? (
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
          <h2>Login </h2>
          <form
            className='main'
            onSubmit={(e) => handleLogin(e)}>
            <input
              type='text'
              className='new-todo'
              placeholder='Email'
              ref={emailRef as LegacyRef<HTMLInputElement> | undefined}
            />
            <input
              type='password'
              className='new-todo'
              placeholder='Password'
              onChange={() => console.log('Pass', passwordRef.current?.value)}
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
          <h2>Register</h2>
          <form
            className='main'
            onSubmit={handleRegister}>
            <input
              type='text'
              className='new-todo'
              placeholder='Name'
              ref={nameRef as LegacyRef<HTMLInputElement> | undefined}
            />
            <input
              type='email'
              className='new-todo'
              placeholder='Email'
              ref={emailRef as LegacyRef<HTMLInputElement> | undefined}
            />
            <input
              type='password'
              className='new-todo'
              placeholder='Password'
              ref={passwordRef as LegacyRef<HTMLInputElement> | undefined}
            />
            <input
              type='password'
              className='new-todo'
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
            or if you don't have an account{' '}
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
