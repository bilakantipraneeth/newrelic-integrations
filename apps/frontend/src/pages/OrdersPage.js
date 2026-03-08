import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8085/api/v1/payments/history/user-123')
            .then(res => setTransactions(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const statusStyle = (status) => ({
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        background: status === 'SUCCESS' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
        color: status === 'SUCCESS' ? 'var(--success)' : 'var(--danger)',
        border: `1px solid ${status === 'SUCCESS' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(220, 38, 38, 0.2)'}`
    });

    return (
        <div className="page-container animate-fade">
            <header style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '12px', color: 'var(--text-main)' }}>Transaction Ledger</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Audited historical record of all verified bookings and settlements.</p>
            </header>

            {loading ? (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-card" style={{ height: '100px', animation: 'pulse-ring 2s infinite', background: 'var(--surface)' }} />
                    ))}
                </div>
            ) : transactions.length === 0 ? (
                <div className="glass-card" style={{ padding: '80px', textAlign: 'center', background: 'var(--surface)' }}>
                    <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛡️</div>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '12px', fontSize: '24px' }}>No records discovered</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Your financial history is currently empty.</p>
                </div>
            ) : (
                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg)', borderBottom: '1.5px solid var(--border)' }}>
                                <th style={{ padding: '24px', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reference</th>
                                <th style={{ padding: '24px', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Valuation</th>
                                <th style={{ padding: '24px', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                                <th style={{ padding: '24px', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }} className="table-row-hover">
                                    <td style={{ padding: '24px' }}>
                                        <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '15px' }}>{tx.orderId}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '6px' }}>TXN: {String(tx.id).substring(0, 16)}</div>
                                    </td>
                                    <td style={{ padding: '24px' }}>
                                        <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '18px' }}>₹{(tx.amount * 83).toFixed(2)}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '6px' }}>{tx.amount.toFixed(2)} USD</div>
                                    </td>
                                    <td style={{ padding: '24px' }}>
                                        <span style={statusStyle(tx.status)}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '24px' }}>
                                        <div style={{ color: 'var(--text-main)', fontSize: '14px', fontWeight: '700' }}>{new Date(tx.timestamp).toLocaleDateString()}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>{new Date(tx.timestamp).toLocaleTimeString()}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`
                .table-row-hover:hover {
                    background: var(--bg);
                }
            `}</style>
        </div>
    );
};

export default OrdersPage;
