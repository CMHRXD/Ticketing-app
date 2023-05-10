import { useContext } from 'react'
import UserContext from '@/context/UsersContextProvider'

const useUsers = () => {
  return useContext(UserContext)
}

export default useUsers