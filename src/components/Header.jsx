import 'bootstrap/js/src/collapse'
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import { ReactComponent as MailumSVG } from '@/assets/mailum.svg'
import { ReactComponent as NavbarToggleSVG } from '@/assets/navbar-toggle-icon.svg'

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
    <>
      {/* Helper making header taller when scrolled to top. */}
      <div className={classNames(
        'pt-4 pb-2 d-md-none',
        variant === 'primary' ? 'bg-primary' : ''
      )}></div>

      <header className={classNames(
        'sticky-top',
        scrollTop > 0 && 'shadow-lg',
        variant == 'primary' ? 'bg-primary text-bg-primary' : 'bg-body'
      )}>
        <div className='container'>
          {/* <div className='px-4 px-md-5'> */}
          <nav className='navbar py-3 py-md-4 navbar-expand-lg'>
            <a href="/" className='text-reset'>
              <MailumSVG />
            </a>

            <a 
              className={classNames(
                'btn small fw-bold d-lg-none',
                variant == 'primary' ? 'btn-light' : 'btn-primary'
              )}
            >Try for Free</a>

            <button 
              className={classNames(
                variant == 'primary' ? 'text-light': 'text-body',
                'btn btn-link d-flex border-0 outline-0 px-0 d-lg-none'
              )}
              type="button"
              data-bs-toggle='collapse'
              data-bs-target="#navbarExtra" 
              aria-controls="navbarSupportedContent" 
              aria-expanded="false" aria-label="Toggle navigation"
            >
              <NavbarToggleSVG />
            </button>

            <div className='navbar-collapse collapse' id='navbarExtra'>
              <ul class="navbar-nav flex-grow-1 justify-content-center mb-md-0 small">
                <li className='navbar-item'><a href="#" class="nav-link px-2 text-reset">Pricing</a></li>
                <li className='navbar-item'><a href="#" class="nav-link px-2 text-reset">GitHub</a></li>
                <li><a href="#" class="nav-link px-2 text-reset">Company</a></li>
                <li><a href="#" class="nav-link px-2 text-reset">Resources</a></li>
                <li><a href="#" class="nav-link px-2 text-reset">Contact</a></li>
              </ul>
              
              <ul className='navbar-nav'>
                <li>
                  <a
                    href="/mailbox.html#login" 
                    type="button" 
                    className={classNames(
                      'btn fw-bold me-2 text-nowrap',
                      variant == 'primary' ? 'btn-primary bg-light bg-opacity-10' : 'btn-outline-primary border-secondary-subtle'
                    )}
                  >Sign In</a>
                </li>
                <li>
                  <a
                    href='/mailbox.html#signup' 
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
          {/* </div> */}
        </div>
      </header>
    </>
  );
}
