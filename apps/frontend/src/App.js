import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import AnalyticsPage from './pages/AnalyticsPage';

/* --- UI COMPONENTS --- */

const UserSettings = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '14px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>
            PR
        </div>
        <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.02em' }}>Praneeth</div>
            <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
                ONLINE
            </div>
        </div>
    </div>
);

const NavLink = ({ to, icon, label, collapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className={`nav-link ${isActive ? 'active' : ''}`} title={collapsed ? label : ''}>
            <span style={{ fontSize: '18px' }}>{icon}</span>
            {!collapsed && <span>{label}</span>}
        </Link>
    );
};

const Sidebar = ({ collapsed, setCollapsed }) => (
    <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: '32px 24px', marginBottom: '16px' }}>
            {!collapsed && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: '900', fontSize: '18px' }}>P</div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>Booking Platform</h2>
                </div>
            )}
            <button
                onClick={() => setCollapsed(!collapsed)}
                style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px', padding: '8px', borderRadius: '8px' }}
            >
                {collapsed ? '▶' : '◀'}
            </button>
        </div>

        <div className="nav-section">
            <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <NavLink to="/" icon="🏠" label="Command Center" collapsed={collapsed} />
                <NavLink to="/bookings" icon="🛒" label="Asset Marketplace" collapsed={collapsed} />
                <NavLink to="/orders" icon="📋" label="Transaction Ledger" collapsed={collapsed} />
                <NavLink to="/analytics" icon="📊" label="Business Intelligence" collapsed={collapsed} />
                <NavLink to="/admin" icon="⚙️" label="Platform Admin" collapsed={collapsed} />
            </div>
        </div>

        {!collapsed && (
            <div style={{ marginTop: 'auto', padding: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>System Info</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
                        <span style={{ fontSize: '12px', color: 'white' }}>Service Node: Active</span>
                    </div>
                </div>
            </div>
        )}
    </aside>
);

const Header = () => (
    <header className="top-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</div>
            </div>
            <UserSettings />
        </div>
    </header>
);

const Dashboard = () => (
    <div className="page-container animate-fade">
        <div style={{ marginBottom: '48px' }}>
            <h1 style={{ fontSize: '42px', marginBottom: '8px' }}>Platform Overview</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Unified dashboard for asset management and transaction flow.</p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            {[
                { label: 'Global Reservations', value: '1,429', sub: 'Last 7 Days', color: 'var(--primary)' },
                { label: 'Platform Revenue', value: '₹4.2M', sub: '↑ 12% vs Last Month', color: 'var(--success)' },
                { label: 'Active Users', value: '842', sub: 'Currently Online', color: 'var(--info)' },
            ].map((stat, i) => (
                <div key={i} className="glass-card fade-in" style={{ padding: '24px', animationDelay: `${i * 0.1}s` }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: '800' }}>
                        {stat.label}
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)', marginBottom: '8px', textShadow: `0 0 20px ${stat.color}40` }}>
                        {stat.value}
                    </div>
                    <div style={{ fontSize: '13px', color: stat.color, fontWeight: '600' }}>
                        {stat.sub}
                    </div>
                </div>
            ))}
        </div>
    </div>
);


function App() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Router>
            <div className={`app-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <div className="main-wrapper">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/bookings" element={<BookingPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
