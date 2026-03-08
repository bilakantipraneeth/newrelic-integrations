import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateBookingModal = ({ isOpen, onClose, onCreate, initialCategory }) => {
    const [category, setCategory] = useState(initialCategory || 'MOVIE');
    const [resources, setResources] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        resourceId: '',
        startTime: '',
        endTime: '',
        metadata: {}
    });

    useEffect(() => {
        if (initialCategory) setCategory(initialCategory);
    }, [initialCategory]);

    useEffect(() => {
        if (isOpen && category) {
            axios.get(`http://localhost:8080/api/v1/inventory/categories/${category}/resources`)
                .then(res => {
                    setResources(res.data);
                    if (res.data.length > 0) {
                        setFormData(prev => ({ ...prev, resourceId: res.data[0].name }));
                    }
                })
                .catch(err => console.error('Error fetching resources:', err));
        }
    }, [isOpen, category]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            category,
            metadata: JSON.stringify(formData.metadata)
        };
        onCreate(finalData);
    };

    const updateMetadata = (key, value) => {
        setFormData({
            ...formData,
            metadata: { ...formData.metadata, [key]: value }
        });
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
            <div className="glass-card animate-fade" style={{ padding: '40px', width: '500px', background: '#1e293b' }}>
                <h2 style={{ marginTop: 0, color: 'white', marginBottom: '25px' }}>Book {category}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Title / Reservation Name</label>
                        <input
                            className="glass-card"
                            placeholder={category === 'MOVIE' ? 'Movie Title' : 'Reservation Name'}
                            required
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {category === 'MOVIE' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>{category === 'MOVIE' ? 'Theater' : 'Location'}</label>
                                <select className="glass-card" style={{ width: '100%', padding: '12px', background: '#1e293b', color: 'white' }} onChange={(e) => setFormData({ ...formData, resourceId: e.target.value })}>
                                    {resources.map(res => (
                                        <option key={res.id} value={res.name}>{res.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Seat</label>
                                <input className="glass-card" placeholder="e.g. A12" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'white' }} onChange={(e) => updateMetadata('seat', e.target.value)} />
                            </div>
                        </div>
                    )}



                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>Start Time</label>
                            <input type="datetime-local" required className="glass-card" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'white' }} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>End Time</label>
                            <input type="datetime-local" required className="glass-card" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'white' }} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" className="btn-primary">Confirm Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBookingModal;
