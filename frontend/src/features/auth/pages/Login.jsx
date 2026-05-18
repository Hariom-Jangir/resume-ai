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
                <main className="loading-screen">
                    <h1>Loading...</h1>
                </main>
            </>
        )
    }

    return (
        <>
            <AppNavbar />
            <main className="auth-page">
                <div className="auth-card">
                    <h1 className="auth-card__title">Login</h1>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter email address"
                                required
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
                                required
                            />
                        </div>
                        <button type="submit" className="button primary-button button--block">Login</button>
                    </form>
                    <p className="auth-card__footer">
                        Don&apos;t have an account? <Link to="/register">Register</Link>
                    </p>
                </div>
            </main>
        </>
    )
}

export default Login
