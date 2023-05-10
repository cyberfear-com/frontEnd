import MailumLogo from '@/assets/mailum.svg'

export default function Header() {
  return (
    <header className="navbar bg-body-tertiary fixed-top shadow-sm">
      <div class="container d-flex align-items-center justify-content-between my-1 py-1">
        <a href="/">
          <img src={MailumLogo} />
        </a>

        <ul class="nav flex-1 mb-md-0  small">
          <li><a href="#" class="nav-link px-2 link-secondary">Pricing</a></li>
          <li><a href="#" class="nav-link px-2 link-secondary">GitHub</a></li>
          <li><a href="#" class="nav-link px-2 link-secondary">Company</a></li>
          <li><a href="#" class="nav-link px-2 link-secondary">Resources</a></li>
          <li><a href="#" class="nav-link px-2 link-secondary">Contact</a></li>
        </ul>
        
        <div class="text-end">
          <a href="/mailbox.html#login" type="button" class="btn small fw-bold btn-outline-primary border-secondary-subtle me-2">Sign In</a>
          <button type="button" class="btn small fw-bold btn-primary">Sign Up</button>
        </div>
      </div>
    </header>
  );
}
