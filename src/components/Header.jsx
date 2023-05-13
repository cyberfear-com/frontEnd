import classNames from 'classnames'
import { ReactComponent as MailumSVG } from '@/assets/mailum.svg'

export default function Header({ variant = 'default' }) { 
  return (
    <header className={classNames(
      'navbar fixed-top',
      variant == 'primary' ? 'bg-primary text-bg-primary' : 'bg-body'
    )}>
      <div className="container d-flex align-items-center justify-content-between my-1 py-1">
        <a href="/" class="text-reset">
          <MailumSVG />
        </a>

        <ul class="nav flex-1 mb-md-0  small">
          <li><a href="#" class="nav-link px-2 text-reset">Pricing</a></li>
          <li><a href="#" class="nav-link px-2 text-reset">GitHub</a></li>
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
          <button 
            type="button" 
            className={classNames(
              'btn small fw-bold',
              variant == 'primary' ? 'btn-light' : 'btn-primary'
            )}
          >Sign Up</button>
        </div>
      </div>
    </header>
  );
}
