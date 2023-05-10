import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Eye from '@/components/icons/Eye'
import useUsers from '@/hooks/useUsers'
import useAuthRequest from '@/hooks/useAuthRequest'

const SignIn = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [eye, setEye] = useState(false)
  const { setUser } = useUsers();
  const navigate = useNavigate()

  const { authRequest, emailError, setEmailError, passError, setPassError, reqError } = useAuthRequest({
    url: '/users/sign-in/',
    method: 'post',
    body: {
      email,
      password
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await authRequest()
    if (data) {
      setUser(data)
      navigate('/app/home')
    }
  }

  return (
    <div className='flex justify-center items-center h-screen w-full'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 shadow-2xl rounded-sm w-full max-w-[600px] h-screen sm:rounded-lg sm:h-auto border-blue-200'>
        <div className='mb-5'>
          <h1 className='text-center text-4xl font-bold text-blue-400'>Sign In</h1>
        </div>

        <div className={`mb-5 ${emailError || reqError ? 'border-white' : 'border-blue-300 rounded-lg'}  border-b-2 `}>
          <input type="text" placeholder='Email'
            value={email} onChange={e => { setEmail(e.target.value); setEmailError(null) }}
            className='p-2 w-full rounded-lg focus:outline-none shadow-lg shadow-blue-200 focus:shadow-blue-300 transition-shadow' />
          <p className='text-red-500 bg-red-100  flex rounded-b-lg'><span className='ml-4'>{emailError || reqError}</span></p>
        </div>

        <div className={`mb-5 ${passError || reqError ? 'border-white' : 'border-blue-300 rounded-lg'}  border-b-2 relative`}>
          <input type="password" placeholder='Password'
            value={password} onChange={e => { setPassword(e.target.value); setPassError(null) }}
            className='p-2 w-full rounded-lg focus:outline-none shadow-lg shadow-blue-200 focus:shadow-blue-300 transition-shadow' />
          <span onClick={() => setEye(!eye)} className='absolute right-4 top-2'><Eye open={eye} /></span>
          <p className='text-red-500 bg-red-100  flex rounded-b-lg'><span className='ml-4'>{passError || reqError}</span></p>
        </div>

        <div className='mb-5'>
          <button className='bg-blue-400 text-2xl w-full text-white font-bold rounded-lg p-2 shadow-lg shadow-blue-300 hover:shadow-blue-400 transition-shadow'>Sign In</button>
        </div>

        <div className='flex justify-between flex-col md:flex-row gap-y-2'>
          <Link to='/' className=' font-semibold text-blue-400 hover:text-blue-600 transition-colors'>Don't you have an account yet? Sign Up</Link>
          <Link to='/reset-password' className=' font-semibold text-blue-400 hover:text-blue-600 transition-colors'>Forgot your password?</Link>
        </div>

      </form>
    </div>
  )
}

export default SignIn;