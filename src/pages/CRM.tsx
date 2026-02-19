import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, Mail, MapPin, Calendar, Check, X, RefreshCw, Settings, Users, ArrowUpRight, Filter } from 'lucide-react';
import { getLeads, updateLead, Lead } from '../lib/api';
import '../styles/crm.css';

export function CRM() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'contacted' | 'converted' | 'lost' | 'new'>('all');
    const [filterType, setFilterType] = useState<string>('all');

    const [setupMode, setSetupMode] = useState(!localStorage.getItem('APPS_SCRIPT_URL') && !(import.meta as any).env.VITE_APPS_SCRIPT_URL);
    const [appScriptUrl, setAppScriptUrl] = useState(localStorage.getItem('APPS_SCRIPT_URL') || '');

    const fetchLeads = async () => {
        if (setupMode) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getLeads();
            setLeads(data.filter(l => l.id && l.id !== ''));
        } catch (err: any) {
            setError(err.message || 'Error fetching leads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [setupMode]);

    const handleStatusChange = async (id: string, field: string, value: any) => {
        try {
            // Optimistic update
            setLeads(current =>
                current.map(l => {
                    if (l.id === id) {
                        let updated = { ...l, [field]: value };
                        if (field === 'converted' && value === true) {
                            updated.lost = false;
                            updated.contacted = true;
                        }
                        if (field === 'lost' && value === true) {
                            updated.converted = false;
                        }
                        return updated;
                    }
                    return l;
                })
            );
            await updateLead(id, field, value);
        } catch (err: any) {
            alert('Error: ' + err.message);
            fetchLeads();
        }
    };

    const handleSaveSetup = () => {
        if (!appScriptUrl) return;
        localStorage.setItem('APPS_SCRIPT_URL', appScriptUrl);
        setSetupMode(false);
    };

    const stats = useMemo(() => {
        const contacted = leads.filter(l => String(l.contacted) === 'true').length;
        const converted = leads.filter(l => String(l.converted) === 'true').length;
        const total = leads.length;
        const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0';

        return { contacted, converted, total, conversionRate };
    }, [leads]);

    const filteredLeads = leads.filter(lead => {
        const searchMatch =
            (lead.Nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.Email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.Whatsapp || '').includes(searchTerm);

        let statusMatch = true;
        if (filterStatus === 'contacted') statusMatch = String(lead.contacted) === 'true';
        if (filterStatus === 'converted') statusMatch = String(lead.converted) === 'true';
        if (filterStatus === 'lost') statusMatch = String(lead.lost) === 'true';
        if (filterStatus === 'new') statusMatch = String(lead.contacted) !== 'true' && String(lead.converted) !== 'true' && String(lead.lost) !== 'true';

        let typeMatch = true;
        if (filterType !== 'all') typeMatch = lead.Motivacion === filterType;

        return searchMatch && statusMatch && typeMatch;
    }).sort((a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime());

    if (setupMode) {
        return (
            <div className="crm-body">
                <div className="crm-setup-screen">
                    <motion.div className="crm-setup-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Settings className="setup-icon" size={48} style={{ color: '#D4AF37', marginBottom: '1.5rem' }} />
                        <h2>Guaraní Capital CRM</h2>
                        <p>Configura tu Google Sheets para empezar a gestionar tus leads de forma minimalista.</p>
                        <input
                            type="url"
                            placeholder="URL del Script de Google"
                            className="crm-input-elegant"
                            value={appScriptUrl}
                            onChange={e => setAppScriptUrl(e.target.value)}
                        />
                        <button className="crm-btn-primary" onClick={handleSaveSetup}>Conectar CRM</button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="crm-body">
            <div className="crm-container">
                <header className="crm-top-header">
                    <div className="crm-brand">
                        <h1>Panel de Control</h1>
                        <p>Guaraní Capital • CRM Leads</p>
                    </div>
                    {error && <div style={{ color: '#ef4444', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px' }}>{error}</div>}
                    <div className="crm-header-actions">
                        <button className="crm-btn-refresh" onClick={fetchLeads} disabled={loading}>
                            <RefreshCw size={16} className={loading ? 'spin' : ''} />
                            {loading ? 'Sincronizando...' : 'Actualizar'}
                        </button>
                        <button className="icon-action-btn" onClick={() => setSetupMode(true)}><Settings size={18} /></button>
                    </div>
                </header>

                <section className="crm-stats-grid">
                    <div className="crm-stat-card">
                        <div className="stat-icon-wrapper"><Users size={20} /></div>
                        <h3>Total Leads</h3>
                        <div className="value">{stats.total}</div>
                        <div className="trend" style={{ color: '#D4AF37' }}>Leads generados vía web</div>
                    </div>
                    <div className="crm-stat-card">
                        <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><ArrowUpRight size={20} /></div>
                        <h3>Conversión</h3>
                        <div className="value">{stats.conversionRate}%</div>
                        <div className="trend" style={{ color: '#10b981' }}>{stats.converted} leads cerrados</div>
                    </div>
                    <div className="crm-stat-card">
                        <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><Phone size={20} /></div>
                        <h3>Contactados</h3>
                        <div className="value">{stats.contacted}</div>
                        <div className="trend" style={{ color: '#f59e0b' }}>{((stats.contacted / stats.total) * 100 || 0).toFixed(0)}% del pipeline</div>
                    </div>
                </section>

                <div className="crm-controls">
                    <div className="crm-filters">
                        <button onClick={() => setFilterStatus('all')} className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}>Todos</button>
                        <button onClick={() => setFilterStatus('new')} className={`filter-btn ${filterStatus === 'new' ? 'active' : ''}`}>Pendientes</button>
                        <button onClick={() => setFilterStatus('contacted')} className={`filter-btn ${filterStatus === 'contacted' ? 'active' : ''}`}>Contactados</button>
                        <button onClick={() => setFilterStatus('converted')} className={`filter-btn ${filterStatus === 'converted' ? 'active' : ''}`}>Cerrados</button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="crm-search-wrapper">
                            <Search size={16} color="#666" />
                            <input
                                type="text"
                                placeholder="Buscar lead..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-dropdown" style={{ background: 'transparent', border: '1px solid var(--crm-border)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                            <Filter size={14} style={{ marginRight: '8px', color: '#666' }} />
                            <select
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                                style={{ background: 'transparent', color: '#fff', border: 'none', outline: 'none', fontSize: '0.875rem' }}
                            >
                                <option value="all">Todas las Motivaciones</option>
                                <option value="INVERSION">Inversión</option>
                                <option value="ADMINISTRACION">Administración</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="crm-table-wrapper">
                    <table className="crm-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Nombre y Contacto</th>
                                <th>Interés / Propiedad</th>
                                <th>Presupuesto</th>
                                <th>Estado</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredLeads.map(lead => (
                                    <motion.tr
                                        key={lead.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <td style={{ fontSize: '0.8rem', color: '#666' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} /> {lead.Fecha}</div>
                                        </td>
                                        <td>
                                            <div className="lead-name-cell">
                                                <span>{lead.Nombre}</span>
                                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                    <a href={`https://wa.me/${lead.Whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#10b981' }}><Phone size={12} /></a>
                                                    <a href={`mailto:${lead.Email}`} style={{ color: '#3b82f6' }}><Mail size={12} /></a>
                                                    <small>{lead.Whatsapp}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <span style={{ fontSize: '0.85rem', color: lead.Motivacion === 'INVERSION' ? '#D4AF37' : '#8b5cf6' }}>
                                                    {lead.Motivacion === 'INVERSION' ? 'Invirtiendo' : 'Gestión Airbnb'}
                                                </span>
                                                <small style={{ color: '#666' }}><MapPin size={10} style={{ marginRight: '4px' }} />{lead.Procedimiento || lead.Ubicacion}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{lead.Presupuesto || '-'}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${String(lead.converted) === 'true' ? 'converted' : String(lead.lost) === 'true' ? 'lost' : String(lead.contacted) === 'true' ? 'contacted' : 'new'}`}>
                                                {String(lead.converted) === 'true' ? 'Cerrado' : String(lead.lost) === 'true' ? 'Perdido' : String(lead.contacted) === 'true' ? 'En Contacto' : 'Nuevo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => handleStatusChange(lead.id, 'contacted', String(lead.contacted) !== 'true')}
                                                    className={`icon-action-btn ${String(lead.contacted) === 'true' ? 'active-info' : ''}`}
                                                    title="Contactado"
                                                >
                                                    <Phone size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(lead.id, 'converted', String(lead.converted) !== 'true')}
                                                    className={`icon-action-btn ${String(lead.converted) === 'true' ? 'active-success' : ''}`}
                                                    title="Venta Cerrada"
                                                >
                                                    <Check size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(lead.id, 'lost', String(lead.lost) !== 'true')}
                                                    className={`icon-action-btn ${String(lead.lost) === 'true' ? 'active-danger' : ''}`}
                                                    title="Marcar Perdido"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredLeads.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '100px 0', color: '#444' }}>
                                        No hay registros en esta sección.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
