import React from 'react'
import { AppContext } from '../context/Context'


function Budgeting() {
    const { user } = AppContext()
    console.log(user)


    return (
        <h1>Budgeting Goals</h1>
    )
}

export default Budgeting