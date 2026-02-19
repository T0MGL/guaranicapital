export const APPS_SCRIPT_URL = (import.meta as any).env.VITE_APPS_SCRIPT_URL || localStorage.getItem('APPS_SCRIPT_URL') || '';

export interface Lead {
    id: string;
    Fecha: string;
    Nombre: string;
    Whatsapp: string;
    Email: string;
    Ubicacion: string;
    Procedimiento: string; // Used as property type/budget/etc
    Presupuesto: string;
    Fuente: string;
    Motivacion: string; // Used for leadType (INVERSION or ADMINISTRACION)
    Estado: string; // Ej: 'cold', 'warm', 'hot'
    contacted: boolean;
    converted: boolean;
    lost: boolean;
}

export async function getLeads(): Promise<Lead[]> {
    if (!APPS_SCRIPT_URL) return [];
    const response = await fetch(APPS_SCRIPT_URL);
    if (!response.ok) throw new Error('Error fetching leads');
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
}

export async function createLead(leadData: Partial<Lead>): Promise<any> {
    const url = APPS_SCRIPT_URL;
    if (!url) {
        console.warn('No Apps Script URL provided. Emulating submission.', leadData);
        return { success: true, emulated: true };
    }

    const payload = {
        action: 'create',
        ...leadData
    };

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        }
    });

    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
}

export async function updateLead(id: string, field: string, value: any): Promise<any> {
    const url = APPS_SCRIPT_URL;
    if (!url) throw new Error('No Apps Script URL configured');

    const payload = {
        action: 'update',
        id,
        field,
        value
    };

    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
        }
    });

    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Failed to update');
    return data;
}
