import React, { useContext } from 'react'
import OrderContext from '@/context/OrderContextProvider'

const useOrders = () => {
  return useContext(OrderContext)
}

export default useOrders