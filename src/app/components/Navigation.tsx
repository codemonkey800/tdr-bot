import { Link, LinkProps, useLocation } from '@remix-run/react'
import clsx from 'clsx'

function NavigationLocation(props: LinkProps) {
  const location = useLocation()

  return (
    <Link
      className={clsx(
        'border-b-2 pb-1',
        location.pathname === props.to
          ? 'border-purple-500'
          : 'border-transparent',
      )}
      {...props}
    />
  )
}

export function Navigation() {
  return (
    <div>
      <div className="flex items-center justify-center gap-[32px]">
        <img src="/sad-pepe.png" width="80px" />
        <p className="text-[4vw]">TDR Bot</p>
      </div>

      <nav className="flex items-center gap-2 mt-4">
        <NavigationLocation to="/">Home</NavigationLocation>
        <NavigationLocation to="/history">History</NavigationLocation>
      </nav>
    </div>
  )
}
