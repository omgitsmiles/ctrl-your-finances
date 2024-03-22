import React from 'react'
import { UserAuth } from '../context/AuthContext'


function Budgeting() {
    const { user } = UserAuth()
    console.log(user)


    return (
        <h1>Budgeting Goals</h1>
    )
}

export default Budgeting