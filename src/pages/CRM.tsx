import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, MapPin, Calendar, Check, X, RefreshCw, Settings, Users, ArrowUpRight, Filter, Eye, EyeOff, LogOut } from 'lucide-react';
import { getLeads, updateLead, Lead } from '../lib/api';
import { Logo } from '../components/Logo';
import '../styles/crm.css';

const SESSION_KEY = 'crm_auth_ts';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function isSessionValid(): boolean {
    const ts = localStorage.getItem(SESSION_KEY);
    if (!ts) return false;
    return Date.now() - Number(ts) < SESSION_DURATION;
}

function CRMLogin({ onSuccess }: { onSuccess: () => void }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const correctPassword = (import.meta as any).env.VITE_CRM_PASSWORD;
        if (password === correctPassword) {
            localStorage.setItem(SESSION_KEY, String(Date.now()));
            onSuccess();
        } else {
            setError(true);
            setPassword('');
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="crm-body">
            <div className="crm-setup-screen">
                <motion.div
                    className="crm-setup-box"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                    <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <Logo width={160} />
                    </div>
                    <h2>Guaraní CRM</h2>
                    <p style={{ marginBottom: '2rem' }}>Ingresá tu contraseña para continuar</p>
                    <form onSubmit={handleSubmit}>
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Contraseña"
                                className="crm-input-elegant"
                                style={{
                                    marginBottom: 0,
                                    borderColor: error ? 'var(--crm-danger)' : undefined,
                                    paddingRight: '3.5rem',
                                    transition: 'border-color 0.2s'
                                }}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                style={{
                                    position: 'absolute', right: '1rem', top: '50%',
                                    transform: 'translateY(-50%)', background: 'none',
                                    border: 'none', cursor: 'pointer', color: 'var(--crm-text-muted)',
                                    display: 'flex', alignItems: 'center', padding: 0
                                }}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ color: 'var(--crm-danger)', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 500 }}
                            >
                                Contraseña incorrecta
                            </motion.p>
                        )}
                        <button type="submit" className="crm-btn-primary">
                            Ingresar al Panel
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

export function CRM() {
    const [authenticated, setAuthenticated] = useState(isSessionValid());

    if (!authenticated) {
        return <CRMLogin onSuccess={() => setAuthenticated(true)} />;
    }

    return <CRMDashboard onLogout={() => { localStorage.removeItem(SESSION_KEY); setAuthenticated(false); }} />;
}

