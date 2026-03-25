import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { AppUser } from "@/lib/local-auth";

interface SiteHeaderProps {
  user?: AppUser | null;
  onLogout?: () => void;
}

export default function SiteHeader({ user, onLogout }: SiteHeaderProps) {
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            P
          </div>
          <div>
            <p className="text-lg font-bold text-slate-900">Planejei</p>
            <p className="text-xs text-slate-500">organização simples para a vida real</p>
          </div>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" onClick={() => navigate("/")}>Início</Button>
          <Button variant="ghost" onClick={() => navigate("/pricing")}>Planos</Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>App</Button>
          <Button variant="ghost" onClick={() => navigate("/admin-login")}>Admin</Button>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
              <Button variant="outline" onClick={onLogout}>Sair</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => navigate("/login")}>Entrar</Button>
              <Button onClick={() => navigate("/signup")}>Começar grátis</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
