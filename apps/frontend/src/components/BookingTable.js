import React from 'react';

const getCategoryIcon = (cat) => {
    switch (cat) {
        case 'MOVIE': return '🎬';
        case 'RESTAURANT': return '🍽️';
        case 'WORKSPACE': return '💻';
        default: return '📅';
    }
};

const BookingTable = ({ bookings, onCancel }) => {
    const statusStyle = (status) => ({
        padding: '4px 10px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        background: status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.1)' : 
                   status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        color: status === 'CONFIRMED' ? 'var(--success)' : 
               status === 'CANCELLED' ? 'var(--danger)' : 'var(--secondary)',
        border: `1px solid ${status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.2)' : 
                             status === 'CANCELLED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
    });

    return (
        <div className="glass-card fade-in" style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Service</th>
                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Details</th>
                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Schedule</th>
                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Status</th>
                        <th style={{ padding: '20px', fontSize: '12px', fontWeight: '800', color: 'var(--text-dim)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => {
                        const metadata = booking.metadata ? JSON.parse(booking.metadata) : {};
                        return (
                            <tr key={booking.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ fontSize: '24px' }}>{getCategoryIcon(booking.category)}</div>
                                        <div>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{booking.title || 'Untitled'}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{booking.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        {metadata.seat && <div>Seat: <span style={{ color: 'var(--text-main)' }}>{metadata.seat}</span></div>}
                                        {metadata.guests && <div>Guests: <span style={{ color: 'var(--text-main)' }}>{metadata.guests}</span></div>}
                                        {metadata.table && <div>Table: <span style={{ color: 'var(--text-main)' }}>{metadata.table}</span></div>}
                                        {booking.resourceId && <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.6 }}>ID: {booking.resourceId}</div>}
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ color: 'var(--text-main)', fontSize: '14px' }}>{new Date(booking.startTime).toLocaleDateString()}</div>
                                    <div style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '4px' }}>{new Date(booking.startTime).toLocaleTimeString()}</div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={statusStyle(booking.status)}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    {booking.status !== 'CANCELLED' && (
                                        <button
                                            onClick={() => onCancel(booking.id)}
                                            style={{
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                color: 'var(--danger)',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                padding: '8px 16px',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                transition: 'var(--transition)'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {bookings.length === 0 && (
                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>📅</div>
                    No reservations found in the system.
                </div>
            )}
        </div>
    );
};

export default BookingTable;
