import React from 'react'
import useAuthRequest from '@/hooks/useAuthRequest'
const SignOut = () => {
  const { authRequest } = useAuthRequest({
    'url': 'users/sign-out',
    'method': 'post',
    'body': {}
  })

  const data = authRequest()
  if (data) return <Navigate to="/sign-in" />
}

export default SignOut