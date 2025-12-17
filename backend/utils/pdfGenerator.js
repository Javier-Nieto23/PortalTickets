import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generarPDFHojaServicio = (hoja) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header - Logo y título (simulado)
      doc.fontSize(20)
         .fillColor('#FF6B35')
         .text('CAAST', 50, 50, { width: 100 });

      doc.fontSize(16)
         .fillColor('#000000')
         .text('Control interno CAAST 2025', 200, 60, { align: 'center' });

      doc.fontSize(14)
         .text(`Solicitud de Servicio: ${hoja.numero_solicitud}`, 200, 85, { align: 'center' });

      // Primera tabla - Información general
      const startY = 130;
      const col1Width = 150;
      const col2Width = 100;
      const col3Width = 150;
      const col4Width = 100;
      const rowHeight = 25;

      // Encabezados
      doc.rect(50, startY, col1Width, rowHeight).stroke();
      doc.rect(50 + col1Width, startY, col2Width, rowHeight).stroke();
      doc.rect(50 + col1Width + col2Width, startY, col3Width, rowHeight).stroke();
      doc.rect(50 + col1Width + col2Width + col3Width, startY, col4Width, rowHeight).stroke();

      doc.fontSize(10)
         .fillColor('#000000')
         .text('Hoja de Censo', 55, startY + 8, { width: col1Width - 10 })
         .text(hoja.hoja_censo || '', 55 + col1Width, startY + 8, { width: col2Width - 10 })
         .text('Hoja de Servicio', 55 + col1Width + col2Width, startY + 8, { width: col3Width - 10 })
         .text(hoja.hoja_servicio || '', 55 + col1Width + col2Width + col3Width, startY + 8, { width: col4Width - 10 });

      // Fila 2 - Cotización y Pedido
      let currentY = startY + rowHeight;
      doc.rect(50, currentY, col1Width, rowHeight).stroke();
      doc.rect(50 + col1Width, currentY, col2Width, rowHeight).stroke();
      doc.rect(50 + col1Width + col2Width, currentY, col3Width, rowHeight).stroke();
      doc.rect(50 + col1Width + col2Width + col3Width, currentY, col4Width, rowHeight).stroke();

      doc.text('#Cotizacion', 55, currentY + 8, { width: col1Width - 10 })
         .text(hoja.cotizacion || '0', 55 + col1Width, currentY + 8, { width: col2Width - 10 })
         .text('#Pedido', 55 + col1Width + col2Width, currentY + 8, { width: col3Width - 10 })
         .text(hoja.pedido || '0', 55 + col1Width + col2Width + col3Width, currentY + 8, { width: col4Width - 10 });

      // Fila 3 - Razón social y Cliente
      currentY += rowHeight;
      doc.rect(50, currentY, col1Width, rowHeight).stroke();
      doc.rect(50 + col1Width, currentY, col2Width, rowHeight).stroke();
      doc.rect(50 + col1Width + col2Width, currentY, col3Width, rowHeight).stroke();
      doc.rect(50 + col1Width + col2Width + col3Width, currentY, col4Width, rowHeight).stroke();

      doc.text('Razon social', 55, currentY + 8, { width: col1Width - 10 })
         .text(hoja.razon_social, 55 + col1Width, currentY + 8, { width: col2Width - 10 })
         .text('# Cliente', 55 + col1Width + col2Width, currentY + 8, { width: col3Width - 10 })
         .text(hoja.codigo_cliente || '', 55 + col1Width + col2Width + col3Width, currentY + 8, { width: col4Width - 10 });

      // Fila 4 - Contacto y Fecha
      currentY += rowHeight;
      doc.rect(50, currentY, col1Width, rowHeight).stroke();
      doc.rect(50 + col1Width, currentY, col2Width, rowHeight).stroke();
      doc.rect(50 + col1Width + col2Width, currentY, col3Width, rowHeight).stroke();
      doc.rect(50 + col1Width + col2Width + col3Width, currentY, col4Width, rowHeight).stroke();

      const fecha = new Date(hoja.fecha_solicitud).toLocaleDateString('es-MX');
      doc.text('Nombre del contacto', 55, currentY + 8, { width: col1Width - 10 })
         .text(hoja.nombre_contacto || '', 55 + col1Width, currentY + 8, { width: col2Width - 10 })
         .text('Fecha de solicitud', 55 + col1Width + col2Width, currentY + 8, { width: col3Width - 10 })
         .text(fecha, 55 + col1Width + col2Width + col3Width, currentY + 8, { width: col4Width - 10 });

      // Fila 5 - Proveedor y Ejecutivo
      currentY += rowHeight;
      doc.rect(50, currentY, col1Width, rowHeight).stroke();
      doc.rect(50 + col1Width, currentY, col2Width, rowHeight).stroke();
      doc.rect(50 + col1Width + col2Width, currentY, col3Width, rowHeight).stroke();
      doc.rect(50 + col1Width + col2Width + col3Width, currentY, col4Width, rowHeight).stroke();

      doc.text('Proveedor asignado', 55, currentY + 8, { width: col1Width - 10 })
         .text(hoja.proveedor_asignado || 'CAAST', 55 + col1Width, currentY + 8, { width: col2Width - 10 })
         .text('Ejecutivo asignado', 55 + col1Width + col2Width, currentY + 8, { width: col3Width - 10 })
         .text(hoja.ejecutivo_asignado || '', 55 + col1Width + col2Width + col3Width, currentY + 8, { width: col4Width - 10 });

      // Servicios solicitados
      currentY += rowHeight + 20;
      doc.fontSize(12)
         .text('Servicios solicitados', 50, currentY, { align: 'center' });

      currentY += 25;

      // Tabla de servicios
      const servicioCol1 = 125;
      const servicioCol2 = 125;
      const servicioCol3 = 125;
      const servicioCol4 = 125;

      // Encabezados de servicios
      doc.rect(50, currentY, servicioCol1, rowHeight).stroke();
      doc.rect(50 + servicioCol1, currentY, servicioCol2, rowHeight).stroke();
      doc.rect(50 + servicioCol1 + servicioCol2, currentY, servicioCol3, rowHeight).stroke();
      doc.rect(50 + servicioCol1 + servicioCol2 + servicioCol3, currentY, servicioCol4, rowHeight).stroke();

      doc.fontSize(10)
         .text('Tipo de Servicio', 55, currentY + 8, { width: servicioCol1 - 10 })
         .text('Equipo', 55 + servicioCol1, currentY + 8, { width: servicioCol2 - 10 })
         .text('Tipo Sistema', 55 + servicioCol1 + servicioCol2, currentY + 8, { width: servicioCol3 - 10 })
         .text('Descripción', 55 + servicioCol1 + servicioCol2 + servicioCol3, currentY + 8, { width: servicioCol4 - 10 });

      currentY += rowHeight;

      // Servicios
      const servicios = hoja.servicios || [];
      servicios.forEach((servicio) => {
        doc.rect(50, currentY, servicioCol1, rowHeight).stroke();
        doc.rect(50 + servicioCol1, currentY, servicioCol2, rowHeight).stroke();
        doc.rect(50 + servicioCol1 + servicioCol2, currentY, servicioCol3, rowHeight).stroke();
        doc.rect(50 + servicioCol1 + servicioCol2 + servicioCol3, currentY, servicioCol4, rowHeight).stroke();

        doc.fontSize(9)
           .text(servicio.tipo_servicio || '', 55, currentY + 8, { width: servicioCol1 - 10 })
           .text(servicio.equipo || '', 55 + servicioCol1, currentY + 8, { width: servicioCol2 - 10 })
           .text(servicio.tipo_sistema || '', 55 + servicioCol1 + servicioCol2, currentY + 8, { width: servicioCol3 - 10 })
           .text(servicio.descripcion || '', 55 + servicioCol1 + servicioCol2 + servicioCol3, currentY + 8, { width: servicioCol4 - 10 });

        currentY += rowHeight;
      });

      // Firma y fecha
      currentY += 30;
      const now = new Date();
      const fechaHora = `${now.toLocaleDateString('es-MX')} ${now.toLocaleTimeString('es-MX')}`;

      doc.fontSize(10)
         .text('Firmado por:', 50, currentY)
         .text(`Fecha: ${now.toLocaleDateString('es-MX')}`, 50, currentY + 20)
         .text(`Hora: ${now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`, 50, currentY + 40);

      doc.fontSize(8)
         .fillColor('#666666')
         .text('Generado automáticamente por el sistema de CAAST', 50, currentY + 60, { 
           align: 'center',
           width: 500
         });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
