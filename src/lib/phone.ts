import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

export interface PhoneInfo {
    e164: string;
    countryCode: string | null;
    flag: string;
    countryName: string;
}

// Guaraní stores WhatsApp numbers without a leading +, with the country code baked
// into the digits. A chunk of legacy rows are bare 9-digit PY mobiles (no 595), so
// libphonenumber cannot parse them: those get reconstructed as +595 by hand.
const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });

function isoToFlag(iso: string): string {
    if (iso.length !== 2) return '';
    const A = 0x1f1e6;
    const first = A + (iso.toUpperCase().charCodeAt(0) - 65);
    const second = A + (iso.toUpperCase().charCodeAt(1) - 65);
    return String.fromCodePoint(first, second);
}

function isoToName(iso: string | null): string {
    if (!iso) return '';
    try {
        return regionNames.of(iso) ?? iso;
    } catch {
        return iso;
    }
}

export function parseWhatsapp(raw: string | null | undefined): PhoneInfo {
    const digits = (raw ?? '').replace(/[^0-9]/g, '');

    // Bare canonical PY mobile (e.g. 981889482): 9 digits with no country code.
    // Must run BEFORE the international parse: libphonenumber otherwise reads these
    // as valid foreign numbers (981889482 parses as Iran), which is wrong for this
    // Paraguay dataset. In these rows 9 digits always means a local PY mobile.
    if (digits.length === 9) {
        return {
            e164: `+595${digits}`,
            countryCode: 'PY',
            flag: isoToFlag('PY'),
            countryName: isoToName('PY'),
        };
    }

    if (digits) {
        const pn = parsePhoneNumberFromString(`+${digits}`);
        if (pn && pn.isValid() && pn.country) {
            return {
                e164: pn.number,
                countryCode: pn.country,
                flag: isoToFlag(pn.country),
                countryName: isoToName(pn.country),
            };
        }
    }

    // Unparseable: Guaraní is a Paraguay business, default to PY best effort.
    return {
        e164: digits ? `+${digits}` : '',
        countryCode: 'PY',
        flag: isoToFlag('PY'),
        countryName: isoToName('PY'),
    };
}
