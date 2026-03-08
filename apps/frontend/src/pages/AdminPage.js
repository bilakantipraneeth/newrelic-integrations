import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, createProduct, getAllProducts, deleteProduct } from '../services/ingestionService';

const AdminPage = () => {
    const [view, setView] = useState('inventory');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Ingestion Form
    const [form, setForm] = useState({
        categoryId: 'MOVIE',
        name: '',
        description: '',
        imageUrl: '',
        price: '',
        metadata: {}
    });

    // Category Form
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [catForm, setCatForm] = useState({
        id: '',
        name: '',
        icon: '📦',
        description: '',
        filterKey: '',
        filterLabel: ''
    });

    const refreshData = async () => {
        setLoading(true);
        try {
            const [catRes, prodRes] = await Promise.all([getCategories(), getAllProducts()]);
            setCategories(catRes.data);
            setProducts(prodRes.data);
        } catch (err) { console.error('Data sync failed', err); }
        finally { setLoading(false); }
    };

    useEffect(() => { refreshData(); }, []);

    const handleIngest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...form, price: parseFloat(form.price) };
            await createProduct(form.categoryId, payload);
            setMessage({ type: 'success', text: `Asset "${form.name}" successfully integrated into ${form.categoryId} pipeline.` });
            setForm({ categoryId: form.categoryId, name: '', description: '', imageUrl: '', price: '', metadata: {} });
            refreshData();
            setView('inventory');
        } catch (err) {
            setMessage({ type: 'error', text: 'System Error: Ingestion protocol failed. Check node connectivity.' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({}), 6000);
        }
    };

    const handleCategoryIngest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...catForm, id: catForm.id.toUpperCase().replace(/\s+/g, '_') };
            await createCategory(payload);
            setMessage({ type: 'success', text: `Pipeline "${payload.name}" successfully initialized.` });
            setCatForm({ id: '', name: '', icon: '📦', description: '', filterKey: '', filterLabel: '' });
            setShowCategoryForm(false);
            refreshData();
        } catch (err) {
            setMessage({ type: 'error', text: 'Pipeline initialization failed. Ensure ID is unique.' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({}), 6000);
        }
    };

    const handleDelete = async (catId, id) => {
        if (!window.confirm('Terminate this asset from the live mesh?')) return;
        try {
            await deleteProduct(catId, id);
            refreshData();
        } catch (err) {
            setMessage({ type: 'error', text: 'Decommission failed.' });
        }
    };

    return (
        <div className="page-container animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <div>
                    <h1 style={{ fontSize: '42px', marginBottom: '8px', color: 'var(--text-main)' }}>
                        Platform Administration
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '500' }}>Orchestrate global bookings, listings, and category registries.</p>
                </div>
                <div className="glass" style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '14px' }}>
                    <button className={`btn ${view === 'inventory' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('inventory')}>Registry</button>
                    <button className={`btn ${view === 'ingestion' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('ingestion')}>Ingest Asset</button>
                    <button className={`btn ${view === 'categories' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('categories')}>Pipelines</button>
                </div>
            </div>

            {message.text && (
                <div className="glass animate-fade" style={{
                    padding: '16px 24px', borderRadius: '12px', marginBottom: '32px',
                    borderColor: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                    color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
                    background: 'rgba(0,0,0,0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>{message.type === 'success' ? '✅' : '🚨'}</span>
                        <span style={{ fontWeight: '600' }}>{message.text}</span>
                    </div>
                </div>
            )}

            <main>
                {view === 'inventory' && (
                    <div className="card glass" style={{ overflow: 'hidden', padding: '0' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '18px' }}>Asset Inventory Registry</h3>
                            <div className="badge badge-blue">{products.length} Items Live</div>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <tr>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Asset Identity</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Route</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Valuation</th>
                                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Ops</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg-offset)', border: '1px solid var(--border)' }}>
                                                    <img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" onError={(e) => { e.target.src = 'https://placehold.co/100x100/1e293b/white?text=Asset' }} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '15px' }}>{p.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.description?.substring(0, 50)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <span className="badge badge-blue" style={{ fontSize: '10px' }}>{p.categoryId}</span>
                                        </td>
                                        <td style={{ padding: '20px 24px', fontWeight: '700', color: 'var(--text-main)' }}>₹{p.price.toLocaleString()}</td>
                                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                            <button onClick={() => handleDelete(p.categoryId, p.id)} style={{ color: 'var(--danger)', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Terminate</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && <div style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>No live assets detected in the mesh.</div>}
                    </div>
                )}

                {view === 'ingestion' && (
                    <div className="animate-fade" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div className="card glass" style={{ padding: '48px' }}>
                            <div style={{ marginBottom: '40px' }}>
                                <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Resource Registration</h2>
                                <p style={{ color: 'var(--text-muted)' }}>Initialize and deploy new listings to the marketplace.</p>
                            </div>

                            <form onSubmit={handleIngest}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                                    <div className="form-group">
                                        <label className="label">Asset Identity</label>
                                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Unique Identifier Name" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Route Pipeline</label>
                                        <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
                                    <div className="form-group">
                                        <label className="label">Base Valuation (₹)</label>
                                        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" required />
                                    </div>
                                    <div className="form-group">
                                        <label className="label">Asset CDN URL</label>
                                        <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://assets.mesh.io/..." required />
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginTop: '24px' }}>
                                    <label className="label">Manifest Description</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ minHeight: '120px' }} placeholder="Detailed asset specification..." required />
                                </div>

                                <div style={{ marginTop: '48px', padding: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                    <h4 style={{ fontSize: '14px', marginBottom: '24px', color: 'var(--text-main)' }}>Extended Specification Metadata</h4>

                                    {form.categoryId === 'MOVIE' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                            <div className="form-group"><label className="label">Lead Orchestrator (Director)</label><input onChange={e => setForm({ ...form, metadata: { ...form.metadata, director: e.target.value } })} /></div>
                                            <div className="form-group"><label className="label">Genre Tags</label><input onChange={e => setForm({ ...form, metadata: { ...form.metadata, genre: e.target.value.split(',') } })} placeholder="Sci-Fi, Epic" /></div>
                                        </div>
                                    )}

                                    {form.categoryId === 'RESTAURANT' && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                            <div className="form-group"><label className="label">Cuisine Profile</label><input onChange={e => setForm({ ...form, metadata: { ...form.metadata, cuisineType: e.target.value } })} /></div>
                                            <div className="form-group"><label className="label">Geospatial Address</label><input onChange={e => setForm({ ...form, metadata: { ...form.metadata, address: e.target.value } })} /></div>
                                        </div>
                                    )}
                                </div>

                                <button className="btn btn-primary" style={{ width: '100%', marginTop: '48px', height: '56px', fontSize: '16px' }} disabled={loading}>
                                    {loading ? 'Submitting Registration...' : 'Register New Listing'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {view === 'categories' && (
                    <div className="animate-fade">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                            <button className="btn btn-primary" onClick={() => setShowCategoryForm(!showCategoryForm)}>
                                {showCategoryForm ? 'Cancel Initialization' : '+ Initialize New Pipeline'}
                            </button>
                        </div>

                        {showCategoryForm && (
                            <div className="card glass animate-fade" style={{ padding: '32px', marginBottom: '40px', border: '1px solid var(--primary-light)' }}>
                                <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-main)' }}>Pipeline Configuration</h3>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Define the parameters for a new asset streaming pipeline.</p>

                                <form onSubmit={handleCategoryIngest}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                        <div className="form-group">
                                            <label className="label">Pipeline Name</label>
                                            <input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Experiences" required />
                                        </div>
                                        <div className="form-group">
                                            <label className="label">System ID (Auto-formatted)</label>
                                            <input value={catForm.id} onChange={e => setCatForm({ ...catForm, id: e.target.value })} placeholder="EXPERIENCE" required />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '24px', marginBottom: '24px' }}>
                                        <div className="form-group">
                                            <label className="label">Icon</label>
                                            <input value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })} placeholder="🎯" style={{ textAlign: 'center', fontSize: '20px' }} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="label">Description</label>
                                            <input value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} placeholder="Pipeline for managing unified experiences..." required />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                                        <div className="form-group">
                                            <label className="label">Frontend Filter Key</label>
                                            <input value={catForm.filterKey} onChange={e => setCatForm({ ...catForm, filterKey: e.target.value })} placeholder="e.g. activityType (must match asset metadata)" required />
                                        </div>
                                        <div className="form-group">
                                            <label className="label">Frontend Filter Label</label>
                                            <input value={catForm.filterLabel} onChange={e => setCatForm({ ...catForm, filterLabel: e.target.value })} placeholder="e.g. Activity" required />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '16px' }} disabled={loading}>
                                        {loading ? 'Initializing Pipeline...' : 'Deploy Pipeline Config'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
                            {categories.map(c => (
                                <div key={c.id} className="card glass" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ fontSize: '48px', background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px' }}>{c.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '800', fontSize: '20px', color: 'white' }}>{c.name}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Active Pipeline · ID: {c.id}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
                                        <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--success)' }}>LIVE</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPage;