function CRMDashboard({ onLogout }: { onLogout: () => void }) {
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
        if (filterType !== 'all') typeMatch = lead.Interes === filterType;

        return searchMatch && statusMatch && typeMatch;
    }).sort((a, b) => {
        const parseLocalDate = (str: string) => {
            if (!str) return 0;
            const iso = new Date(str);
            if (!isNaN(iso.getTime())) return iso.getTime();
            // Handle es-PY locale format: "19/2/2026, 10:30:00 a. m."
            const match = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            if (match) return new Date(`${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`).getTime();
            return 0;
        };
        return parseLocalDate(b.Fecha) - parseLocalDate(a.Fecha);
    });

    if (setupMode) {
        return (
            <div className="crm-body">
                <div className="crm-setup-screen">
                    <motion.div className="crm-setup-box" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <Logo width={160} />
                        </div>
                        <h2>Guaraní CRM</h2>
                        <p>Admin de Propiedades & Leads</p>
                        <input
                            type="url"
                            placeholder="Web App URL de Google Apps Script"
                            className="crm-input-elegant"
                            value={appScriptUrl}
                            onChange={e => setAppScriptUrl(e.target.value)}
                        />
                        <button className="crm-btn-primary" onClick={handleSaveSetup}>Ingresar al Panel</button>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                            <Logo width={40} height={40} />
                            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.01em', margin: 0 }}>Guaraní Capital</h1>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--crm-text-muted)', fontWeight: '500' }}>Panel de Control de Leads</p>
                    </div>
                    {error && <div style={{ color: 'var(--crm-danger)', background: '#fee2e2', padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: '500' }}>{error}</div>}
                    <div className="crm-header-actions">
                        <button className="crm-btn-refresh" onClick={fetchLeads} disabled={loading}>
                            <RefreshCw size={18} className={loading ? 'spin' : ''} />
                            {loading ? 'Sincronizando' : 'Actualizar'}
                        </button>
                        <button className="icon-action-btn" onClick={() => setSetupMode(true)} title="Configuración"><Settings size={20} /></button>
                        <button className="icon-action-btn" onClick={onLogout} title="Cerrar sesión"><LogOut size={20} /></button>
                    </div>
                </header>

                <section className="crm-stats-grid">
                    <div className="crm-stat-card">
                        <div className="stat-icon-wrapper"><Users size={24} /></div>
                        <h3>Leads Totales</h3>
                        <div className="value">{stats.total}</div>
                        <div className="trend" style={{ color: 'var(--crm-text-muted)' }}>Registrados vía landing</div>
                    </div>
                    <div className="crm-stat-card">
                        <div className="stat-icon-wrapper" style={{ background: '#dcfce7', color: '#166534' }}><ArrowUpRight size={24} /></div>
                        <h3>Conversión</h3>
                        <div className="value">{stats.conversionRate}%</div>
                        <div className="trend" style={{ color: '#166534' }}>{stats.converted} cierres exitosos</div>
                    </div>
                    <div className="crm-stat-card">
                        <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#92400e' }}><Phone size={24} /></div>
                        <h3>En Contacto</h3>
                        <div className="value">{stats.contacted}</div>
                        <div className="trend" style={{ color: '#92400e' }}>{((stats.contacted / stats.total) * 100 || 0).toFixed(0)}% del total</div>
                    </div>
                </section>

                <div className="crm-controls">
                    <div className="crm-filters">
                        <button onClick={() => setFilterStatus('all')} className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}>Todos</button>
                        <button onClick={() => setFilterStatus('new')} className={`filter-btn ${filterStatus === 'new' ? 'active' : ''}`}>Nuevos</button>
                        <button onClick={() => setFilterStatus('contacted')} className={`filter-btn ${filterStatus === 'contacted' ? 'active' : ''}`}>Contactados</button>
                        <button onClick={() => setFilterStatus('converted')} className={`filter-btn ${filterStatus === 'converted' ? 'active' : ''}`}>Convertidos</button>
                        <button onClick={() => setFilterStatus('lost')} className={`filter-btn ${filterStatus === 'lost' ? 'active' : ''}`}>Perdidos</button>
                    </div>

                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <div className="crm-search-wrapper">
                            <Search size={18} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o celular..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--crm-bg)', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--crm-border)' }}>
                            <Filter size={16} color="#94a3b8" />
                            <select
                                value={filterType}
                                onChange={e => setFilterType(e.target.value)}
                                style={{ background: 'transparent', color: 'var(--crm-text)', border: 'none', outline: 'none', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer' }}
                            >
                                <option value="all">Todos los Intereses</option>
                                <option value="INVERSION">Inversión</option>
                                <option value="ADMINISTRACION">Administración Airbnb</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="crm-table-wrapper">
                    {loading && leads.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 0', gap: '16px' }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                style={{ width: '32px', height: '32px', border: '2px solid var(--crm-border)', borderTopColor: 'var(--crm-primary)', borderRadius: '50%' }}
                            />
                            <p style={{ color: 'var(--crm-text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Cargando leads...</p>
                        </div>
                    ) : (
                        <table className="crm-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Lead</th>
                                    <th>Propiedad / Interés</th>
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
                                            transition={{ duration: 0.2 }}
                                        >
                                            <td>
                                                <div className="lead-name-cell">
                                                    <span>{lead.Nombre}</span>
                                                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px', alignItems: 'center' }}>
                                                        <a href={`https://wa.me/${String(lead.Whatsapp ?? '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#27ae60', display: 'flex', alignItems: 'center' }} title="Chat WhatsApp"><Phone size={14} /></a>
                                                        <small>{lead.Whatsapp}</small>
                                                        <small style={{ opacity: 0.5 }}>•</small>
                                                        <small>{lead.Email}</small>
                                                    </div>
                                                    <small style={{ marginTop: '4px', opacity: 0.6 }}><Calendar size={10} style={{ marginRight: '4px' }} />{lead.Fecha}</small>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: lead.Interes === 'INVERSION' ? 'var(--crm-primary)' : '#6366f1' }}>
                                                        {lead.Interes === 'INVERSION' ? 'Inversión' : 'Administración'}
                                                    </span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--crm-text-muted)', fontSize: '0.8125rem' }}>
                                                        <MapPin size={12} />
                                                        {lead.Tipo || lead.Ubicacion}
                                                    </div>
                                                    {lead.Detalles && (
                                                        <div style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--crm-text-muted)', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', display: 'inline-block' }}>
                                                            {lead.Detalles}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '0.9375rem', fontWeight: '600', color: lead.Presupuesto ? 'var(--crm-text)' : 'var(--crm-text-muted)' }}>{lead.Presupuesto || 'N/A'}</span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${String(lead.converted) === 'true' ? 'converted' : String(lead.lost) === 'true' ? 'lost' : String(lead.contacted) === 'true' ? 'contacted' : 'new'}`}>
                                                    {String(lead.converted) === 'true' ? 'Convertido' : String(lead.lost) === 'true' ? 'Perdido' : String(lead.contacted) === 'true' ? 'Contactado' : 'Nuevo Lead'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons" style={{ justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleStatusChange(lead.id, 'contacted', String(lead.contacted) !== 'true')}
                                                        className={`icon-action-btn ${String(lead.contacted) === 'true' ? 'active-info' : ''}`}
                                                        title="Marcar como Contactado"
                                                    >
                                                        <Phone size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(lead.id, 'converted', String(lead.converted) !== 'true')}
                                                        className={`icon-action-btn ${String(lead.converted) === 'true' ? 'active-success' : ''}`}
                                                        title="Confirmar Conversión"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(lead.id, 'lost', String(lead.lost) !== 'true')}
                                                        className={`icon-action-btn ${String(lead.lost) === 'true' ? 'active-danger' : ''}`}
                                                        title="Marcar como Perdido"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {filteredLeads.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '120px 0' }}>
                                            <Users size={48} style={{ color: 'var(--crm-border)', marginBottom: '1.5rem' }} />
                                            <p style={{ color: 'var(--crm-text-muted)', fontSize: '1rem' }}>No se encontraron leads en esta sección.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
