import  { useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthRequest from '../../hooks/useAuthRequest'

const ResetPassword = () => {
  const [email, setEmail] = useState("")
  const {authRequest, emailError, reqError} = useAuthRequest({
    url:'',
    method:'',
    body:{
      email
    }
  })
  const handleSubmit = async (e) => {
    e.preventDefault()

  }

  return (
    <div className='flex justify-center items-center h-screen w-full'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-8 shadow-2xl rounded-sm w-full max-w-[600px] h-screen sm:rounded-lg sm:h-auto border-blue-200'>

        <div className='mb-5'>
          <h1 className='text-center text-4xl font-bold text-blue-400'>Reset your Password</h1>
        </div>

        <div className={`mb-5 ${emailError || reqError ? 'border-red-400' : 'border-blue-300 rounded-lg'}  border-b-2 `}>
          <input type="text" placeholder='Email'
            value={email} onChange={e => { setEmail(e.target.value); setEmailError(null) }}
            className='p-2 w-full rounded-lg focus:outline-none shadow-lg shadow-blue-200 focus:shadow-blue-300 transition-shadow' />
          <span className='ml-2 text-red-400'>{emailError || reqError}</span>
        </div>

        <div className='mb-5'>
          <button className='bg-blue-400 text-2xl w-full text-white font-bold rounded-lg p-2 shadow-lg shadow-blue-300 hover:shadow-blue-400 transition-shadow'>Send Mail</button>
        </div>

        <div className='flex justify-between flex-col gap-y-2'>
          <Link to='/' className=' font-semibold text-blue-400 hover:text-blue-600 transition-colors'>Don't you have an account yet? Sign Up</Link>
          <Link to='/reset-password' className=' font-semibold text-blue-400 hover:text-blue-600 transition-colors'>Do you have an account? Sign In</Link>
        </div>

      </form>
    </div>
  )
}

export default ResetPassword;