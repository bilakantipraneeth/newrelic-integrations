import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getProductsByCategory } from '../services/ingestionService';

/* ── HELPERS ────────────────────────────────────────── */
const deriveSubcats = (products, filterKey) => {
    if (!filterKey || !products.length) return [];
    const set = new Set();
    products.forEach(p => {
        const val = p.metadata?.[filterKey];
        if (Array.isArray(val)) val.forEach(v => set.add(v));
        else if (val) set.add(val);
    });
    return ['All', ...Array.from(set).sort()];
};

const matchSub = (product, filterKey, subcat) => {
    if (!subcat || subcat === 'All') return true;
    const val = product.metadata?.[filterKey];
    if (Array.isArray(val)) return val.some(v => v.toLowerCase() === subcat.toLowerCase());
    return (val || '').toLowerCase() === subcat.toLowerCase();
};

const sortBy = (arr, sort) => {
    const a = [...arr];
    if (sort === 'rating') return a.sort((x, y) => (y.metadata?.rating || 0) - (x.metadata?.rating || 0));
    if (sort === 'price_lo') return a.sort((x, y) => (x.price || 0) - (y.price || 0));
    if (sort === 'price_hi') return a.sort((x, y) => (y.price || 0) - (x.price || 0));
    return a;
};

const SORTS = [
    { v: 'default', l: 'Recommended' },
    { v: 'rating', l: 'Top Rated' },
    { v: 'price_lo', l: 'Price: Low → High' },
    { v: 'price_hi', l: 'Price: High → Low' },
];

/* ── CARD COMPONENTS ────────────────────────────────── */

const CardWrapper = ({ children, onView, onBook, price, rating }) => (
    <div className="glass-card fade-in"
        onClick={onView}
        style={{
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            height: '100%',
            background: 'var(--surface)',
            border: '1px solid var(--border)'
        }}>
        {rating && (
            <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '800',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid var(--border)'
            }}>
                ⭐ {rating}
            </div>
        )}
        {children}
        <div style={{ padding: '24px', marginTop: 'auto', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {price ? (
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>
                        ₹{price}<span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '400' }}> / slot</span>
                    </div>
                ) : <div />}
                <button
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '14px' }}
                    onClick={(e) => { e.stopPropagation(); onBook(); }}
                >
                    Reserve
                </button>
            </div>
        </div>
    </div>
);

