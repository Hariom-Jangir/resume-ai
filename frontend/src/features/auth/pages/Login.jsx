import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import '../auth.form.scss'
import { useAuth } from '../hooks/useAuth'
import { AppNavbar } from '../../../shared/components/AppNavbar.jsx'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await handleLogin({ email, password })
        if (result?.success) {
            navigate('/')
            return
        }
        window.alert(result?.message || 'Login failed. Please check your credentials.')
    }

    if (loading) {
        return (
            <>
                <AppNavbar />
                <main className="flex min-h-[calc(100vh-3.5rem)] w-full max-w-full items-center justify-center bg-[#161616] px-4 py-8">
                    <h1 className="text-center text-lg text-[#f5f5f5] sm:text-xl md:text-2xl">Loading...</h1>
                </main>
            </>
        )
    }

    return (
        <>
            <AppNavbar />
            <main className="flex min-h-[calc(100vh-3.5rem)] w-full max-w-full items-center justify-center bg-[#161616] px-4 py-6 sm:px-5 sm:py-8 md:px-6">
                <div className="form-container w-full max-w-md min-w-0">
                    <h1 className="text-center text-2xl font-semibold text-[#f5f5f5] sm:text-left sm:text-3xl md:text-4xl">Login</h1>
                    <form className="flex w-full min-w-0 flex-col gap-3 sm:gap-4" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter email address"
                                className="w-full max-w-full min-w-0"
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                placeholder="Enter password"
                                className="w-full max-w-full min-w-0"
                            />
                        </div>
                        <button type="submit" className="button primary-button mt-1 w-full md:mt-2 md:w-auto md:self-start">Login</button>
                    </form>
                    <p className="text-center text-sm text-[#f5f5f5] sm:text-left sm:text-base">
                        Don&apos;t have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </main>
        </>
    )
}

export default Login
