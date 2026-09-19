import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Quotation } from '../types';
import { numberToWords } from '../lib/numberToWords';

const colors = {
  primary: '#D4AF37', // Gold Accent
  primaryDark: '#1E1E1E', // Dark Charcoal Header Fill
  secondaryDark: '#2A2A2A',
  text: '#1A1A1A',
  textMuted: '#4B5563',
  lightGray: '#F9FAFB',
  border: '#E5E7EB',
  accentBorder: '#D4AF37'
};

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 30,
    paddingTop: 24,
    paddingBottom: 40,
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: colors.text,
    backgroundColor: '#FFFFFF'
  },
  pageFlexBetween: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  // 1. Top Header & Company Logo Integration
  issuerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  issuerDetails: {
    flex: 1,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentBorder,
    paddingLeft: 8
  },
  issuerName: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    marginBottom: 3
  },
  issuerText: {
    fontSize: 9,
    color: colors.textMuted,
    lineHeight: 1.35
  },
  issuerLogoContainer: {
    width: 95,
    maxHeight: 46,
    marginLeft: 10,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  issuerLogo: {
    width: 95,
    maxHeight: 46,
    objectFit: 'contain'
  },

  // 2. Two-Column Metadata Matrix
  metaMatrix: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 3,
    backgroundColor: colors.lightGray
  },
  metaColLeft: {
    width: '50%',
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: colors.border
  },
  metaColRight: {
    width: '50%',
    padding: 10
  },
  metaSectionHeading: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 4
  },
  clientName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.primaryDark,
    marginBottom: 3
  },
  metaRow: {
    fontSize: 9.5,
    color: colors.text,
    marginBottom: 2,
    lineHeight: 1.3
  },
  infoGrid: {
    marginBottom: 4
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2.5,
    fontSize: 9.5
  },
  execBox: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  execLabel: {
    fontSize: 8.5,
    color: '#6B7280',
    marginBottom: 1.5
  },
  execName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: colors.primaryDark
  },
  execMobile: {
    fontSize: 9.5,
    color: colors.text
  },

  // 3. Proposal Title Banner
  proposalTitleContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12
  },
  proposalTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12.5,
    color: colors.primaryDark,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 0.5
  },
  titleDivider: {
    width: 180,
    height: 2,
    backgroundColor: colors.accentBorder,
    marginTop: 4,
    marginBottom: 4
  },

  // 4. Scope & Pricing Table
  bold: {
    fontFamily: 'Helvetica-Bold'
  },
  table: {
    width: '100%',
    marginBottom: 14
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    color: '#FFFFFF',
    paddingVertical: 6.5,
    paddingHorizontal: 4,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    alignItems: 'center'
  },
  tableHeaderCellText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Helvetica-Bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    paddingVertical: 6.5,
    paddingHorizontal: 4,
    fontSize: 9.5,
    alignItems: 'flex-start'
  },
  tableRowEven: {
    backgroundColor: '#FFFFFF'
  },
  tableRowOdd: {
    backgroundColor: '#F9FAFB'
  },
  
  // Table Columns
  colSr: { width: '8%', textAlign: 'center', fontSize: 9.5 },
  colDesc: { width: '44%', paddingRight: 6 },
  colCap: { width: '14%', textAlign: 'center', fontSize: 9.5 },
  colRate: { width: '16%', textAlign: 'right', paddingRight: 6, fontSize: 9.5 },
  colVal: { width: '18%', textAlign: 'right', fontSize: 9.5 },

  serviceTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: colors.primaryDark
  },
  subServiceTag: {
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: '#4B5563'
  },
  itemDescription: {
    fontSize: 8.5,
    color: '#4B5563',
    marginTop: 2,
    lineHeight: 1.28
  },

  // 5. Right-Aligned Financial & Totals Box
  financialContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 6
  },
  summaryBox: {
    width: '46%',
    backgroundColor: colors.lightGray,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    borderRadius: 3
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 9.5,
    color: colors.text
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1.5,
    borderTopColor: colors.accentBorder,
    paddingTop: 4,
    marginTop: 3,
    marginBottom: 2.5,
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: colors.primaryDark
  },
  advanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: 4,
    borderRadius: 2,
    marginTop: 3,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#92400E'
  },
  amountInWords: {
    fontSize: 9,
    fontFamily: 'Helvetica-Oblique',
    color: '#333333',
    textAlign: 'right',
    marginTop: 6,
    marginBottom: 4
  },

  // Page 2 Mini Header
  page2Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  page2HeaderDetails: {
    flex: 1,
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
    paddingLeft: 8
  },
  page2HeaderName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: colors.primaryDark,
    textTransform: 'uppercase',
    marginBottom: 2
  },
  page2HeaderText: {
    fontSize: 8.5,
    color: colors.textMuted,
    lineHeight: 1.3
  },
  page2LogoContainer: {
    width: 75,
    height: 38,
    marginLeft: 10,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  page2Logo: {
    width: 75,
    height: 38,
    objectFit: 'contain'
  },

  // DETAILED DELIVERABLES SECTION (PAGE 2)
  deliverablesSection: {
    width: '100%',
    marginBottom: 8
  },
  sectionHeaderContainer: {
    alignItems: 'center',
    marginBottom: 8
  },
  sectionBannerTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10.5,
    color: colors.primaryDark,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 0.5
  },
  delivTable: {
    width: '100%',
    marginBottom: 8
  },
  deliverableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    paddingVertical: 5.5,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2
  },
  delivHeaderCellText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  delivTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 5.2,
    paddingHorizontal: 6,
    fontSize: 8.5,
    color: '#1A1A1A',
    alignItems: 'flex-start'
  },
  delivColSr: { 
    width: '6%', 
    textAlign: 'center',
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1A1A1A'
  },
  delivColCat: { 
    width: '22%', 
    textAlign: 'left',
    paddingLeft: 6,
    fontFamily: 'Helvetica-Bold', 
    fontSize: 8.5,
    color: '#1A1A1A',
    lineHeight: 1.3,
    letterSpacing: 0.1
  },
  delivColDesc: { 
    width: '50%', 
    textAlign: 'left',
    paddingHorizontal: 6,
    fontSize: 8.5,
    color: '#1A1A1A', 
    lineHeight: 1.3,
    letterSpacing: 0.1
  },
  delivColTime: { 
    width: '22%', 
    textAlign: 'right', 
    paddingRight: 8,
    fontSize: 8.5,
    color: '#1A1A1A', 
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.3,
    letterSpacing: 0.1
  },

  // Execution Block (Terms & Conditions + Bank & Signatory)
  executionBlock: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    width: '100%'
  },

  // Terms & Conditions Block
  termsBlock: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 8
  },
  termsTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.4
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 2.5
  },
  bullet: {
    width: 12,
    fontSize: 8,
    color: colors.primary,
    fontFamily: 'Helvetica-Bold'
  },
  termText: {
    flex: 1,
    fontSize: 8,
    lineHeight: 1.3,
    color: '#374151'
  },

  // Bottom Verification Container (Bank & Signature Split Grid)
  verificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    padding: 8,
    backgroundColor: colors.lightGray
  },
  bankDetails: {
    width: '56%',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB'
  },
  bankTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.4
  },
  bankGrid: {
    fontSize: 7.8,
    lineHeight: 1.3
  },
  bankRow: {
    marginBottom: 2,
    color: colors.text
  },
  signatureBox: {
    width: '42%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingLeft: 8
  },
  signatureTitle: {
    fontSize: 7.8,
    fontFamily: 'Helvetica-Bold',
    color: colors.primaryDark,
    marginBottom: 3
  },
  signatureImg: {
    width: 90,
    height: 34,
    objectFit: 'contain',
    marginBottom: 2
  },
  signaturePlaceholder: {
    width: 80,
    height: 26,
    borderBottomWidth: 1,
    borderBottomColor: '#9CA3AF',
    marginBottom: 2
  },
  signatoryName: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: colors.primaryDark
  },
  signatoryDesignation: {
    fontSize: 7,
    color: '#6B7280'
  },

  // Running Vector Footer Across All Pages
  pageFooter: {
    position: 'absolute',
    bottom: 18,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D4AF37',
    paddingTop: 5,
    fontSize: 7.5,
    color: '#666666'
  },
  footerTextCenter: {
    flex: 1,
    textAlign: 'left'
  },
  footerPageNum: {
    textAlign: 'right'
  }
});

