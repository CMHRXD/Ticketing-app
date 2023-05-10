import React from 'react'
import OrderDetail from '../../components/OrderDetail'
import OrderList from '../../components/OrderList'

const Orders = ({view}) => {
  return (
    <div className=" flex flex-col ">
    {view=="Detail" ? <OrderDetail/> : <OrderList />}
  </div>
  )
}

export default Orders