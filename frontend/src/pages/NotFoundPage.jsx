import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <section className="not-found-card card">
        <p className="not-found-kicker">404</p>
        <h1>Page not found</h1>
        <p>
          The page you&apos;re looking for doesn&apos;t exist or was moved.
        </p>
        <Link to="/" className="btn btn--primary not-found-link">
          Back to home
        </Link>
      </section>
    </div>
  )
}
