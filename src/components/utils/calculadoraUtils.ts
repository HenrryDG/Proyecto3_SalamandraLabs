import jsPDF from "jspdf";


export interface ResultadoCalculo {
    cliente: string;
    montoMaximo: number;
    cuotaMaxima: number;
    interes: number;
    plazo: number;
    montoTotal: number;
}

export const obtenerPorcentaje = (ingreso: number) =>
    ingreso < 2300 ? 0.32 : ingreso <= 3600 ? 0.34 : ingreso <= 6000 ? 0.35 : 0.4;

export const obtenerInteres = (ingreso: number) =>
    ingreso <= 3600 ? 1.5 : ingreso <= 6000 ? 1.3 : 1.1;

export const calcularMontoMaximo = (
    ingresoNum: number,
    cliente = ""
): ResultadoCalculo => {
    const porcentaje = obtenerPorcentaje(ingresoNum);
    const interes = obtenerInteres(ingresoNum);
    const cuotaMaxima = ingresoNum * porcentaje;
    const plazo = 12;

    let monto = (cuotaMaxima * plazo) / (1 + (interes / 100) * plazo);
    monto = Math.min(Math.round(monto / 100) * 100, 20000);

    const montoTotal = parseFloat(
        (monto * (1 + (interes / 100) * plazo)).toFixed(2)
    );

    return {
        cliente,
        montoMaximo: monto,
        cuotaMaxima: parseFloat(cuotaMaxima.toFixed(2)),
        interes,
        plazo,
        montoTotal,
    };
};


