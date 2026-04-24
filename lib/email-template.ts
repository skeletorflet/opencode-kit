/**
 * Email Template para Sistema de Denuncias Toval
 * Versión 3.0 - Compatibilidad Universal (Yahoo, Gmail, Outlook)
 * 
 * Características:
 * - 100% inline CSS (sin <style> tags)
 * - Layout basado en tablas (máxima compatibilidad)
 * - Sin emojis Unicode (usa texto o imágenes)
 * - Colores sólidos (sin gradientes)
 * - Fuentes web-safe
 * - Ancho fijo 600px
 */

export const generateEmailHtml = (data: any, referenceNumber: string) => {
    // Colores seguros - sin transparencias ni gradientes
    const colors = {
        primary: '#1e3a8a',      // Azul oscuro
        accent: '#3b82f6',       // Azul
        background: '#f1f5f9',   // Gris claro
        surface: '#ffffff',      // Blanco
        text: '#334155',         // Gris oscuro
        textLight: '#64748b',    // Gris medio
        border: '#e2e8f0',       // Gris borde
        success: '#16a34a',      // Verde
        warning: '#ea580c',      // Naranja
        danger: '#dc2626',       // Rojo
    };

    const formatDate = () => {
        return new Date().toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Dirección formateada (calle, altura, ciudad, provincia)
    const addressStr = data.parsedAddress
        ? `${data.parsedAddress.street} ${data.parsedAddress.streetNumber}, ${data.parsedAddress.city}, ${data.parsedAddress.province}`
        : 'Ubicación seleccionada en mapa';

    // Coordenadas para mostrar además de la dirección
    const coordsStr = data.location
        ? `Lat: ${data.location.lat.toFixed(6)}  Lng: ${data.location.lng.toFixed(6)}`
        : '';

    const mapsUrl = data.location
        ? `https://www.google.com/maps?q=${data.location.lat},${data.location.lng}`
        : '';

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Denuncia de Siniestro - ${referenceNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${colors.background}; font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <!-- WRAPPER TABLE -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${colors.background};">
        <tr>
            <td align="center" style="padding: 20px 10px;">
                
                <!-- MAIN CONTAINER -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: ${colors.surface}; border: 1px solid ${colors.border};">
                    
                    <!-- HEADER -->
                    <tr>
                        <td align="center" style="background-color: ${colors.primary}; padding: 30px 20px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff; text-transform: uppercase; letter-spacing: 1px;">
                                            DENUNCIA DE SINIESTRO
                                        </h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 12px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="background-color: #2563eb; padding: 6px 16px; border-radius: 4px;">
                                                    <span style="font-size: 13px; color: #ffffff; font-weight: bold;">
                                                        REF: ${referenceNumber}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- CONTENT -->
                    <tr>
                        <td style="padding: 30px 25px;">
                            
                            <!-- FECHA Y ESTADO -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                                <tr>
                                    <td style="vertical-align: top;">
                                        <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">
                                            FECHA DE REPORTE
                                        </p>
                                        <p style="margin: 0; font-size: 14px; color: ${colors.text};">
                                            ${formatDate()}
                                        </p>
                                    </td>
                                    <td align="right" style="vertical-align: top;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="background-color: #dcfce7; padding: 6px 12px; border-radius: 4px;">
                                                    <span style="font-size: 12px; color: ${colors.success}; font-weight: bold;">
                                                        NUEVA SOLICITUD
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- SECCION: ASEGURADO -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="border-bottom: 2px solid ${colors.border}; padding-bottom: 8px; margin-bottom: 15px;">
                                        <p style="margin: 0; font-size: 12px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                                            DETALLES DEL ASEGURADO
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CARD: CONDUCTOR Y VEHICULO -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid ${colors.border}; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <!-- Conductor y Telefono -->
                                            <tr>
                                                <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold;">
                                                        CONDUCTOR
                                                    </p>
                                                    <p style="margin: 0; font-size: 15px; color: ${colors.text}; font-weight: bold;">
                                                        ${data.driverName || '-'}
                                                    </p>
                                                </td>
                                                <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold;">
                                                        TELEFONO
                                                    </p>
                                                    <p style="margin: 0; font-size: 15px; color: ${colors.text};">
                                                        ${data.driverPhone || '-'}
                                                    </p>
                                                </td>
                                            </tr>
                                            <!-- Vehiculo -->
                                            <tr>
                                                <td colspan="2" style="border-top: 1px solid ${colors.border}; padding-top: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold;">
                                                        VEHICULO ASEGURADO
                                                    </p>
                                                    <p style="margin: 0 0 4px 0; font-size: 17px; color: ${colors.primary}; font-weight: bold;">
                                                        ${data.insuredVehicle || '-'}
                                                    </p>
                                                    <p style="margin: 0; font-size: 14px; color: ${colors.textLight};">
                                                        Patente: <strong style="color: ${colors.text};">${data.insuredPlate || '-'}</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                            ${!data.isDriverOwner ? `
                                            <!-- Titular diferente -->
                                            <tr>
                                                <td colspan="2" style="padding-top: 15px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef3c7; border-left: 4px solid ${colors.warning};">
                                                        <tr>
                                                            <td style="padding: 10px 12px;">
                                                                <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.warning}; font-weight: bold;">
                                                                    [!] EL CONDUCTOR NO ES EL TITULAR
                                                                </p>
                                                                <p style="margin: 0; font-size: 13px; color: ${colors.text};">
                                                                    Titular: <strong>${data.ownerName || '-'}</strong> - Tel: ${data.ownerPhone || '-'}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            ` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- SECCION: UBICACION -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="border-bottom: 2px solid ${colors.border}; padding-bottom: 8px;">
                                        <p style="margin: 0; font-size: 12px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                                            UBICACION Y FECHA DEL HECHO
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CARD: UBICACION -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid ${colors.border}; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold;">
                                                        FECHA DEL SINIESTRO
                                                    </p>
                                                    <p style="margin: 0; font-size: 15px; color: ${colors.text}; font-weight: bold;">
                                                        ${data.date || '-'}
                                                    </p>
                                                </td>
                                                <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold;">
                                                        HORA
                                                    </p>
                                                    <p style="margin: 0; font-size: 15px; color: ${colors.text};">
                                                        ${data.time || '-'} hs
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="border-top: 1px solid ${colors.border}; padding-top: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold;">
                                                        DIRECCION SELECCIONADA
                                                    </p>
                                                    <p style="margin: 0 0 6px 0; font-size: 15px; color: ${colors.text}; font-weight: bold;">
                                                        ${addressStr}
                                                    </p>
                                                    ${coordsStr ? `
                                                    <p style="margin: 0 0 12px 0; font-size: 12px; color: ${colors.textLight};">
                                                        ${coordsStr}
                                                    </p>
                                                    ` : ''}
                                                    ${mapsUrl ? `
                                                    <a href="${mapsUrl}" target="_blank" style="display: inline-block; background-color: ${colors.accent}; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-size: 13px; font-weight: bold;">
                                                        [+] Ver en Google Maps
                                                    </a>
                                                    ` : ''}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- SECCION: RELATO -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="border-bottom: 2px solid ${colors.border}; padding-bottom: 8px;">
                                        <p style="margin: 0; font-size: 12px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                                            RELATO DEL SINIESTRO
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CARD: RELATO -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border: 1px solid ${colors.border}; border-left: 4px solid ${colors.accent}; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; font-size: 15px; color: ${colors.text}; font-style: italic; line-height: 1.6;">
                                            "${data.description || 'Sin descripción'}"
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            ${data.hasThirdParty ? `
                            <!-- SECCION: TERCEROS -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="border-bottom: 2px solid ${colors.warning}; padding-bottom: 8px;">
                                        <p style="margin: 0; font-size: 12px; color: ${colors.warning}; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                                            DATOS DEL TERCERO INVOLUCRADO
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CARD: TERCERO -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff7ed; border: 1px solid #fed7aa; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold;">
                                                        NOMBRE
                                                    </p>
                                                    <p style="margin: 0; font-size: 15px; color: ${colors.text}; font-weight: bold;">
                                                        ${data.thirdPartyName || '-'}
                                                    </p>
                                                </td>
                                                <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold;">
                                                        TELEFONO
                                                    </p>
                                                    <p style="margin: 0; font-size: 15px; color: ${colors.text};">
                                                        ${data.thirdPartyPhone || '-'}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="border-top: 1px solid #fed7aa; padding-top: 15px; padding-bottom: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold;">
                                                        VEHICULO
                                                    </p>
                                                    <p style="margin: 0 0 4px 0; font-size: 15px; color: ${colors.text};">
                                                        ${data.thirdPartyBrandModel || 'No especificado'} (${data.thirdPartyVehicleType || 'Auto'})
                                                    </p>
                                                    <p style="margin: 0; font-size: 14px; color: ${colors.textLight};">
                                                        Patente: <strong style="color: ${colors.text};">${data.thirdPartyPlate || '-'}</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" style="border-top: 1px dashed #fed7aa; padding-top: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 11px; color: ${colors.textLight}; text-transform: uppercase; font-weight: bold;">
                                                        COMPAÑIA DE SEGUROS
                                                    </p>
                                                    <p style="margin: 0 0 4px 0; font-size: 15px; color: ${colors.text}; font-weight: bold;">
                                                        ${data.thirdPartyInsurance || '-'}
                                                    </p>
                                                    <p style="margin: 0; font-size: 13px; color: ${colors.textLight};">
                                                        Poliza: ${data.thirdPartyPolicy || '-'}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            ${data.hasInjuries ? `
                            <!-- SECCION: LESIONES -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td style="border-bottom: 2px solid ${colors.danger}; padding-bottom: 8px;">
                                        <p style="margin: 0; font-size: 12px; color: ${colors.danger}; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">
                                            [!] LESIONES REGISTRADAS
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CARD: LESIONES -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid ${colors.danger}; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; font-size: 15px; color: #991b1b; line-height: 1.6;">
                                            ${data.injuriesDescription || 'Se indicaron lesiones pero no se proporcionaron detalles.'}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            <!-- ADJUNTOS -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #eff6ff; border: 2px dashed ${colors.accent}; margin-top: 25px;">
                                <tr>
                                    <td align="center" style="padding: 25px 20px;">
                                        <p style="margin: 0 0 8px 0; font-size: 28px; color: ${colors.primary};">
                                            [ARCHIVO ADJUNTO]
                                        </p>
                                        <p style="margin: 0 0 4px 0; font-size: 16px; color: ${colors.primary}; font-weight: bold;">
                                            Documentacion Adjunta
                                        </p>
                                        <p style="margin: 0; font-size: 13px; color: ${colors.textLight};">
                                            Se ha generado y adjuntado el archivo ZIP con las fotos del siniestro.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- FOOTER -->
                    <tr>
                        <td style="background-color: ${colors.background}; border-top: 1px solid ${colors.border}; padding: 20px; text-align: center;">
                            <p style="margin: 0 0 5px 0; font-size: 12px; color: ${colors.textLight};">
                                Este correo fue generado automaticamente por el sistema de denuncias online.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: ${colors.textLight};">
                                &copy; ${new Date().getFullYear()} Toval Seguros - Todos los derechos reservados.
                            </p>
                        </td>
                    </tr>
                    
                </table>
                <!-- END MAIN CONTAINER -->
                
            </td>
        </tr>
    </table>
    <!-- END WRAPPER -->
    
</body>
</html>`;
};
