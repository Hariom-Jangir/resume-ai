import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../features/auth/hooks/useAuth'
import './AppNavbar.scss'

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
)

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
)

export function AppNavbar() {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [ menuOpen, setMenuOpen ] = useState(false)

    useEffect(() => {
        setMenuOpen(false)
    }, [ location.pathname ])

    useEffect(() => {
        if (!menuOpen) return undefined
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [ menuOpen ])

    const onLogout = async () => {
        setMenuOpen(false)
        await handleLogout()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path

    const navLinkClass = (path) =>
        `app-navbar__link${isActive(path) ? ' app-navbar__link--active' : ''}`

    const loginBtnClass = `app-navbar__btn app-navbar__btn--login${isActive('/login') ? ' app-navbar__btn--login--active' : ''}`
    const registerBtnClass = `app-navbar__btn app-navbar__btn--register${isActive('/register') ? ' app-navbar__btn--register--active' : ''}`

    return (
        <header className={`app-navbar${menuOpen ? ' app-navbar--menu-open' : ''}`}>
            <div className="app-navbar__inner">
                <Link
                    to={user ? '/' : '/login'}
                    className="app-navbar__logo"
                    onClick={() => setMenuOpen(false)}
                    aria-label="PrepAI home"
                >
                    <span className="app-navbar__logo-text">
                        Prep<span>AI</span>
                    </span>
                </Link>

                <nav className="app-navbar__nav" aria-label="Main navigation">
                    {user && (
                        <Link to="/" className={navLinkClass('/')} onClick={() => setMenuOpen(false)}>
                            Dashboard
                        </Link>
                    )}
                </nav>

                <div className="app-navbar__actions">
                    {user ? (
                        <button
                            type="button"
                            onClick={onLogout}
                            className="app-navbar__btn app-navbar__btn--ghost"
                        >
                            Log out
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className={loginBtnClass}>
                                Log in
                            </Link>
                            <Link to="/register" className={registerBtnClass}>
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <button
                    type="button"
                    className="app-navbar__toggle"
                    aria-expanded={menuOpen}
                    aria-controls="app-navbar-mobile"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    {menuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
            </div>

            <div
                id="app-navbar-mobile"
                className={`app-navbar__mobile-wrap${menuOpen ? ' app-navbar__mobile-wrap--open' : ''}`}
                aria-hidden={!menuOpen}
            >
                <div className="app-navbar__mobile-panel">
                    <div className="app-navbar__mobile-inner">
                        {user && (
                            <nav className="app-navbar__mobile-nav" aria-label="Mobile navigation">
                                <Link
                                    to="/"
                                    className={navLinkClass('/')}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            </nav>
                        )}

                        <div className="app-navbar__mobile-actions">
                            {user ? (
                                <button
                                    type="button"
                                    onClick={onLogout}
                                    className="app-navbar__btn app-navbar__btn--ghost"
                                >
                                    Log out
                                </button>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className={loginBtnClass}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className={registerBtnClass}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
