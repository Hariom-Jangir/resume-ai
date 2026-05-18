import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
import React from 'react'

const Protected = ({ children }) => {
    const { isLoading, user } = useAuth()

    if (isLoading) {
        return (
            <main className="flex min-h-screen w-full max-w-full items-center justify-center bg-[#161616] px-4">
                <h1 className="text-center text-lg text-[#f5f5f5] sm:text-xl md:text-2xl">Loading...</h1>
            </main>
        )
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

export default Protected
