import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Eye from '@/components/icons/Eye'
import useRequest from '@/hooks/useAuthRequest'
import useUsers from '@/hooks/useUsers'

const SignUp = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatedPass, setRepeatedPass] = useState('')
  const [rePassError, setRePassError] = useState(null)
  const [eye, setEye] = useState(false)
  const { setUser } = useUsers();
  const navigate = useNavigate();

  const { authRequest, emailError, setEmailError, passError, setPassError, reqError } = useRequest({
    url: '/users/sign-up/',
    method: 'post',
    body: {
      email,
      password
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password != repeatedPass) {
      setRePassError('Passwords do not Match');
      return;
    }
    const data = await authRequest()

    if (data) {
      setUser(data)
      navigate('/app/home')
    }
  }

  return (
    <div className='flex items-center justify-center w-full h-screen'>
      <form
        onSubmit={handleSubmit}
        className=' shadow-lg p-8 rounded-sm sm:rounded-lg w-full max-w-[600px] bg-white  border-blue-200 h-screen sm:h-auto'>

        <div className='mb-5'>
          <h1 className='text-4xl font-bold text-center text-blue-400'>Sign Up</h1>
        </div>

        <div className={`mb-5 ${emailError || reqError ? 'border-white' : 'border-blue-300 rounded-lg'}  border-b-2 `}>
          <input type="text" placeholder='Email' name='email'
            value={email} onChange={e => { setEmail(e.target.value); setEmailError(null) }}
            className='shadow-lg w-full shadow-blue-200 p-2  rounded-lg focus:outline-none focus:shadow-blue-300 transition-shadow' />
          <p className='text-red-500 bg-red-100  flex rounded-b-lg'><span className='ml-4'>{emailError || reqError}</span></p>
        </div>

        <div className={`mb-5 ${passError ? 'border-white' : 'border-blue-300 rounded-lg'}  border-b-2 relative  `}>
          <input type={!eye ? 'password' : 'text'} placeholder='Password' name='password'
            value={password} onChange={e => { setPassword(e.target.value); setPassError(null) }}
            className='shadow-lg w-full shadow-blue-200 p-2 rounded-lg focus:outline-none focus:shadow-blue-300 transition-shadow' />
          <span onClick={() => setEye(!eye)} className='absolute right-4 top-2'><Eye open={eye} /></span>
          <p className='text-red-500 bg-red-100  flex rounded-b-lg'><span className='ml-4'>{passError}</span></p>
        </div>

        <div className={`mb-5 ${rePassError ? 'border-white' : 'border-blue-300 rounded-lg'}  border-b-2 `}>
          <input type={!eye ? 'password' : 'text'} placeholder='Confirm your password' name='rePassword'
            value={repeatedPass} onChange={e => { setRepeatedPass(e.target.value); setRePassError(null) }}
            className='shadow-lg w-full shadow-blue-200 p-2 rounded-lg focus:outline-none focus:shadow-blue-300 transition-shadow' />
          <p className='text-red-500 bg-red-100  flex rounded-b-lg'><span className='ml-4'>{rePassError}</span></p>
        </div>

        <div>
          <button
            className=' text-center text-white text-2xl w-full font-bold bg-blue-400 p-2 rounded-lg shadow-lg shadow-blue-200 hover:shadow-blue-400 transition-shadow'>
            Sign Up
          </button>
        </div>

        <div className='flex justify-between mt-8 flex-col md:flex-row gap-y-2'>
          <Link to='/sign-in' className=' font-semibold text-blue-400 hover:text-blue-600 transition-colors'>Do you have an account? Sign In</Link>
          <Link to='/reset-password' className=' font-semibold text-blue-400 hover:text-blue-600 transition-colors'>Forgot your password?</Link>
        </div>

      </form>
    </div>
  )
}

export default SignUp;