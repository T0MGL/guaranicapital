import { Lead } from './api';
import { parseWhatsapp } from './phone';

const HEADERS = [
    'Nombre',
    'WhatsApp',
    'Email',
    'Interés',
    'Ubicación',
    'Presupuesto',
    'Detalles',
    'Estado',
    'Fecha',
] as const;

const isTrue = (v: unknown) => String(v) === 'true';

function leadStatus(lead: Lead): string {
    if (isTrue(lead.converted)) return 'Convertido';
    if (isTrue(lead.lost)) return 'Perdido';
    if (isTrue(lead.contacted)) return 'Contactado';
    return 'Nuevo';
}

// Excel treats a bare comma/quote/newline as structure, so any field carrying one
// is wrapped in double quotes with internal quotes doubled (RFC 4180).
function escapeField(value: string): string {
    if (/[",\r\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

function rowFor(lead: Lead): string[] {
    return [
        lead.Nombre ?? '',
        parseWhatsapp(lead.Whatsapp).e164,
        lead.Email ?? '',
        lead.Interes === 'INVERSION' ? 'Inversión' : 'Administración',
        lead.Ubicacion ?? '',
        lead.Presupuesto ?? '',
        lead.Detalles ?? '',
        leadStatus(lead),
        lead.Fecha ?? '',
    ];
}

function todayStamp(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function exportLeadsToCsv(leads: Lead[]): void {
    const lines = [HEADERS, ...leads.map(rowFor)].map(cells =>
        cells.map(escapeField).join(',')
    );

    // BOM so Excel decodes UTF-8 and renders acentos/ñ on the first open.
    const csv = `﻿${lines.join('\r\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `guarani-leads-${todayStamp()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
