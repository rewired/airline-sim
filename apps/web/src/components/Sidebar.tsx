import Link from "next/link";

export function Sidebar() {
    const navItems = [
        { name: "Dashboard", href: "/", icon: "📊" },
        { name: "Network Planner", href: "/network", icon: "🌐" },
        { name: "Schedule Builder", href: "/schedule", icon: "📅" },
        { name: "Ops Cockpit", href: "/ops", icon: "🚨" },
        { name: "Fleet", href: "/fleet", icon: "✈️" },
    ];

    return (
        <aside className="w-64 border-r bg-card/50 hidden md:flex flex-col">
            <div className="p-4 border-b h-14 flex items-center">
                <h1 className="font-bold text-xl text-primary tracking-tight">AeroOps</h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t text-xs text-muted-foreground text-center">
                v0.1.0 MVP
            </div>
        </aside>
    )
}
