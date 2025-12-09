/**
 * Export to PDF (Feature 3)
 * Generate PDF reports for property details and inquiry summaries
 * Uses jsPDF library
 */

import type { Property, Inquiry, User } from '../types';

// Note: jsPDF will be imported dynamically to reduce initial bundle size
let jsPDF: any = null;

/**
 * Lazy load jsPDF
 */
async function loadjsPDF() {
  if (!jsPDF) {
    const module = await import('jspdf');
    jsPDF = module.default || module.jsPDF;
  }
  return jsPDF;
}

/**
 * Export property details to PDF
 */
export async function exportPropertyToPDF(property: Property): Promise<void> {
  try {
    const PDF = await loadjsPDF();
    const doc = new PDF();

    // Title
    doc.setFontSize(20);
    doc.text('TES Property - Property Details', 105, 20, { align: 'center' });

    // Property Name
    doc.setFontSize(16);
    doc.text(property.name, 20, 40);

    // Price
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text(`PHP ${property.price.toLocaleString()}`, 20, 50);
    doc.setTextColor(0, 0, 0);

    // Status
    doc.setFontSize(12);
    doc.text(`Status: ${property.status}`, 20, 60);
    doc.text(`Type: ${property.type}`, 20, 67);

    // Address
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Address:', 20, 77);
    doc.setFont(undefined, 'normal');
    doc.text(property.address.street, 20, 84);
    doc.text(
      `${property.address.barangay}, ${property.address.city}`,
      20,
      91
    );
    doc.text(
      `${property.address.province}, ${property.address.zip}`,
      20,
      98
    );

    // Description
    doc.setFont(undefined, 'bold');
    doc.text('Description:', 20, 110);
    doc.setFont(undefined, 'normal');
    const descLines = doc.splitTextToSize(property.description, 170);
    doc.text(descLines, 20, 117);

    // Features
    const descHeight = descLines.length * 7;
    doc.setFont(undefined, 'bold');
    doc.text('Features:', 20, 117 + descHeight + 5);
    doc.setFont(undefined, 'normal');
    property.features.forEach((feature, index) => {
      doc.text(`• ${feature}`, 25, 124 + descHeight + 5 + index * 7);
    });

    // Reservation Fee and Commission
    const featuresHeight = property.features.length * 7;
    doc.setFont(undefined, 'bold');
    doc.text('Financial Details:', 20, 131 + descHeight + featuresHeight + 5);
    doc.setFont(undefined, 'normal');
    doc.text(
      `Reservation Fee: PHP ${property.reservationFee.toLocaleString()}`,
      20,
      138 + descHeight + featuresHeight + 5
    );
    doc.text(
      `Agent Commission: PHP ${property.commission.toLocaleString()}`,
      20,
      145 + descHeight + featuresHeight + 5
    );

    // Photos note
    if (property.photos.length > 0) {
      doc.setFont(undefined, 'italic');
      doc.setFontSize(10);
      doc.text(
        `This property has ${property.photos.length} photo(s) available online.`,
        20,
        160 + descHeight + featuresHeight
      );
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated on ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`,
      105,
      280,
      { align: 'center' }
    );
    doc.text('TES Property - Real Estate Management System', 105, 285, {
      align: 'center',
    });

    // Save PDF
    doc.save(`property-${property.id}-${property.name.replace(/\s+/g, '-')}.pdf`);
  } catch (error) {
    console.error('[PDF Export] Failed to export property:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Export inquiry summary to PDF
 */
export async function exportInquiryToPDF(
  inquiry: Inquiry,
  property?: Property
): Promise<void> {
  try {
    const PDF = await loadjsPDF();
    const doc = new PDF();

    // Title
    doc.setFontSize(20);
    doc.text('TES Property - Inquiry Details', 105, 20, { align: 'center' });

    // Inquiry ID
    doc.setFontSize(14);
    doc.text(`Inquiry #${inquiry.id}`, 20, 40);

    // Status
    doc.setFontSize(12);
    doc.text(`Status: ${inquiry.status}`, 20, 50);

    // Customer Details
    doc.setFont(undefined, 'bold');
    doc.text('Customer Information:', 20, 62);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${inquiry.customerName}`, 25, 69);
    doc.text(`Email: ${inquiry.customerEmail}`, 25, 76);
    doc.text(`Phone: ${inquiry.customerPhone}`, 25, 83);
    doc.text(`Address: ${inquiry.customerAddress}`, 25, 90);

    // Property Details
    doc.setFont(undefined, 'bold');
    doc.text('Property:', 20, 102);
    doc.setFont(undefined, 'normal');
    doc.text(inquiry.propertyName, 25, 109);
    if (property) {
      doc.text(`Price: PHP ${property.price.toLocaleString()}`, 25, 116);
      doc.text(`Type: ${property.type}`, 25, 123);
    }

    // Agent Details
    if (inquiry.assignedAgentName) {
      doc.setFont(undefined, 'bold');
      doc.text('Assigned Agent:', 20, 135);
      doc.setFont(undefined, 'normal');
      doc.text(inquiry.assignedAgentName, 25, 142);
    }

    // Viewing Date
    if (inquiry.viewingDate) {
      doc.setFont(undefined, 'bold');
      doc.text('Viewing Date:', 20, 154);
      doc.setFont(undefined, 'normal');
      const viewingDate = new Date(inquiry.viewingDate);
      doc.text(
        viewingDate.toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
        25,
        161
      );
    }

    // Deposit Details
    if (inquiry.depositAmount) {
      doc.setFont(undefined, 'bold');
      doc.text('Deposit:', 20, 173);
      doc.setFont(undefined, 'normal');
      doc.text(`Amount: PHP ${inquiry.depositAmount.toLocaleString()}`, 25, 180);
      if (inquiry.reservationExpiryDate) {
        const expiryDate = new Date(inquiry.reservationExpiryDate);
        doc.text(
          `Expiry: ${expiryDate.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })}`,
          25,
          187
        );
      }
    }

    // Message
    if (inquiry.message) {
      doc.setFont(undefined, 'bold');
      doc.text('Customer Message:', 20, 199);
      doc.setFont(undefined, 'normal');
      const messageLines = doc.splitTextToSize(inquiry.message, 170);
      doc.text(messageLines, 25, 206);
    }

    // Notes
    if (inquiry.notes) {
      const messageHeight = inquiry.message ? inquiry.message.split('\n').length * 7 : 0;
      doc.setFont(undefined, 'bold');
      doc.text('Notes:', 20, 213 + messageHeight);
      doc.setFont(undefined, 'normal');
      const notesLines = doc.splitTextToSize(inquiry.notes, 170);
      doc.text(notesLines, 25, 220 + messageHeight);
    }

    // Dates
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    const createdDate = new Date(inquiry.createdAt);
    const updatedDate = new Date(inquiry.updatedAt);
    doc.text(
      `Created: ${createdDate.toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`,
      20,
      270
    );
    doc.text(
      `Last Updated: ${updatedDate.toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`,
      20,
      275
    );

    // Footer
    doc.setFontSize(8);
    doc.text(
      `Generated on ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`,
      105,
      285,
      { align: 'center' }
    );

    // Save PDF
    doc.save(`inquiry-${inquiry.id}-${inquiry.customerName.replace(/\s+/g, '-')}.pdf`);
  } catch (error) {
    console.error('[PDF Export] Failed to export inquiry:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Export multiple inquiries to PDF report
 */
export async function exportInquiriesReportToPDF(
  inquiries: Inquiry[],
  title: string = 'Inquiry Report'
): Promise<void> {
  try {
    const PDF = await loadjsPDF();
    const doc = new PDF();

    // Title
    doc.setFontSize(18);
    doc.text(`TES Property - ${title}`, 105, 20, { align: 'center' });

    // Summary
    doc.setFontSize(12);
    doc.text(`Total Inquiries: ${inquiries.length}`, 20, 35);
    doc.text(
      `Generated: ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`,
      20,
      42
    );

    // Table headers
    let yPos = 55;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('ID', 20, yPos);
    doc.text('Customer', 35, yPos);
    doc.text('Property', 85, yPos);
    doc.text('Status', 135, yPos);
    doc.text('Agent', 165, yPos);

    // Table rows
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    yPos += 7;

    inquiries.slice(0, 25).forEach((inquiry) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
        // Repeat headers
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text('ID', 20, yPos);
        doc.text('Customer', 35, yPos);
        doc.text('Property', 85, yPos);
        doc.text('Status', 135, yPos);
        doc.text('Agent', 165, yPos);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        yPos += 7;
      }

      doc.text(String(inquiry.id), 20, yPos);
      doc.text(inquiry.customerName.substring(0, 20), 35, yPos);
      doc.text(inquiry.propertyName.substring(0, 20), 85, yPos);
      doc.text(inquiry.status.substring(0, 15), 135, yPos);
      doc.text(
        inquiry.assignedAgentName ? inquiry.assignedAgentName.substring(0, 15) : '-',
        165,
        yPos
      );
      yPos += 7;
    });

    if (inquiries.length > 25) {
      yPos += 5;
      doc.setFont(undefined, 'italic');
      doc.text(`... and ${inquiries.length - 25} more inquiries`, 20, yPos);
    }

    // Save PDF
    doc.save(`inquiry-report-${Date.now()}.pdf`);
  } catch (error) {
    console.error('[PDF Export] Failed to export inquiry report:', error);
    throw new Error('Failed to generate PDF report. Please try again.');
  }
}

/**
 * Export agent performance report to PDF (Feature 5)
 */
export async function exportAgentPerformanceToPDF(
  agent: User,
  stats: {
    totalInquiries: number;
    activeInquiries: number;
    successfulSales: number;
    totalCommission: number;
    conversionRate: number;
  }
): Promise<void> {
  try {
    const PDF = await loadjsPDF();
    const doc = new PDF();

    // Title
    doc.setFontSize(20);
    doc.text('TES Property - Agent Performance Report', 105, 20, {
      align: 'center',
    });

    // Agent Info
    doc.setFontSize(16);
    doc.text(agent.name, 20, 40);
    doc.setFontSize(12);
    doc.text(agent.email, 20, 48);
    doc.text(agent.phone, 20, 55);

    // Performance Metrics
    doc.setFont(undefined, 'bold');
    doc.setFontSize(14);
    doc.text('Performance Metrics', 20, 70);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);
    doc.text(`Total Inquiries Handled: ${stats.totalInquiries}`, 25, 82);
    doc.text(`Active Inquiries: ${stats.activeInquiries}`, 25, 92);
    doc.text(`Successful Sales: ${stats.successfulSales}`, 25, 102);
    doc.text(
      `Total Commission Earned: PHP ${stats.totalCommission.toLocaleString()}`,
      25,
      112
    );
    doc.text(`Conversion Rate: ${stats.conversionRate.toFixed(2)}%`, 25, 122);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated on ${new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`,
      105,
      280,
      { align: 'center' }
    );
    doc.text('TES Property - Real Estate Management System', 105, 285, {
      align: 'center',
    });

    // Save PDF
    doc.save(`agent-performance-${agent.id}-${agent.name.replace(/\s+/g, '-')}.pdf`);
  } catch (error) {
    console.error('[PDF Export] Failed to export agent performance:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}
