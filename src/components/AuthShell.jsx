import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

export default function AuthShell({ title, children, footer }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-8">
        <Logo />
      </Link>

      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-6 sm:p-7">
        <h1 className="mb-1 text-xl font-semibold">{title}</h1>
        <p className="mb-6 rounded-md border border-prompt/30 bg-prompt-wash px-3 py-2 text-xs leading-relaxed text-prompt">
          Interface mockup. Authentication is not implemented — no credentials are
          validated or stored, and any button here just continues.
        </p>
        {children}
      </div>

      <p className="mt-6 text-sm text-muted">{footer}</p>
    </div>
  );
}
