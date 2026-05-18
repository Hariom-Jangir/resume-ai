import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import React from 'react'

const Protected = ({ children }) => {
    const { isLoading, user } = useAuth()

    if (isLoading) {
        return (
            <main className="loading-screen">
                <h1>Loading...</h1>
            </main>
        )
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

export default Protected
