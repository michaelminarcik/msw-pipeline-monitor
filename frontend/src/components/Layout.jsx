import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/datasets', label: 'Datasets' },
  { to: '/pipelines', label: 'Pipelines' },
  { to: '/runs', label: 'Runs' },
  { to: '/alerts', label: 'Alerts' },
];

function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">School project</p>
          <h1>Big Data Pipeline Monitor</h1>
        </div>
        <nav className="app-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
