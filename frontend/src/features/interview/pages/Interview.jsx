import React, { useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'
import { AppNavbar } from '../../../shared/components/AppNavbar.jsx'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', shortLabel: 'Technical', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', shortLabel: 'Behavioral', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', shortLabel: 'Road map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className="q-card min-w-0 max-w-full">
            <div className="q-card__header" onClick={() => setOpen(o => !o)}>
                <span className="q-card__index">Q{index + 1}</span>
                <p className="q-card__question">{item.question}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className="q-card__body">
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--intention">Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className="q-card__section">
                        <span className="q-card__tag q-card__tag--answer">Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className="roadmap-day">
        <div className="roadmap-day__header min-w-0 flex-wrap">
            <span className="roadmap-day__badge shrink-0">Day {day.day}</span>
            <h3 className="roadmap-day__focus">{day.focus}</h3>
        </div>
        <ul className="roadmap-day__tasks">
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className="roadmap-day__bullet" />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    if (loading || !report) {
        return (
            <>
                <AppNavbar />
                <main className="flex min-h-[calc(100vh-3.5rem)] w-full max-w-full flex-col items-center justify-center gap-3 bg-[#0d1117] px-4 py-8">
                    <h1 className="text-center text-lg font-semibold text-[#e6edf3] sm:text-xl md:text-2xl">Loading your interview plan...</h1>
                </main>
            </>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    const navButton = (item) => (
        <button
            key={item.id}
            type="button"
            className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
            onClick={() => setActiveNav(item.id)}
        >
            <span className="interview-nav__icon">{item.icon}</span>
            <span className="hidden sm:inline">{item.label}</span>
            <span className="sm:hidden">{item.shortLabel}</span>
        </button>
    )

    return (
        <>
            <AppNavbar />
            <div className="interview-page w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 xl:px-6 xl:py-8">
                <div className="interview-layout flex min-w-0 max-w-full flex-col overflow-hidden xl:flex-row xl:items-stretch">

                    {/* Mobile / tablet: sections + download */}
                    <div className="flex w-full min-w-0 flex-col gap-3 border-b border-[#2a3348] p-3 sm:p-4 xl:hidden">
                        <p className="interview-nav__label mb-0 px-1">Sections</p>
                        <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
                            {NAV_ITEMS.map((item) => navButton(item))}
                        </div>
                        <button
                            type="button"
                            onClick={() => { getResumePdf(interviewId) }}
                            className="button primary-button flex w-full items-center justify-center md:w-auto md:self-start"
                        >
                            <svg className="mr-2 h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" /></svg>
                            Download Resume
                        </button>
                    </div>

                    {/* Desktop left rail */}
                    <nav className="interview-nav hidden min-h-0 w-[220px] shrink-0 xl:flex xl:flex-col">
                        <div className="nav-content flex min-h-[280px] w-full flex-col justify-between gap-4">
                            <div>
                                <p className="interview-nav__label">Sections</p>
                                {NAV_ITEMS.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                        onClick={() => setActiveNav(item.id)}
                                    >
                                        <span className="interview-nav__icon">{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => { getResumePdf(interviewId) }}
                                className="button primary-button flex w-full items-center justify-center"
                            >
                                <svg className="mr-2 h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" /></svg>
                                Download Resume
                            </button>
                        </div>
                    </nav>

                    <div className="interview-divider hidden xl:block" />

                    <main className="interview-content min-w-0 flex-1">
                        {activeNav === 'technical' && (
                            <section className="min-w-0">
                                <div className="content-header">
                                    <h2>Technical Questions</h2>
                                    <span className="content-header__count shrink-0">{report.technicalQuestions.length} questions</span>
                                </div>
                                <div className="q-list min-w-0">
                                    {report.technicalQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'behavioral' && (
                            <section className="min-w-0">
                                <div className="content-header">
                                    <h2>Behavioral Questions</h2>
                                    <span className="content-header__count shrink-0">{report.behavioralQuestions.length} questions</span>
                                </div>
                                <div className="q-list min-w-0">
                                    {report.behavioralQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'roadmap' && (
                            <section className="min-w-0">
                                <div className="content-header">
                                    <h2>Preparation Road Map</h2>
                                    <span className="content-header__count shrink-0">{report.preparationPlan.length}-day plan</span>
                                </div>
                                <div className="roadmap-list min-w-0">
                                    {report.preparationPlan.map((day) => (
                                        <RoadMapDay key={day.day} day={day} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </main>

                    <div className="interview-divider hidden xl:block" />

                    <aside className="interview-sidebar">
                        <div className="match-score w-full max-w-full">
                            <p className="match-score__label">Match Score</p>
                            <div className={`match-score__ring ${scoreColor}`}>
                                <span className="match-score__value">{report.matchScore}</span>
                                <span className="match-score__pct">%</span>
                            </div>
                            <p className="match-score__sub">Strong match for this role</p>
                        </div>

                        <div className="sidebar-divider" />

                        <div className="skill-gaps">
                            <p className="skill-gaps__label">Skill Gaps</p>
                            <div className="skill-gaps__list">
                                {report.skillGaps.map((gap, i) => (
                                    <span key={i} className={`skill-tag skill-tag--${gap.severity} max-w-full break-words`}>
                                        {gap.skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    )
}

export default Interview
