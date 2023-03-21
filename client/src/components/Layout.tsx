
import { NavLink, Outlet } from 'react-router-dom';
// Link = a
function Layout() {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/about">About</NavLink>
            </li>
            <li>
              <NavLink to="/pricing">Pricing</NavLink>
            </li>
            <li>
              <NavLink to="/nothing-here">Nothing Here</NavLink>
            </li>
          </ul>
        </nav>
  
        <hr />
  
        <Outlet />
      </div>
    );
  }

  export default Layout

  //NavLink daet dobavlenie "active' v klasse )( v Inspect)