const MovieCard = ({ p, onBook, onView }) => {
    const m = p.metadata || {};
    return (
        <CardWrapper onView={() => onView(p)} onBook={() => onBook(p)} rating={m.rating}>
            <div style={{ height: '340px', background: 'var(--bg)', position: 'relative' }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, var(--surface), transparent)' }} />
            </div>
            <div style={{ padding: '0 24px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text-main)' }}>{p.name}</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {Array.isArray(m.genre) ? m.genre.slice(0, 3).map(g => (
                        <span key={g} style={{ fontSize: '11px', fontWeight: '700', background: 'var(--bg)', padding: '4px 10px', borderRadius: '6px', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{g}</span>
                    )) : null}
                </div>
            </div>
        </CardWrapper>
    );
};

const RestaurantCard = ({ p, onBook, onView }) => {
    const m = p.metadata || {};
    return (
        <CardWrapper onView={() => onView(p)} onBook={() => onBook(p)} rating={m.rating} price={p.price}>
            <div style={{ height: '200px', background: 'var(--bg)' }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '24px 24px 0' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '6px', color: 'var(--text-main)' }}>{p.name}</h3>
                <div style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>{m.cuisineType}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📍 {m.address?.split(',')[0]}
                </div>
            </div>
        </CardWrapper>
    );
};

const WorkspaceCard = ({ p, onBook, onView }) => {
    const m = p.metadata || {};
    return (
        <CardWrapper onView={() => onView(p)} onBook={() => onBook(p)} price={p.price}>
            <div style={{ height: '200px', background: 'var(--bg)' }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '24px 24px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '20px', color: 'var(--text-main)' }}>{p.name}</h3>
                    <span style={{ fontSize: '11px', fontWeight: '800', background: 'var(--bg)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)' }}>{m.type}</span>
                </div>
                <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>
                    <span>👥 {m.capacity} PAX</span>
                    <span>⚡ High-Speed Wifi</span>
                </div>
            </div>
        </CardWrapper>
    );
};

/* ── MODAL COMPONENT ────────────────────────────────── */

const renderNestedValue = (value) => {
    if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            // Render array of objects (like showtimes or menuItems)
            return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    {value.map((item, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)'
                        }}>
                            {Object.entries(item).map(([k, v]) => {
                                // Skip complex nested things inside the array items for simplicity here
                                if (typeof v === 'object') return null;
                                return (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{String(v)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            );
        }
        return <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{value.join(', ')}</span>;
    }
    if (typeof value === 'boolean') {
        return <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{value ? 'Yes' : 'No'}</span>;
    }
    if (typeof value === 'object' && value !== null) {
        // Render a generic object map
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                {Object.entries(value).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                        <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{String(v)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{String(value)}</span>;
};

const AssetDetailsModal = ({ asset, onClose, onBook }) => {
    if (!asset) return null;
    const meta = asset.metadata || {};

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '24px'
        }} onClick={onClose}>
            <div className="glass-panel animate-fade" style={{
                width: '100%', maxWidth: '800px', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden', padding: 0
            }} onClick={e => e.stopPropagation()}>

                {/* Header Image Area */}
                <div style={{ position: 'relative', height: '300px', background: 'var(--bg)', flexShrink: 0 }}>
                    {asset.imageUrl && <img src={asset.imageUrl} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, var(--surface) 0%, transparent 100%)' }} />
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '24px', right: '24px',
                        background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white', width: '40px', height: '40px', borderRadius: '50%',
                        cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)'
                    }}>×</button>

                    <div style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                                <h2 style={{ fontSize: '42px', color: 'white', marginBottom: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{asset.name}</h2>
                                {asset.price > 0 && (
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                        ₹{asset.price} <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>/ slot</span>
                                    </div>
                                )}
                            </div>
                            <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '18px', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.5)' }} onClick={() => onBook(asset)}>
                                Reserve Now →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Scroll Area */}
                <div style={{ padding: '32px', overflowY: 'auto', background: 'var(--surface)', flex: 1 }}>
                    <p style={{ fontSize: '16px', color: 'var(--text-body)', lineHeight: '1.8', marginBottom: '32px' }}>
                        {asset.description || 'No description provided for this asset.'}
                    </p>

                    <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Asset Specifications</h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {Object.entries(meta).map(([key, value]) => {
                            const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            return (
                                <div key={key} style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '4px' }}>
                                        {displayKey}
                                    </div>
                                    <div style={{ fontSize: '15px' }}>
                                        {renderNestedValue(value)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ── MAIN PAGE ──────────────────────────────────────── */

const BookingPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [products, setProducts] = useState([]);
    const [viewAsset, setViewAsset] = useState(null);
    const [subcat, setSubcat] = useState('All');
    const [sort, setSort] = useState('default');
    const [search, setSearch] = useState('');
    const [loadCats, setLoadCats] = useState(true);
    const [loadProds, setLoadProds] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoadCats(true);
        getCategories()
            .then(r => {
                const cats = r.data.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
                setCategories(cats);
                if (cats.length) setSelectedCat(cats[0]);
            })
            .catch(() => setError('Connection to orchestration engine failed.'))
            .finally(() => setLoadCats(false));
    }, []);

    useEffect(() => {
        if (!selectedCat) return;
        setLoadProds(true);
        setSubcat('All');
        setSearch('');
        getProductsByCategory(selectedCat.id)
            .then(r => setProducts(r.data))
            .catch(() => { setError(`Failed to fetch ${selectedCat.name} catalog`); setProducts([]); })
            .finally(() => setLoadProds(false));
    }, [selectedCat]);

    const subcats = useMemo(() => deriveSubcats(products, selectedCat?.filterKey), [products, selectedCat]);

    const displayed = useMemo(() => {
        let list = products;
        if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase()));
        list = list.filter(p => matchSub(p, selectedCat?.filterKey, subcat));
        return sortBy(list, sort);
    }, [products, search, subcat, sort, selectedCat]);

    const handleBook = (product) => {
        navigate('/checkout', {
            state: {
                bookingData: {
                    category: selectedCat?.id,
                    categoryName: selectedCat?.name,
                    resourceId: product.id,
                    title: product.name,
                    price: product.price,
                    metadata: JSON.stringify(product.metadata || {}),
                    productDetails: product,
                }
            }
        });
    };

    const labelStyle = {
        fontSize: '11px',
        fontWeight: '800',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        marginBottom: '12px',
        display: 'block',
        letterSpacing: '0.05em'
    };

    return (
        <div className="page-container animate-fade">
            {/* Category Navigation */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '48px',
                padding: '4px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '18px',
                width: 'fit-content',
                border: '1px solid var(--border)'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCat(cat)}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '14px',
                            border: 'none',
                            background: selectedCat?.id === cat.id ? 'var(--primary)' : 'transparent',
                            color: selectedCat?.id === cat.id ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontWeight: '700',
                            transition: 'var(--transition)',
                            fontSize: '14px'
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '48px', alignItems: 'flex-start' }}>
                {/* Filters Sidebar */}
                <aside style={{ position: 'sticky', top: '128px' }}>
                    <div className="glass-card" style={{ padding: '32px' }}>
                        <div style={{ marginBottom: '32px' }}>
                            <label style={labelStyle}>Search Catalog</label>
                            <input
                                type="text"
                                placeholder="Filter records..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ width: '100%', background: 'var(--bg)' }}
                            />
                        </div>

                        {subcats.length > 1 && (
                            <div style={{ marginBottom: '32px' }}>
                                <label style={labelStyle}>{selectedCat?.filterLabel || 'Classify'}</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {subcats.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setSubcat(s)}
                                            style={{
                                                textAlign: 'left',
                                                padding: '10px 16px',
                                                borderRadius: '10px',
                                                background: subcat === s ? 'var(--bg)' : 'transparent',
                                                color: subcat === s ? 'var(--primary)' : 'var(--text-body)',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: subcat === s ? '800' : '500',
                                                transition: 'var(--transition)'
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label style={labelStyle}>Sort Preference</label>
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                                style={{ width: '100%', background: 'var(--bg)' }}
                            >
                                {SORTS.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--text-main)' }}>{selectedCat?.name}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{selectedCat?.description}</p>
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '700' }}>
                            {displayed.length} ASSETS DISCOVERED
                        </div>
                    </div>

                    {loadProds ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="glass-card" style={{ height: '400px', animation: 'pulse-ring 2s infinite', background: 'var(--bg)' }} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
                            {displayed.map(p => {
                                if (selectedCat?.id === 'MOVIE') return <MovieCard key={p.id} p={p} onBook={handleBook} onView={setViewAsset} />;
                                if (selectedCat?.id === 'RESTAURANT') return <RestaurantCard key={p.id} p={p} onBook={handleBook} onView={setViewAsset} />;
                                if (selectedCat?.id === 'WORKSPACE') return <WorkspaceCard key={p.id} p={p} onBook={handleBook} onView={setViewAsset} />;
                                return (
                                    <CardWrapper key={p.id} onView={() => setViewAsset(p)} onBook={() => handleBook(p)} price={p.price}>
                                        <div style={{ height: '200px', background: 'var(--bg)' }}>
                                            <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ padding: '24px 24px 0' }}>
                                            <h3 style={{ fontSize: '20px', marginBottom: '10px', color: 'var(--text-main)' }}>{p.name}</h3>
                                            <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: '1.5' }}>{p.description}</p>
                                        </div>
                                    </CardWrapper>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <AssetDetailsModal
                asset={viewAsset}
                onClose={() => setViewAsset(null)}
                onBook={handleBook}
            />
        </div>
    );
};

export default BookingPage;
