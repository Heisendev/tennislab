import { BarChart2, CalendarPlus, Clock, LayoutDashboard, Users, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

import { useAuth } from '@providers/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', labelKey: 'navigation.home',       Icon: LayoutDashboard, end: true },
  { to: '/matches/live',   labelKey: 'navigation.liveTracker', Icon: Zap, end: true },
  { to: '/matches',   labelKey: 'navigation.matches',    Icon: Clock, end: true },
  { to: '/players',   labelKey: 'navigation.players',    Icon: Users, end: true },
  { to: '/matches',   labelKey: 'navigation.statistics', Icon: BarChart2, end: true },
  { to: '/newmatch',  labelKey: 'navigation.newMatch',   Icon: CalendarPlus, end: true },
] as const;

export function Sidebar() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <aside
      className="hidden md:flex flex-col h-screen sticky top-0 shrink-0"
      style={{ width: 220, background: 'var(--dark-900)' }}
    >
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#fff',
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}
        >
          TennisTracker
        </div>
        <div
          style={{
            fontSize: '0.62rem',
            color: 'var(--clay-400)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 700,
            marginTop: 2,
          }}
        >
          Pro
        </div>
      </div>

      {/* Section label */}
      <div
        style={{
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          padding: '14px 20px 4px',
        }}
      >
        Menu
      </div>

      {/* Nav */}
      <nav className="flex flex-col">
        {NAV_ITEMS.map(({ to, labelKey, Icon, ...rest }, i) => (
          <NavLink
            key={`${to}-${i}`}
            to={to}
            end={'end' in rest ? rest.end : undefined}
            className={({ isActive }) =>
              [
                'flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium transition-all duration-150 border-l-2 select-none',
                isActive
                  ? 'text-white border-[var(--clay-400)] bg-white/[0.08]'
                  : 'text-white/50 border-transparent hover:text-white/85 hover:bg-white/[0.04]',
              ].join(' ')
            }
          >
            <Icon size={15} strokeWidth={1.6} />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div
        className="mt-auto px-5 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center shrink-0 rounded-full text-sm font-semibold"
            style={{
              width: 32,
              height: 32,
              background: 'var(--clay-300)',
              color: 'var(--clay-800)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
              {user?.username}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>
              Pro Member
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
    