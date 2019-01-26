import Link from 'next/link'
import { withRouter } from 'next/router'

const Header = ({ router: { pathname } }) => (
  <header>
    <Link prefetch href="/">
      <a className={pathname === '/' ? 'is-active' : ''}>Home</a>
    </Link>
    <Link prefetch href="/about">
      <a className={pathname === '/about' ? 'is-active' : ''}>About</a>
    </Link>
    <Link prefetch href="/posts">
      <a className={pathname === '/posts' ? 'is-active' : ''}>
        Posts (combined, triggers error)
      </a>
    </Link>
    <Link prefetch href="/posts_split">
      <a className={pathname === '/posts_split' ? 'is-active' : ''}>
        Posts (split, no error)
      </a>
    </Link>
    <style jsx>{`
      header {
        margin-bottom: 25px;
      }
      a {
        font-size: 14px;
        margin-right: 15px;
        text-decoration: none;
      }
      .is-active {
        text-decoration: underline;
      }
    `}</style>
  </header>
)

export default withRouter(Header)
