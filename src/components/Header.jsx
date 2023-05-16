import 'bootstrap/js/src/collapse'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import { ReactComponent as MailumSVG } from '@/assets/mailum.svg'

export default function Header({ variant = 'default' }) {
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    function onScroll() {
      setScrollTop(window.pageYOffset || document.documentElement.scrollTop)
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  return (
    <header className={classNames(
      'sticky-top',
      scrollTop > 0 && 'shadow-lg',
      variant == 'primary' ? 'bg-primary text-bg-primary' : 'bg-body'
    )}>
      <div className='container'>
        <nav className='navbar py-2 py-md-4 navbar-expand-md'>
          <a href="/" class="text-reset">
            <MailumSVG />
          </a>

          <a 
            className={classNames(
              'btn small fw-bold d-md-none',
              variant == 'primary' ? 'btn-light' : 'btn-primary'
            )}
          >Try for Free</a>

          <button 
            className={classNames(
              variant == 'primary' && 'text-light',
              'btn btn-link border-0 outline-0'
            )}
            type="button"
            data-bs-toggle='collapse'
            data-bs-target="#navbarExtra" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div className='navbar-collapse collapse' id='navbarExtra'>
            <ul class="navbar-nav flex-grow-1 justify-content-center mb-md-0  small">
              <li className='navbar-item'><a href="#" class="nav-link px-2 text-reset">Pricing</a></li>
              <li className='navbar-item'><a href="#" class="nav-link px-2 text-reset">GitHub</a></li>
              <li><a href="#" class="nav-link px-2 text-reset">Company</a></li>
              <li><a href="#" class="nav-link px-2 text-reset">Resources</a></li>
              <li><a href="#" class="nav-link px-2 text-reset">Contact</a></li>
            </ul>
            
            <div class="text-end">
              <a 
                href="/mailbox.html#login" 
                type="button" 
                className={classNames(
                  'btn small fw-bold me-2',
                  variant == 'primary' ? 'btn-primary bg-light bg-opacity-10' : 'btn-outline-primary border-secondary-subtle'
                )}
              >Sign In</a>
              <a
                href='/mailbox.html#signup' 
                type="button" 
                className={classNames(
                  'btn small fw-bold',
                  variant == 'primary' ? 'btn-light' : 'btn-primary'
                )}
              >Sign Up</a>
            </div>
          </div>
        </nav>
        </div>
    </header>
  );
}
