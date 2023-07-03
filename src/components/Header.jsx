import classNames from 'classnames'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/js/src/collapse'
import { ReactComponent as MailumSVG } from '@/assets/mailum.svg'
import { ReactComponent as NavbarToggleSVG } from '@/assets/navbar-toggle-icon.svg'
import styles from './Header.module.scss'

export default function Header({ variant = 'default' }) {
  const [scrollTop, setScrollTop] = useState(0)
  const [navbarExpanded, setNavbarExpanded] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrollTop(window.pageYOffset || document.documentElement.scrollTop)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={classNames(
      styles.header,
      'sticky-top',
      scrollTop > 0 && 'shadow-lg',
      variant == 'primary' ? 'bg-primary text-bg-primary' : 'bg-body'
    )}>
      <div className='container'>
        
        <nav className={classNames('navbar py-3 navbar-expand-lg', styles.navbar, navbarExpanded && styles.expanded)}>
          <div className={styles.headline}>
            <a href="/" className='text-reset'>
              <MailumSVG className={styles.brand} />
            </a>

            <a 
              className={classNames(
                styles.tryButton,
                'btn small fw-bold d-lg-none',
                variant == 'primary' ? 'btn-light' : 'btn-primary'
              )}
            >Create Email Account</a>

            <button 
              onClick={() => {
                setNavbarExpanded(!navbarExpanded)
              }}
              onTouchEnd={(event) => {
                setNavbarExpanded(!navbarExpanded)
                event.preventDefault()
              }}
              className={classNames(
                variant == 'primary' ? 'text-light': 'text-body',
                'btn btn-link d-flex border-0 outline-0 px-0 d-lg-none'
              )}
              type="button"
            >
              <NavbarToggleSVG />
            </button>
          </div>

          <div className='navbar-extra' id='navbarExtra'>
            <ul className='navbar-nav flex-grow-1 justify-content-center mb-md-0 small'>
              <li className='navbar-item fw-medium'><Link to="/pricing" className='nav-link px-2 text-reset'>Pricing</Link></li>
              <li className='navbar-item fw-medium'><a href="#" className='nav-link px-2 text-reset'>GitHub</a></li>
              <li className='navbar-item fw-medium'><Link to="/company" className='nav-link px-2 text-reset'>Company</Link></li>
              <li className='navbar-item fw-medium'><Link to="/faq" className='nav-link px-2 text-reset'>FAQ</Link></li>
              <li className='navbar-item fw-medium'><Link to="/contact-us" className='nav-link px-2 text-reset'>Contact</Link></li>
            </ul>
            
            <ul className='navbar-nav buttons'>
              <li>
                <a
                  href="/mailbox/#login" 
                  type="button" 
                  className={classNames(
                    'btn fw-bold me-2 text-nowrap',
                    variant == 'primary' ? 'btn-primary bg-light bg-opacity-10' : 'btn-outline-primary border-secondary-subtle'
                  )}
                >Sign In</a>
              </li>
              <li>
                <a
                  href='/mailbox/#signup' 
                  type="button" 
                  className={classNames(
                    'btn fw-bold text-nowrap',
                    variant == 'primary' ? 'btn-light' : 'btn-primary'
                  )}
                >Sign Up</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
