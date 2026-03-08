import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { processPayment, createBooking } from '../services/bookingService';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingData } = location.state || {};
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [card, setCard] = useState({ number: '', expiry: '', cvc: '' });
    const [confirmedId, setConfirmedId] = useState(null);

    if (!bookingData) {
        return (
            <div style={{ padding: '120px 40px', textAlign: 'center' }} className="fade-in">
                <div style={{ fontSize: '80px', marginBottom: '32px' }}>🛡️</div>
                <h2 style={{ marginBottom: '16px', fontSize: '32px', color: 'var(--text-main)' }}>Secure Session Required</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Your booking context has expired or is invalid. Please restart the reservation process.</p>
                <button className="btn-primary" onClick={() => navigate('/bookings')}>
                    Return to Discovery
                </button>
            </div>
        );
    }

    const pd = bookingData.productDetails || {};
    const m = pd.metadata || {};
    const price = bookingData.price || pd.price || 0;
    const inrPrice = (price * 83).toFixed(2);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const paymentRes = await processPayment({
                orderId: `NB-${Date.now()}`,
                userId: 'user-123',
                amount: price
            });

            if (paymentRes.data.status === 'SUCCESS') {
                const now = new Date();
                const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
                const bookingRes = await createBooking({
                    userId: 'user-123',
                    resourceId: bookingData.resourceId,
                    category: bookingData.category,
                    title: bookingData.title,
                    startTime: now.toISOString(),
                    endTime: end.toISOString(),
                    status: 'CONFIRMED',
                    metadata: bookingData.metadata || '{}'
                });
                setConfirmedId(bookingRes.data.id);
                setStep(3);
            } else {
                alert('Gateway Transaction Refused. Please verify payment credentials.');
            }
        } catch (err) {
            console.error(err);
            alert('Service Uplink Failure: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const StepIndicator = () => (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '64px', padding: '0 40px' }}>
            {['Asset Review', 'Secure Settlement', 'Verification'].map((label, i) => (
                <React.Fragment key={i}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '900', fontSize: '15px',
                            background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'var(--surface-dark)',
                            color: 'white',
                            border: '2px solid',
                            borderColor: step === i + 1 ? 'var(--primary-light)' : 'var(--border)',
                            transition: 'var(--transition)',
                            zIndex: 2
                        }}>{step > i + 1 ? '✓' : i + 1}</div>
                        <div style={{
                            fontSize: '12px',
                            color: step >= i + 1 ? 'var(--text-main)' : 'var(--text-dim)',
                            marginTop: '12px',
                            fontWeight: step === i + 1 ? '800' : '600',
                            position: 'absolute',
                            top: '48px',
                            whiteSpace: 'nowrap'
                        }}>{label}</div>
                    </div>
                    {i < 2 && <div style={{
                        flex: 1,
                        height: '2px',
                        background: step > i + 1 ? 'var(--success)' : 'var(--border)',
                        margin: '0 16px',
                        transition: 'var(--transition)'
                    }} />}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="page-container animate-fade" style={{ maxWidth: '800px' }}>
            <StepIndicator />

            <div className="glass-card" style={{ padding: '48px', marginTop: '40px', background: 'var(--surface)' }}>
                {/* Step 1: Summary */}
                {step === 1 && (
                    <div>
                        <h2 style={{ marginBottom: '32px', fontSize: '26px', color: 'var(--text-main)' }}>Settlement Review</h2>

                        <div style={{ display: 'flex', gap: '28px', marginBottom: '40px', alignItems: 'center' }}>
                            {pd.imageUrl && (
                                <div style={{ width: '140px', height: '140px', borderRadius: '20px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                                    <img src={pd.imageUrl} alt={bookingData.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                            <div>
                                <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.1em' }}>{bookingData.category} DISCOVERY</div>
                                <h3 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--text-main)' }}>{bookingData.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>{pd.description?.substring(0, 120)}...</p>
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg)', padding: '32px', borderRadius: '20px', marginBottom: '40px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
                                <span style={{ color: 'var(--text-body)' }}>Base Valuation</span>
                                <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>₹{inrPrice}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
                                <span style={{ color: 'var(--text-body)' }}>Platform Utilization</span>
                                <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>₹0.00</span>
                            </div>
                            <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '18px' }}>Gross Total</span>
                                <span style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '32px' }}>₹{inrPrice}</span>
                            </div>
                        </div>

                        <button className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '16px' }} onClick={() => setStep(2)}>
                            Authorize Settlement ➔
                        </button>
                    </div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                    <div className="animate-fade">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                🔒
                            </div>
                            <h2 style={{ fontSize: '28px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Secure Payment Gateway</h2>
                        </div>
                        <p style={{ color: 'var(--success)', fontSize: '15px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                            <span style={{ fontSize: '18px' }}>✓</span> Enterprise encryption active. Data is not persisted.
                        </p>

                        {/* Credit Card Graphic Layout */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                            border: '1px solid var(--border)',
                            borderRadius: '24px',
                            padding: '32px',
                            marginBottom: '48px',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                        }}>
                            {/* Decorative background blur */}
                            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.3, zIndex: 0 }} />

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                    <div style={{ width: '50px', height: '35px', background: 'linear-gradient(135deg, #eab308 0%, #a16207 100%)', borderRadius: '6px', opacity: 0.8 }} />
                                    <div style={{ fontSize: '32px', color: 'var(--text-muted)' }}>💳</div>
                                </div>

                                <div style={{ marginBottom: '28px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.1em' }}>Primary Instrument Number</label>
                                    <input
                                        style={{ width: '100%', fontFamily: 'monospace', fontSize: '22px', letterSpacing: '0.15em', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px', color: 'var(--text-main)' }}
                                        placeholder="XXXX XXXX XXXX XXXX"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.1em' }}>Identity on Instrument</label>
                                        <input
                                            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px', fontSize: '16px', textTransform: 'uppercase', color: 'var(--text-main)' }}
                                            placeholder="AS APPEARS ON CARD"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.1em' }}>Expiry</label>
                                        <input
                                            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px', fontSize: '16px', color: 'var(--text-main)', textAlign: 'center' }}
                                            placeholder="MM/YY"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.1em' }}>
                                            CVV <span style={{ fontSize: '14px', color: 'var(--text-dim)' }} title="3 digits on back of card">ⓘ</span>
                                        </label>
                                        <input
                                            style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', padding: '16px', borderRadius: '12px', fontSize: '16px', color: 'var(--text-main)', textAlign: 'center', letterSpacing: '0.2em' }}
                                            placeholder="•••"
                                            type="password"
                                            maxLength={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'var(--bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>Total Amount to Pay</div>
                                <div style={{ fontSize: '28px', color: 'var(--text-main)', fontWeight: '900' }}>₹{inrPrice}</div>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textAlign: 'right' }}>
                                Includes all taxes <br /> and platform fees.
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button className="btn-secondary" style={{ flex: 1, padding: '18px', fontSize: '16px', fontWeight: '700' }} onClick={() => setStep(1)}>
                                ← Back
                            </button>
                            <button
                                className="btn-primary"
                                style={{
                                    flex: 2,
                                    padding: '18px',
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    boxShadow: '0 10px 25px var(--primary-light)'
                                }}
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? 'Processing Securely...' : `Pay ₹${inrPrice} Securely`}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Done */}
                {step === 3 && (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            background: 'rgba(5, 150, 105, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '52px',
                            margin: '0 auto 40px',
                            border: '3px solid var(--success)'
                        }}>✓</div>
                        <h2 style={{ marginBottom: '16px', fontSize: '30px', color: 'var(--text-main)' }}>Settlement Verified</h2>
                        <p style={{ color: 'var(--text-body)', marginBottom: '48px', fontSize: '16px', lineHeight: '1.6' }}>
                            Reservation for <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{bookingData.title}</span> has been confirmed.
                            Electronic ledger entry dispatching to system profile.
                        </p>

                        <div className="glass-card" style={{ padding: '24px', marginBottom: '48px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.1em' }}>Digital Receipt ID</div>
                            <div style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '2px', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                                {confirmedId ? String(confirmedId).toUpperCase() : 'TXN-SUCCESS'}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <button className="btn-primary" onClick={() => navigate('/orders')}>View Ledger</button>
                            <button className="btn-secondary" onClick={() => navigate('/bookings')}>Explore Network</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