export const generarPDF = (resultado: ResultadoCalculo, ingreso: number) => {
    const doc = new jsPDF('p', 'mm', 'letter');

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // ====== ENCABEZADO CORPORATIVO ======
    const headerHeight = 35;
    // Gradiente simulado con rectángulos
    doc.setFillColor(21, 57, 131);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    doc.setFillColor(30, 70, 150);
    doc.rect(0, headerHeight - 5, pageWidth, 5, 'F');

    // Logo con marco
    try {
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1);
        doc.roundedRect(margin - 2, 6, 34, 18, 2, 2, 'S');
        doc.addImage('/images/logo/logo.png', 'PNG', margin, 8, 30, 14);
    } catch (error) {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('ESETEL', margin, 20);
    }

    // Info empresa mejorada
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPRESA DE SERVICIOS DE TELECOMUNICACIONES', pageWidth - margin, 12, { align: 'right' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('www.esetel.com | contacto@esetel.com', pageWidth - margin, 20, { align: 'right' });
    doc.text('Tel: +591 72028467 | La Paz, Bolivia', pageWidth - margin, 27, { align: 'right' });

    // ====== TÍTULO PRINCIPAL ======
    let y = headerHeight + 20;
    doc.setTextColor(21, 57, 131);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE CÁLCULO DE PRÉSTAMO', pageWidth / 2, y, { align: 'center' });

    // Línea decorativa doble
    doc.setDrawColor(21, 57, 131);
    doc.setLineWidth(2);
    doc.line(margin + 30, y + 5, pageWidth - margin - 30, y + 5);
    doc.setLineWidth(0.5);
    doc.line(margin + 20, y + 8, pageWidth - margin - 20, y + 8);

    // Fecha y número de reporte en caja
    y += 20;
    const fecha = new Date().toLocaleDateString('es-BO', { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    });

    doc.setFillColor(245, 247, 250);
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(margin, y - 8, pageWidth - margin * 2, 18, 3, 3, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`Fecha de emisión: ${fecha}`, margin + 8, y);

    // ====== SECCIÓN CLIENTE ======
    y += 35;
    // Título de sección con fondo
    doc.setFillColor(21, 57, 131);
    doc.roundedRect(margin, y - 10, pageWidth - margin * 2, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL CLIENTE', margin + 5, y - 2);

    y += 15;
    const tableData = [
        ['Nombre del Cliente', resultado.cliente],
        ['Ingreso Mensual Declarado', `Bs. ${ingreso.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`]
    ];

    const cellHeight = 14;
    const col1Width = 75;
    const col2Width = pageWidth - margin * 2 - col1Width;

    // Tabla con bordes redondeados y sombra
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(margin - 1, y - 9, pageWidth - margin * 2 + 2, tableData.length * cellHeight + 2, 3, 3, 'F');

    tableData.forEach((row, index) => {
        const currentY = y + index * cellHeight;
        
        // Fondo alternado mejorado
        if (index % 2 === 0) {
            doc.setFillColor(250, 252, 255);
        } else {
            doc.setFillColor(255, 255, 255);
        }
        doc.roundedRect(margin, currentY - 8, pageWidth - margin * 2, cellHeight, 2, 2, 'F');

        // Bordes suaves
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, currentY - 8, col1Width, cellHeight, 1, 1, 'S');
        doc.roundedRect(margin + col1Width, currentY - 8, col2Width, cellHeight, 1, 1, 'S');

        // Texto mejorado
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.text(row[0], margin + 5, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(10);
        doc.text(row[1], margin + col1Width + 5, currentY);
    });

    // ====== SECCIÓN RESULTADOS ======
    y += tableData.length * cellHeight + 25;
    
    // Título de sección con gradiente
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(margin, y - 10, pageWidth - margin * 2, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RESULTADOS DEL ANÁLISIS CREDITICIO', margin + 5, y - 2);

    y += 15;
    const resultadosData = [
        ['Capacidad de Pago Mensual', `Bs. ${resultado.cuotaMaxima.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`],
        ['Tasa de Interés Aplicable', `${resultado.interes}% mensual`],
        ['Plazo Recomendado', `${resultado.plazo} meses`],
        ['Monto Máximo Sugerido', `Bs. ${resultado.montoMaximo.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`],
        ['Total a Pagar', `Bs. ${resultado.montoTotal.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`]
    ];

    // Sombra de tabla
    doc.setFillColor(200, 200, 200);
    doc.roundedRect(margin + 1, y - 7, pageWidth - margin * 2, resultadosData.length * cellHeight + 2, 3, 3, 'F');

    resultadosData.forEach((row, index) => {
        const currentY = y + index * cellHeight;

        // Fondos especiales
        if (index === 3) { // Monto máximo destacado
            doc.setFillColor(220, 252, 231);
        } else if (index % 2 === 0) {
            doc.setFillColor(248, 250, 252);
        } else {
            doc.setFillColor(255, 255, 255);
        }
        doc.roundedRect(margin, currentY - 8, pageWidth - margin * 2, cellHeight, 2, 2, 'F');

        // Bordes con colores diferentes
        if (index === 3) {
            doc.setDrawColor(34, 197, 94);
            doc.setLineWidth(1);
        } else {
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
        }
        doc.roundedRect(margin, currentY - 8, col1Width, cellHeight, 1, 1, 'S');
        doc.roundedRect(margin + col1Width, currentY - 8, col2Width, cellHeight, 1, 1, 'S');

        // Etiquetas
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.text(row[0], margin + 5, currentY);

        // Valores con formato especial
        if (index === 3) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(22, 163, 74);
            doc.setFontSize(12);
        } else if (index === 4) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(59, 130, 246);
            doc.setFontSize(11);
        } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(30, 30, 30);
            doc.setFontSize(10);
        }
        doc.text(row[1], margin + col1Width + 5, currentY);
    });

    // ====== NOTA IMPORTANTE ======
    y += resultadosData.length * cellHeight + 25;
    doc.setFillColor(255, 248, 220);
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(1);
    doc.roundedRect(margin, y - 8, pageWidth - margin * 2, 30, 5, 5, 'FD');
    
    // Icono de advertencia (simulado)
    doc.setFillColor(245, 158, 11);
    doc.circle(margin + 8, y + 2, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('!', margin + 8, y + 4, { align: 'center' });

    doc.setTextColor(146, 64, 14);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTA IMPORTANTE:', margin + 18, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Este cálculo es referencial y está sujeto a evaluación crediticia completa.', margin + 18, y + 10);
    doc.text('Los términos finales pueden variar según políticas vigentes de la empresa.', margin + 18, y + 18);

    // ====== GENERAR PDF ======
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
};


