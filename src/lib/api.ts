export interface Lead {
    id: string;
    Fecha: string;
    Nombre: string;
    Whatsapp: string;
    Email: string;
    Ubicacion: string;
    Presupuesto: string;
    Tipo: string;
    Interes: string; // INVERSION or ADMINISTRACION
    Fuente: string;
    Detalles: string;
    contacted: boolean;
    converted: boolean;
    lost: boolean;
}

// Google Sheets coerces any all-digit cell to a number, so Whatsapp arrives as a JS
// number (595981123321) for most rows. The dashboard calls String methods on it
// (.includes in the search filter, .replace in the phone parser), which throw on a
// number and crash the whole render. Normalize every field to its declared string
// shape here, at the single boundary, so no consumer has to defend against it.
function normalizeLead(raw: Record<string, unknown>): Lead {
    const str = (v: unknown) => (v == null ? '' : String(v));
    return {
        id: str(raw.id),
        Fecha: str(raw.Fecha),
        Nombre: str(raw.Nombre),
        Whatsapp: str(raw.Whatsapp),
        Email: str(raw.Email),
        Ubicacion: str(raw.Ubicacion),
        Presupuesto: str(raw.Presupuesto),
        Tipo: str(raw.Tipo),
        Interes: str(raw.Interes),
        Fuente: str(raw.Fuente),
        Detalles: str(raw.Detalles),
        contacted: raw.contacted === true || raw.contacted === 'true',
        converted: raw.converted === true || raw.converted === 'true',
        lost: raw.lost === true || raw.lost === 'true',
    };
}

export async function getLeads(): Promise<Lead[]> {
    const r = await fetch('/api/leads', { credentials: 'same-origin' });
    if (r.status === 401) throw new Error('UNAUTHORIZED');
    if (!r.ok) throw new Error('Error fetching leads');
    const data = await r.json();
    if (!Array.isArray(data)) {
        throw new Error(data?.error || 'Unexpected leads response');
    }
    return data.map(normalizeLead);
}

export async function createLead(leadData: Partial<Lead>): Promise<any> {
    const r = await fetch('/api/leads', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'create', ...leadData }),
    });
    if (!r.ok) throw new Error('Network error');
    const data = await r.json();
    if (data.error) throw new Error(data.error);
    return data;
}

export async function updateLead(id: string, field: string, value: any): Promise<any> {
    const r = await fetch('/api/leads', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'update', id, field, value }),
    });
    if (r.status === 401) throw new Error('UNAUTHORIZED');
    if (!r.ok) throw new Error('Network error');
    const data = await r.json();
    if (!data.success) throw new Error(data.error || 'Failed to update');
    return data;
}