interface Props {
  data: Quotation;
}

export function QuotationPDF({ data }: Props) {
  const company = data.issuingCompanyDetails;
  const client = data.clientDetails;
  
  const bank = company?.bankDetails || company?.bankAccounts?.[0];
  const signatory = company?.authorizedSignatory;

  const defaultUnit = data.lineItems?.[0]?.unit || data.projectDetails?.unit || 'KW';
  
  const footerContact = [
    company?.email ? `Email: ${company.email}` : '',
    company?.phone ? `Phone: +91 ${company.phone}` : '',
    company?.website ? company.website : ''
  ].filter(Boolean).join(' | ') || company?.name || '';

  const getTaxLabel = () => {
    if (data.gstType === 'IGST') {
      return 'IGST (18%):';
    } else if (data.gstType === 'NONE') {
      return 'GST Exempt (0%):';
    }
    return 'CGST (9%) + SGST (9%):';
  };

  const hasDeliverables = data.detailedDeliverables && data.detailedDeliverables.length > 0;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    // If it's standard YYYY-MM-DD, format cleanly or return formatted
    return dateStr;
  };

  const renderClosingBlock = () => {
    const rawTerms = data.termsAndConditions || '';
    
    // Dynamically replace any validity clause if validUntil is present
    const termsLines = rawTerms
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        if (data.validUntil && /validity period for this quote|this quote is valid for|this proposal is valid until|valid until/i.test(line)) {
          // If the line contains a validity statement, ensure the exact validUntil is referenced
          if (/validity period for this quote/i.test(line)) {
            return line.replace(/(validity period for this quote:\s*)(.*)/i, `$1${data.validUntil}`);
          }
          if (/this proposal is valid until/i.test(line)) {
            return `This proposal is valid until ${data.validUntil}`;
          }
        }
        return line;
      });

    const hasPaymentMilestones = data.paymentTerms && data.paymentTerms.length > 0;
    const hasCustomPaymentTerms = Boolean(data.customPaymentTerms?.trim());
    const showPaymentTerms = hasPaymentMilestones || hasCustomPaymentTerms;

    return (
      <View style={styles.executionBlock} wrap={false}>
        {/* Payment Terms & Terms & Conditions Block */}
        {(showPaymentTerms || termsLines.length > 0) && (
          <View style={styles.termsBlock} wrap={false}>
            {/* Payment Terms */}
            {showPaymentTerms && (
              <View style={{ marginBottom: termsLines.length > 0 ? 5 : 0 }}>
                <Text style={styles.termsTitle}>Payment Terms & Milestones</Text>
                {hasPaymentMilestones && (
                  <View style={{ marginBottom: hasCustomPaymentTerms ? 3 : 0 }}>
                    {data.paymentTerms!.map((term, idx) => (
                      <View key={idx} style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.termText}>{term}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {hasCustomPaymentTerms && (
                  <View style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.termText}>{data.customPaymentTerms}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Dynamic Terms & Conditions */}
            {termsLines.length > 0 && (
              <View>
                <Text style={styles.termsTitle}>Terms & Conditions</Text>
                {termsLines.map((line, index) => {
                  const match = line.match(/^(\d+[\.\)]\s*|-\s*|•\s*)(.*)$/);
                  if (match) {
                    return (
                      <View key={index} style={styles.listItem}>
                        <Text style={styles.bullet}>{match[1].trim()}</Text>
                        <Text style={styles.termText}>{match[2]}</Text>
                      </View>
                    );
                  }
                  return (
                    <View key={index} style={styles.listItem}>
                      <Text style={styles.bullet}>{index + 1}.</Text>
                      <Text style={styles.termText}>{line}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Bottom Verification Container (Bank & Signatory Split Grid) */}
        <View style={styles.verificationContainer} wrap={false}>
          {/* Left: Company Bank Details */}
          <View style={styles.bankDetails}>
            <Text style={styles.bankTitle}>Company Bank Details</Text>
            {bank?.bankName || bank?.accountNo ? (
              <View style={styles.bankGrid}>
                {bank.bankName ? (
                  <Text style={styles.bankRow}><Text style={styles.bold}>Bank Name: </Text>{bank.bankName}</Text>
                ) : null}
                {bank.accountNo ? (
                  <Text style={styles.bankRow}><Text style={styles.bold}>Account No: </Text>{bank.accountNo}</Text>
                ) : null}
                {bank.ifscCode ? (
                  <Text style={styles.bankRow}><Text style={styles.bold}>IFSC Code: </Text>{bank.ifscCode}</Text>
                ) : null}
                {bank.branch ? (
                  <Text style={styles.bankRow}><Text style={styles.bold}>Branch: </Text>{bank.branch}</Text>
                ) : null}
                {bank.upiId ? (
                  <Text style={styles.bankRow}><Text style={styles.bold}>UPI ID: </Text>{bank.upiId}</Text>
                ) : null}
              </View>
            ) : (
              <View style={styles.bankGrid}>
                <Text style={styles.bankRow}>Bank details will be provided upon purchase order confirmation.</Text>
              </View>
            )}
          </View>
          
          {/* Right: For, Company Name, Signature & Signatory */}
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>For, {company?.name || 'Solarithm Solutions'}</Text>
            {signatory?.signatureUrl ? (
              <Image src={signatory.signatureUrl} style={styles.signatureImg} />
            ) : (
              <View style={styles.signaturePlaceholder} />
            )}
            <Text style={styles.signatoryName}>{signatory?.name || 'Authorized Signatory'}</Text>
            <Text style={styles.signatoryDesignation}>{signatory?.designation || 'Project Director / Partner'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Document>
      {/* ==================== PAGE 1: COMMERCIAL PROPOSAL & FINANCIAL SUMMARY ==================== */}
      <Page size="A4" style={styles.page} wrap={true}>
        
        {/* 1. TOP HEADER & COMPANY LOGO INTEGRATION */}
        <View style={styles.issuerHeader} wrap={false}>
          {/* Left Column: Issuing Company Details */}
          <View style={styles.issuerDetails}>
            <Text style={styles.issuerName}>{(company?.name || 'Company Name').toUpperCase()}</Text>
            <Text style={styles.issuerText}>{company?.address || 'Company Address'}</Text>
            <Text style={styles.issuerText}>
              {company?.gstin ? `GSTIN: ${company.gstin}` : 'GSTIN: -'}
              {company?.pan ? ` | PAN: ${company.pan}` : ''}
            </Text>
            <Text style={styles.issuerText}>
              Email: {company?.email || '-'} | Phone: {company?.phone || '-'}
            </Text>
          </View>
          
          {/* Right Column: Logo Image */}
          {company?.logoUrl ? (
            <View style={styles.issuerLogoContainer}>
              <Image src={company.logoUrl} style={styles.issuerLogo} />
            </View>
          ) : null}
        </View>

        {/* 2. TWO-COLUMN METADATA MATRIX */}
        <View style={styles.metaMatrix} wrap={false}>
          {/* Left Column ("Bill To / Client") */}
          <View style={styles.metaColLeft}>
            <Text style={styles.metaSectionHeading}>Bill To / Client</Text>
            <Text style={styles.clientName}>{client?.companyName || 'Client Name'}</Text>
            {client?.contactPerson && (
              <Text style={styles.metaRow}><Text style={styles.bold}>Attn: </Text>{client.contactPerson}</Text>
            )}
            <Text style={styles.metaRow}>
              {[client?.address?.line1, client?.address?.line2].filter(Boolean).join(', ') || ''}
              {(client?.address?.line1 || client?.address?.line2) && (client?.address?.city || client?.address?.state) ? ', ' : ''}
              {[client?.address?.city, client?.address?.state].filter(Boolean).join(', ')}
              {client?.address?.pinCode ? ` - ${client.address.pinCode}` : ''}
            </Text>
            <Text style={styles.metaRow}>Phone: {client?.phone || '-'}</Text>
            <Text style={styles.metaRow}>Email: {client?.email || '-'}</Text>
            {client?.gstin && <Text style={styles.metaRow}>GSTIN: {client.gstin}</Text>}
          </View>

          {/* Right Column ("Quotation Info & Project Desk") */}
          <View style={styles.metaColRight}>
            <Text style={styles.metaSectionHeading}>Quotation Info & Project Desk</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.bold}>Quotation No:</Text>
                <Text>{data.quotationNumber}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.bold}>Date of Issue:</Text>
                <Text>{data.date}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.bold}>Validity Date:</Text>
                <Text>{data.validUntil || '-'}</Text>
              </View>
              {data.referenceNumber ? (
                <View style={styles.infoItem}>
                  <Text style={styles.bold}>Ref / Tender:</Text>
                  <Text>{data.referenceNumber}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.execBox}>
              <Text style={styles.execLabel}>Assigned Project Executive:</Text>
              <Text style={styles.execName}>{data.projectDetails?.executiveName || '-'}</Text>
              <Text style={styles.execMobile}>Direct: {data.projectDetails?.executiveMobile || '-'}</Text>
            </View>
          </View>
        </View>

        {/* 3. PROPOSAL TITLE BANNER */}
        <View style={styles.proposalTitleContainer} wrap={false}>
          <Text style={styles.proposalTitle}>
            {data.proposalTitle || 'SOLAR POWER PLANT PROPOSAL: ROOF TOP / CAPTIVE / GRID CONNECTED'}
          </Text>
          <View style={styles.titleDivider} />
        </View>

        {/* 4. SCOPE OF WORK & COMMERCIAL PRICING TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader} fixed>
            <Text style={[styles.colSr, styles.tableHeaderCellText]}>SR. NO.</Text>
            <Text style={[styles.colDesc, styles.tableHeaderCellText]}>SCOPE & TECHNICAL DELIVERABLES</Text>
            <Text style={[styles.colCap, styles.tableHeaderCellText]}>CAPACITY</Text>
            <Text style={[styles.colRate, styles.tableHeaderCellText]}>RATE (INR/{defaultUnit})</Text>
            <Text style={[styles.colVal, styles.tableHeaderCellText]}>AMOUNT (INR)</Text>
          </View>
          
          {data.lineItems.map((item, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]} wrap={false}>
              <Text style={styles.colSr}>{item.srNo}</Text>
              <View style={styles.colDesc}>
                <Text style={styles.serviceTitle}>
                  {item.serviceName}
                  {item.subService ? <Text style={styles.subServiceTag}> ({item.subService})</Text> : null}
                </Text>
                {item.description ? (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                ) : null}
              </View>
              <Text style={styles.colCap}>{item.capacity} {item.unit}</Text>
              <Text style={styles.colRate}>INR {item.rate.toLocaleString('en-IN')}</Text>
              <Text style={styles.colVal}>INR {item.value.toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </View>

        {/* 5. RIGHT-ALIGNED FINANCIAL & TOTALS BOX */}
        <View style={styles.financialContainer} wrap={false}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text>Subtotal:</Text>
              <Text>INR {data.subtotal.toLocaleString('en-IN')}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text>{getTaxLabel()}</Text>
              <Text>INR {data.taxAmount.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text>GRAND TOTAL:</Text>
              <Text>INR {data.grandTotal.toLocaleString('en-IN')}</Text>
            </View>

            {data.advancePayment?.enabled ? (
              <View style={styles.advanceRow}>
                <Text>Advance Payable ({data.advancePayment.percentage}%):</Text>
                <Text>INR {data.advancePayment.amount.toLocaleString('en-IN')}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* AMOUNT IN WORDS */}
        <View wrap={false}>
          <Text style={styles.amountInWords}>
            (Rupees {numberToWords(data.grandTotal)} Only)
          </Text>
        </View>

        {/* If no detailed deliverables, render Closing Block on Page 1 */}
        {!hasDeliverables ? renderClosingBlock() : null}

        {/* RUNNING VECTOR FOOTER */}
        <View style={styles.pageFooter} fixed>
          <Text style={styles.footerTextCenter}>
            {footerContact}
          </Text>
          <Text 
            style={styles.footerPageNum} 
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} 
          />
        </View>

      </Page>

      {/* ==================== PAGE 2: DETAILED TECHNICAL DELIVERABLES & EXECUTION BLOCK ==================== */}
      {hasDeliverables ? (
        <Page size="A4" style={styles.page} wrap={true}>
          {/* Top Reference Mini-Header (Fixed on all continuation pages: Page 2, Page 3+) */}
          <View style={styles.page2Header} fixed>
            <View style={styles.page2HeaderDetails}>
              <Text style={styles.page2HeaderName}>{(company?.name || 'Company Name').toUpperCase()}</Text>
              <Text style={styles.page2HeaderText}>
                Quotation No: {data.quotationNumber} | Project: {data.proposalTitle || 'Solar Power Plant Proposal'}
              </Text>
            </View>
            {company?.logoUrl ? (
              <View style={styles.page2LogoContainer}>
                <Image src={company.logoUrl} style={styles.page2Logo} />
              </View>
            ) : null}
          </View>

          {/* Detailed Deliverables Section */}
          <View style={styles.deliverablesSection}>
            <View style={styles.sectionHeaderContainer} wrap={false}>
              <Text style={styles.sectionBannerTitle}>DETAILED SCOPE OF WORK & DELIVERABLES</Text>
              <View style={styles.titleDivider} />
            </View>

            {/* Detailed Scope Table */}
            <View style={styles.delivTable} wrap={true}>
              <View style={styles.deliverableHeaderRow} fixed>
                <Text style={[styles.delivColSr, styles.delivHeaderCellText]}>SR. NO.</Text>
                <Text style={[styles.delivColCat, styles.delivHeaderCellText]}>DISCIPLINE / STAGE</Text>
                <Text style={[styles.delivColDesc, styles.delivHeaderCellText]}>TECHNICAL DELIVERABLE & SPECIFICATIONS</Text>
                <Text style={[styles.delivColTime, styles.delivHeaderCellText]}>TIMELINE / FORMAT</Text>
              </View>
              {data.detailedDeliverables?.map((deliv, i) => (
                <View key={i} style={[styles.delivTableRow, i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd]} wrap={false}>
                  <Text style={styles.delivColSr}>{deliv.srNo}</Text>
                  <Text style={styles.delivColCat}>{deliv.category}</Text>
                  <Text style={styles.delivColDesc}>{deliv.itemDescription}</Text>
                  <Text style={styles.delivColTime}>{deliv.deliveryTimeline || '-'}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Continuous Flow Execution Block */}
          {renderClosingBlock()}

          {/* Running Vector Footer */}
          <View style={styles.pageFooter} fixed>
            <Text style={styles.footerTextCenter}>
              {footerContact}
            </Text>
            <Text 
              style={styles.footerPageNum} 
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} 
            />
          </View>
        </Page>
      ) : null}
    </Document>
  );
}
