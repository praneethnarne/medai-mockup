import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo.jsx";
import DemoBadge from "./DemoBadge.jsx";

const navItems = [
  { to: "/dashboard", label: "History" },
  { to: "/detect", label: "New scan" },
];

export default function Layout({ children, wide = false }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link to="/" className="shrink-0 rounded-sm">
            <Logo />
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex min-h-11 items-center rounded-md px-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent-wash text-accent-dark"
                      : "text-muted hover:bg-ground hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="ms-auto">
            <DemoBadge />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div
          className={`mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 ${
            wide ? "max-w-6xl" : "max-w-4xl"
          }`}
        >
          {children}
        </div>
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 text-xs leading-relaxed text-muted sm:px-6">
          MEdAI — final-year project, MLR Institute of Technology. Interface mockup with
          simulated inference; no trained model is connected.
        </div>
      </footer>
    </div>
  );
}
