import React, { useState, useEffect } from 'react';
import { getBookings } from '../services/bookingService';

const AnalyticsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBookings()
            .then(res => setBookings(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const processData = () => {
        const stats = {
            byCategory: {},
            byDate: {},
            byAsset: {},
            totalRevenue: 0
        };

        bookings.forEach(b => {
            // Category count
            const cat = b.category || 'Uncategorized';
            stats.byCategory[cat] = (stats.byCategory[cat] || 0) + 1;

            // Date count
            if (b.startTime) {
                const date = new Date(b.startTime).toLocaleDateString();
                stats.byDate[date] = (stats.byDate[date] || 0) + 1;
            }

            // Asset count
            const title = b.title || 'Unknown Asset';
            stats.byAsset[title] = (stats.byAsset[title] || 0) + 1;
        });

        return stats;
    };

    const stats = processData();

    const StatCard = ({ title, value, icon, color }) => (
        <div className="glass-card" style={{ padding: '24px', flex: 1, minWidth: '200px', borderLeft: `4px solid ${color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>{icon}</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-main)' }}>{value}</div>
        </div>
    );

    const ProgressBar = ({ label, current, total, color }) => {
        const percentage = total > 0 ? (current / total) * 100 : 0;
        return (
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{label}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{current} Units ({Math.round(percentage)}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--bg)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: color, transition: 'width 1s ease-out' }} />
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="page-container animate-fade">
                <div style={{ padding: '40px' }}>
                    <div className="glass-card" style={{ height: '300px', animation: 'pulse-ring 2s infinite' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="page-container animate-fade">
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '12px', color: 'var(--text-main)' }}>Business Intelligence</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Real-time analytics on platform utilization, category performance, and ledger growth.</p>
            </header>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '48px', flexWrap: 'wrap' }}>
                <StatCard title="Total Reservations" value={bookings.length} icon="📈" color="var(--primary)" />
                <StatCard title="Confirmed Assets" value={bookings.filter(b => b.status === 'CONFIRMED').length} icon="✅" color="var(--success)" />
                <StatCard title="Active Categories" value={Object.keys(stats.byCategory).length} icon="🗂️" color="#8b5cf6" />
                <StatCard title="Unique Timepoints" value={Object.keys(stats.byDate).length} icon="📅" color="#ec4899" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Category Performance */}
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '32px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: 'var(--primary)' }}>📊</span> Sector Utilization
                    </h3>
                    {['MOVIES', 'WORKSPACES', 'RESTAURANTS'].map((cat, i) => (
                        <ProgressBar
                            key={cat}
                            label={cat}
                            current={stats.byCategory[cat] || 0}
                            total={bookings.length}
                            color={i === 0 ? 'var(--primary)' : i === 1 ? '#8b5cf6' : '#ec4899'}
                        />
                    ))}
                </div>

                {/* Top Assets */}
                <div className="glass-panel" style={{ padding: '32px' }}>
                    <h3 style={{ marginBottom: '32px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: 'var(--success)' }}>🏆</span> Top Performing Assets
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {Object.entries(stats.byAsset)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([name, count]) => (
                                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{name}</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: '900' }}>{count} Bookings</span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* By Date */}
                <div className="glass-panel" style={{ padding: '32px', gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '32px', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#10b981' }}>📅</span> Daily Reservation Velocity
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '150px', padding: '0 20px' }}>
                        {Object.entries(stats.byDate).slice(-15).map(([date, count]) => (
                            <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '100%',
                                    height: `${(count / Math.max(...Object.values(stats.byDate))) * 100}%`,
                                    background: 'var(--primary)',
                                    borderRadius: '4px 4px 0 0',
                                    minHeight: '4px',
                                    opacity: 0.8
                                }} />
                                <span style={{ fontSize: '10px', color: 'var(--text-dim)', transform: 'rotate(-45deg)', whiteSpace: 'nowrap', marginTop: '10px' }}>{date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
