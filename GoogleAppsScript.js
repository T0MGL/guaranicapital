// === CONFIGURACIÓN ===
// Nombre de la hoja en tu Google Sheet donde se guardarán los leads (ajustar si la llamaste distinto, por ej: "Leads")
const SHEET_NAME = "Leads";

// Esta función permite que el frontend lea los leads del Google Sheet
function doGet(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
        if (!sheet) {
            return ContentService.createTextOutput(JSON.stringify({ error: "Hoja no encontrada. Por favor crea una hoja llamada '" + SHEET_NAME + "'" }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        const data = sheet.getDataRange().getValues();
        if (data.length <= 1) {
            return ContentService.createTextOutput(JSON.stringify([]))
                .setMimeType(ContentService.MimeType.JSON);
        }

        const headers = data[0];
        const rows = data.slice(1);

        const result = rows.map(row => {
            const obj = {};
            headers.forEach((header, i) => {
                obj[header] = row[i];
            });
            return obj;
        });

        return ContentService.createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Función auxiliar para inicializar los encabezados si la hoja está vacía
function initializeHeaders(sheet) {
    const headers = [
        'id',
        'Fecha',
        'Nombre',
        'Whatsapp',
        'Email',
        'Ubicacion',
        'Presupuesto',
        'Tipo',
        'Interes',
        'Fuente',
        'Detalles',
        'contacted',
        'converted',
        'lost'
    ];
    sheet.appendRow(headers);
    // Poner en negrita los encabezados
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
}

// Esta función recibe los datos del frontend (cuando se crea o se actualiza un lead)
function doPost(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
        if (!sheet) {
            return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Hoja no encontrada" }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        // Si la hoja está totalmente vacía (ni siquiera tiene encabezados), los inicializamos
        if (sheet.getLastRow() === 0) {
            initializeHeaders(sheet);
        }

        const payload = JSON.parse(e.postData.contents);
        const action = payload.action;

        if (action === 'create') {
            // Crear nuevo lead mapeando los campos recibidos
            const newRow = [
                payload.id || Utilities.getUuid(),
                payload.Fecha || payload.date || new Date().toLocaleString('es-PY'),
                payload.Nombre || payload.name || '',
                payload.Whatsapp || payload.phone || '',
                payload.Email || payload.email || '',
                payload.Ubicacion || payload.location || '',
                payload.Presupuesto || payload.budget || '',
                payload.Tipo || payload.type || '',
                payload.Interes || payload.interest || '',
                payload.Fuente || payload.source || '',
                payload.Detalles || payload.details || '',
                payload.contacted || false,
                payload.converted || false,
                payload.lost || false
            ];

            sheet.appendRow(newRow);

            return ContentService.createTextOutput(JSON.stringify({ success: true, action: 'create' }))
                .setMimeType(ContentService.MimeType.JSON);

        } else if (action === 'update') {
            // Actualizar campo específico (ej: cuando apretás "Contactado", "Convertido" o "Perdido" en el dashboard)
            const id = payload.id;
            const field = payload.field;
            const value = payload.value;

            const data = sheet.getDataRange().getValues();
            const headers = data[0];
            const idCol = headers.indexOf('id') + 1;
            const fieldCol = headers.indexOf(field) + 1;

            if (idCol === 0 || fieldCol === 0) {
                return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Columna no encontrada" }))
                    .setMimeType(ContentService.MimeType.JSON);
            }

            // Buscar la fila por ID y actualizar sólo ese campo
            for (let i = 1; i < data.length; i++) {
                if (data[i][idCol - 1] === id) {

                    sheet.getRange(i + 1, fieldCol).setValue(value);

                    // Lógica acoplada: si se actualiza a 'converted', establecer 'lost' en falso (y viceversa)
                    if (field === 'converted' && value === true) {
                        const lostCol = headers.indexOf('lost') + 1;
                        const contactedCol = headers.indexOf('contacted') + 1;
                        if (lostCol > 0) sheet.getRange(i + 1, lostCol).setValue(false);
                        if (contactedCol > 0) sheet.getRange(i + 1, contactedCol).setValue(true);
                    }
                    if (field === 'lost' && value === true) {
                        const convertedCol = headers.indexOf('converted') + 1;
                        if (convertedCol > 0) sheet.getRange(i + 1, convertedCol).setValue(false);
                    }

                    return ContentService.createTextOutput(JSON.stringify({ success: true, action: 'update' }))
                        .setMimeType(ContentService.MimeType.JSON);
                }
            }

            return ContentService.createTextOutput(JSON.stringify({ success: false, error: "ID no encontrado" }))
                .setMimeType(ContentService.MimeType.JSON);
        }

        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Acción no reconocida" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Para usar con CORS y peticiones de preflight
function doOptions(e) {
    return ContentService.createTextOutput("")
        .setMimeType(ContentService.MimeType.TEXT);
}
