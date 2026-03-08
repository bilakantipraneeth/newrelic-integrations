import React, { useEffect, useState } from 'react';
import { getCategories } from '../services/bookingService';

const CategorySelector = ({ selectedCategory, onSelect }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data))
            .catch(() => {
                // Fallback to defaults if ingestion-service is down
                setCategories([
                    { id: 'MOVIE', name: 'Movies', icon: '🎬', description: 'Book tickets for the latest blockbusters' },
                    { id: 'RESTAURANT', name: 'Restaurants', icon: '🍽️', description: 'Reserve a table at your favourite spot' },
                    { id: 'WORKSPACE', name: 'Workspaces', icon: '💻', description: 'Quiet desks and meeting rooms' },
                ]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
            Loading categories...
        </div>
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {categories.map((cat) => (
                <div
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className="glass-card animate-fade"
                    style={{
                        padding: '25px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        border: selectedCategory === cat.id
                            ? '2px solid #6366f1'
                            : '1px solid rgba(255,255,255,0.1)',
                        background: selectedCategory === cat.id
                            ? 'rgba(99, 102, 241, 0.15)'
                            : 'rgba(255,255,255,0.05)',
                        transform: selectedCategory === cat.id ? 'translateY(-4px)' : 'none',
                        boxShadow: selectedCategory === cat.id ? '0 8px 30px rgba(99,102,241,0.3)' : 'none'
                    }}
                >
                    <div style={{ fontSize: '42px', marginBottom: '12px' }}>{cat.icon}</div>
                    <h3 style={{ margin: '0 0 8px 0', color: 'white', fontSize: '16px' }}>{cat.name}</h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>{cat.description}</p>
                </div>
            ))}
        </div>
    );
};

export default CategorySelector;
