import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Phone, Mail, MapPin, Calendar, CheckCircle2, Clock, XCircle, MoreVertical, RefreshCw, AlertCircle, Check, X, Settings } from 'lucide-react';
import { getLeads, updateLead, Lead } from '../lib/api';
import '../styles/crm.css';

export function CRM() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all'); // all, contacted, converted, lost
    const [filterType, setFilterType] = useState<string>('all'); // INVERSION vs ADMINISTRACION

    const [setupMode, setSetupMode] = useState(!localStorage.getItem('APPS_SCRIPT_URL') && !(import.meta as any).env.VITE_APPS_SCRIPT_URL);
    const [appScriptUrl, setAppScriptUrl] = useState(localStorage.getItem('APPS_SCRIPT_URL') || '');

    const fetchLeads = async () => {
        if (setupMode) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getLeads();
            // Ensure we treat the returning values robustly
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
                        // Auto toggle other exclusive states if needed
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
            alert('Error updating lead: ' + err.message);
            // Revert optimism by refetching
            fetchLeads();
        }
    };

    const handleSaveSetup = () => {
        if (!appScriptUrl) return;
        localStorage.setItem('APPS_SCRIPT_URL', appScriptUrl);
        setSetupMode(false);
    };

    if (setupMode) {
        return (
            <div className="crm-setup-container">
                <motion.div
                    className="crm-setup-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Settings className="setup-icon" size={48} />
                    <h2>Configuración del CRM</h2>
                    <p>Ingresá la URL del Web App de tu Google Apps Script para conectar la base de datos.</p>
                    <input
                        type="url"
                        placeholder="https://script.google.com/macros/s/..."
                        value={appScriptUrl}
                        onChange={e => setAppScriptUrl(e.target.value)}
                        className="setup-input"
                    />
                    <button className="setup-button" onClick={handleSaveSetup}>Conectar</button>
                </motion.div>
            </div>
        );
    }

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
        if (filterType !== 'all') {
            typeMatch = lead.Motivacion === filterType;
        }

        return searchMatch && statusMatch && typeMatch;
    }).sort((a, b) => new Date(b.Fecha).getTime() - new Date(a.Fecha).getTime()); // newest first

    return (
        <div className="crm-dashboard">
            <aside className="crm-sidebar">
                <div className="crm-logo">
                    <h2>Guaraní CRM</h2>
                </div>
                <nav className="crm-nav">
                    <button className={`nav-item active`} onClick={() => setFilterStatus('all')}>
                        <Search size={18} /> Todos los Leads
                    </button>
                    <button className={`nav-item \${filterStatus === 'new' ? 'active' : ''}`} onClick={() => setFilterStatus('new')}>
                        <AlertCircle size={18} /> Por Contactar
                    </button>
                    <button className={`nav-item \${filterStatus === 'contacted' ? 'active' : ''}`} onClick={() => setFilterStatus('contacted')}>
                        <Clock size={18} /> Contactados
                    </button>
                    <button className={`nav-item \${filterStatus === 'converted' ? 'active' : ''}`} onClick={() => setFilterStatus('converted')}>
                        <CheckCircle2 size={18} /> Convertidos
                    </button>
                    <button className={`nav-item \${filterStatus === 'lost' ? 'active' : ''}`} onClick={() => setFilterStatus('lost')}>
                        <XCircle size={18} /> Perdidos
                    </button>
                </nav>

                <div className="crm-sidebar-footer">
                    <button className="setup-trigger-button" onClick={() => setSetupMode(true)}>
                        <Settings size={18} /> Configuración
                    </button>
                </div>
            </aside>

            <main className="crm-main">
                <header className="crm-header">
                    <div className="search-bar">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o WhatsApp..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="header-actions">
                        <div className="filter-dropdown">
                            <Filter size={18} />
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                <option value="all">Todas las Motivaciones</option>
                                <option value="INVERSION">Inversión (Comprar)</option>
                                <option value="ADMINISTRACION">Administración (Airbnb)</option>
                            </select>
                        </div>

                        <button className="refresh-button" onClick={fetchLeads} disabled={loading}>
                            <RefreshCw className={loading ? 'spinning' : ''} size={18} />
                        </button>
                    </div>
                </header>

                <div className="crm-content">
                    {error && (
                        <div className="crm-error">
                            <AlertCircle size={24} /> {error}
                        </div>
                    )}

                    {loading && !error && leads.length === 0 ? (
                        <div className="crm-loading">
                            <RefreshCw className="spinning" size={32} />
                            <p>Cargando leads...</p>
                        </div>
                    ) : (
                        <div className="leads-table-container">
                            <table className="leads-table">
                                <thead>
                                    <tr>
                                        <th>Lead Info</th>
                                        <th>Motivación & Interés</th>
                                        <th>Ubicación / Fte</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filteredLeads.map((lead) => (
                                            <motion.tr
                                                key={lead.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <td>
                                                    <div className="lead-core-info">
                                                        <span className="lead-name">{lead.Nombre || 'Sin Nombre'}</span>
                                                        <span className="lead-date"><Calendar size={12} /> {lead.Fecha}</span>
                                                        <a href={`https://wa.me/\${lead.Whatsapp?.replace(/\\D/g, '')}`} target="_blank" rel="noreferrer" className="lead-contact">
                                                            <Phone size={12} /> {lead.Whatsapp}
                                                        </a>
                                                        <span className="lead-contact"><Mail size={12} /> {lead.Email}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="lead-mot">
                                                        <span className={`badge \${lead.Motivacion?.toLowerCase() === 'inversion' ? 'badge-inversion' : 'badge-admin'}`}>
                                                            {lead.Motivacion || 'Otro'}
                                                        </span>
                                                        <span className="lead-detail"><b>Prop:</b> {lead.Procedimiento}</span>
                                                        {lead.Presupuesto && <span className="lead-detail"><b>Budget:</b> {lead.Presupuesto}</span>}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="lead-loc">
                                                        <span className="lead-detail"><MapPin size={12} /> {lead.Ubicacion}</span>
                                                        <span className="lead-detail-sm">Fuente: {lead.Fuente || 'Desconocida'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="status-toggles">
                                                        <button
                                                            className={`status-btn \${String(lead.contacted) === 'true' ? 'btn-contacted' : ''}`}
                                                            onClick={() => handleStatusChange(lead.id, 'contacted', String(lead.contacted) !== 'true')}
                                                        >
                                                            Contactado
                                                        </button>
                                                        <button
                                                            className={`status-btn btn-icon \${String(lead.converted) === 'true' ? 'btn-converted' : ''}`}
                                                            onClick={() => handleStatusChange(lead.id, 'converted', String(lead.converted) !== 'true')}
                                                            title="Marcar como Convertido"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            className={`status-btn btn-icon \${String(lead.lost) === 'true' ? 'btn-lost' : ''}`}
                                                            onClick={() => handleStatusChange(lead.id, 'lost', String(lead.lost) !== 'true')}
                                                            title="Marcar como Perdido"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="lead-actions">
                                                        {/* Future more actions could go here */}
                                                        <button className="icon-btn-ghost"><MoreVertical size={16} /></button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                        {filteredLeads.length === 0 && (
                                            <tr>
                                                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                                                    No se encontraron leads con estos filtros.
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
