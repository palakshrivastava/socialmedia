import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="page-shell">
      <Navbar />
      <section className="not-found-card">
        <p className="not-found-kicker">404</p>
        <h1>Page not found</h1>
        <p>
          The route you tried to reach does not exist. Head back to the feed or re-login to keep exploring.
        </p>
        <Link to="/feed" className="not-found-link">
          Go back home
        </Link>
      </section>
    </div>
  )
}
