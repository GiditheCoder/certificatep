const pptxgen = require('pptxgenjs');
const path = require('path');

const outputFile = path.join(__dirname, 'certificateproject', 'Ogun_LGA_Certificate_Portal_Presentation.pptx');

(async () => {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Copilot';
  pptx.company = 'GiditheCoder/certificatep';
  pptx.subject = 'Project Presentation';
  pptx.title = 'Ogun State LGA Certificate Acquisition Portal';
  pptx.theme = {
    colorScheme: {
      name: 'Custom',
      text: '1F2937',
      accent: '1B7F5A',
      accent2: 'D4F4DD',
      accent3: '0F766E',
      background: 'FFFFFF'
    },
    fontFace: 'Aptos'
  };

  const green = '1B7F5A';
  const dark = '123B2A';
  const lightGreen = 'EAF7F1';
  const softGray = 'F3F4F6';

  const addTitle = (slide, title) => {
    slide.addText(title, {
      x: 0.5,
      y: 0.35,
      w: 11.5,
      h: 0.7,
      fontSize: 26,
      bold: true,
      color: dark,
      margin: 0.1
    });
  };

  // Slide 1: Title
  let slide = pptx.addSlide();
  slide.background = { color: 'F8FFF9' };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 0.35,
    fill: { color: green },
    line: { color: green }
  });
  slide.addText('Ogun State LGA Certificate Acquisition Portal', {
    x: 0.75,
    y: 1.0,
    w: 11.5,
    h: 0.8,
    fontSize: 26,
    bold: true,
    color: dark,
    align: 'left'
  });
  slide.addText('Digital certificate application, approval, verification, and reporting solution', {
    x: 0.75,
    y: 1.8,
    w: 10.5,
    h: 0.6,
    fontSize: 15,
    color: '4B5563',
    italic: true
  });
  slide.addText([
    { text: 'Project Type: ', bold: true, color: dark },
    { text: 'Web application for citizen and official workflows', color: '374151' }
  ], {
    x: 0.75,
    y: 2.5,
    w: 8,
    h: 0.5,
    fontSize: 16,
    color: '374151'
  });
  slide.addText([
    { text: 'Built with: ', bold: true, color: dark },
    { text: 'React, Vite, Axios, face-api.js, QR Code, and secure admin workflows', color: '374151' }
  ], {
    x: 0.75,
    y: 3.0,
    w: 11,
    h: 0.45,
    fontSize: 15,
    color: '374151'
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.4,
    y: 1.25,
    w: 3.8,
    h: 2.8,
    fill: { color: lightGreen },
    line: { color: green, width: 1.5 },
    radius: 0.2
  });
  slide.addText('Key outcomes', {
    x: 8.8,
    y: 1.65,
    w: 2.8,
    h: 0.4,
    bold: true,
    color: dark,
    fontSize: 16
  });
  slide.addText([
    { text: '• Streamlined certificate applications\n', color: dark },
    { text: '• Transparent approval pipeline\n', color: dark },
    { text: '• Digital verification for public trust\n', color: dark },
    { text: '• Reduced paperwork and processing friction', color: dark }
  ], {
    x: 8.8,
    y: 2.15,
    w: 2.8,
    h: 1.5,
    fontSize: 12,
    color: dark,
    bullet: { indent: 0.1 },
    margin: 0.1
  });

  // Slide 2: Overview
  slide = pptx.addSlide();
  addTitle(slide, 'Project Overview');
  slide.addText([
    { text: 'This application digitizes the process of acquiring and managing Local Government Area (LGA) certificates in Ogun State.', color: '1F2937' },
    { text: '\n\nThe project is designed to help citizens submit applications online, track progress, pay required fees, and retrieve verified certificates without extensive manual visits.', color: '374151' },
    { text: '\n\nIt also supports official workflows for reviewing applications, approving or rejecting requests, revoking invalid certificates, and monitoring report summaries.', color: '374151' }
  ], {
    x: 0.6,
    y: 1.2,
    w: 8.4,
    h: 3.2,
    fontSize: 18,
    margin: 0.1,
    color: '1F2937',
    bullet: false,
    breakLine: true
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 9.5,
    y: 1.3,
    w: 3.2,
    h: 2.6,
    fill: { color: green },
    line: { color: green },
    radius: 0.2
  });
  slide.addText('Problem solved', {
    x: 9.8,
    y: 1.7,
    w: 2.5,
    h: 0.5,
    fontSize: 18,
    bold: true,
    color: 'FFFFFF'
  });
  slide.addText([
    { text: '• Long queues\n', color: 'FFFFFF' },
    { text: '• Manual paperwork\n', color: 'FFFFFF' },
    { text: '• Slow certificate processing\n', color: 'FFFFFF' },
    { text: '• Weak public verification', color: 'FFFFFF' }
  ], {
    x: 9.8,
    y: 2.25,
    w: 2.3,
    h: 1.6,
    fontSize: 12,
    color: 'FFFFFF',
    bullet: { indent: 0.1 }
  });

  // Slide 3: Objectives and Value
  slide = pptx.addSlide();
  addTitle(slide, 'Objectives & Project Value');
  slide.addText([
    { text: '1. Simplify certificate acquisition for residents\n', bold: true, color: dark },
    { text: 'Provide a digital application route that removes the need for repeated in-person visits.\n\n', color: '374151' },
    { text: '2. Improve data accuracy and accountability\n', bold: true, color: dark },
    { text: 'Capture structured citizen information, support validation, and reduce inconsistent manual records.\n\n', color: '374151' },
    { text: '3. Enable transparent governance\n', bold: true, color: dark },
    { text: 'Create auditable application statuses, approval decisions, revocations, and reporting for officials.\n\n', color: '374151' },
    { text: '4. Build public trust in certificates\n', bold: true, color: dark },
    { text: 'Support public certificate verification using QR codes and secure validation features.', color: '374151' }
  ], {
    x: 0.7,
    y: 1.2,
    w: 11.7,
    h: 4.4,
    fontSize: 17,
    color: dark,
    margin: 0.1,
    bullet: false
  });

  // Slide 4: Key Features
  slide = pptx.addSlide();
  addTitle(slide, 'Key Features');
  const featureBoxes = [
    ['Citizen application form', 'Resident profile data, birth details, LGA/state inputs, community information, document upload and passport capture.'],
    ['Payment workflow', 'Supports online payment and bank-transfer flow for application fees with retry and completion handling.'],
    ['Dashboard tracking', 'Users can check application status, pending items, approval outcomes, and certificate availability.'],
    ['Official review portal', 'Admins approve/reject applications, monitor requests, and manage report summaries.'],
    ['Certificate verification', 'Public verification page checks issued certificate validity and displays verification data.'],
    ['Face validation', 'Uses face-api.js to validate identity with biometric detection support during application.']
  ];
  featureBoxes.forEach((item, i) => {
    const x = i % 3 < 1 ? 0.75 + (i % 3) * 4.1 : 0.75;
    const y = i < 3 ? 1.3 + Math.floor(i / 3) * 2.2 : 3.5 + (Math.floor((i - 3) / 3) * 2.2);
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 3.7,
      h: 1.7,
      fill: { color: i % 2 === 0 ? lightGreen : 'FFFFFF' },
      line: { color: green, width: 1 },
      radius: 0.12
    });
    slide.addText(item[0], {
      x: x + 0.15,
      y: y + 0.15,
      w: 3.35,
      h: 0.4,
      fontSize: 15,
      bold: true,
      color: dark
    });
    slide.addText(item[1], {
      x: x + 0.15,
      y: y + 0.6,
      w: 3.35,
      h: 0.9,
      fontSize: 10,
      color: '374151',
      margin: 0.05,
      breakLine: true
    });
  });

  // Slide 5: User Roles and Flow
  slide = pptx.addSlide();
  addTitle(slide, 'User Roles & Application Flow');
  slide.addText('Citizen/User', {
    x: 0.7,
    y: 1.2,
    w: 2.5,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: green
  });
  slide.addText([
    { text: '• Register and log in\n', color: '1F2937' },
    { text: '• Complete application form\n', color: '1F2937' },
    { text: '• Upload passport / supporting documents\n', color: '1F2937' },
    { text: '• Pay fee and track application status', color: '1F2937' }
  ], {
    x: 0.7,
    y: 1.7,
    w: 2.8,
    h: 2.1,
    fontSize: 14,
    bullet: { indent: 0.1 }
  });
  slide.addText('Official/Admin', {
    x: 4.4,
    y: 1.2,
    w: 2.8,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: green
  });
  slide.addText([
    { text: '• Review pending applications\n', color: '1F2937' },
    { text: '• Approve or reject cases\n', color: '1F2937' },
    { text: '• Revoke invalid certificates\n', color: '1F2937' },
    { text: '• Generate reports and summaries', color: '1F2937' }
  ], {
    x: 4.4,
    y: 1.7,
    w: 2.8,
    h: 2.1,
    fontSize: 14,
    bullet: { indent: 0.1 }
  });
  slide.addText('Public verifier', {
    x: 8.1,
    y: 1.2,
    w: 3.0,
    h: 0.5,
    fontSize: 20,
    bold: true,
    color: green
  });
  slide.addText([
    { text: '• Search by certificate reference\n', color: '1F2937' },
    { text: '• Validate authenticity\n', color: '1F2937' },
    { text: '• Confirm issuance records\n', color: '1F2937' },
    { text: '• Build public trust', color: '1F2937' }
  ], {
    x: 8.1,
    y: 1.7,
    w: 3.0,
    h: 2.1,
    fontSize: 14,
    bullet: { indent: 0.1 }
  });
  slide.addText('Application Lifecycle: Profile -> Application -> Verification -> Payment -> Approval -> Certificate', {
    x: 0.7,
    y: 4.2,
    w: 11.8,
    h: 0.5,
    fontSize: 17,
    bold: true,
    color: dark,
    fill: { color: softGray }
  });

  // Slide 6: Technical Stack
  slide = pptx.addSlide();
  addTitle(slide, 'Technology Stack');
  const tech = [
    ['Frontend', 'React 19 + Vite + React Router\nResponsive UI for public and admin screens'],
    ['State management', 'Context API for user data and session handling across flows'],
    ['API integration', 'Axios calls to backend endpoints for states, LGAs, applications, certificates and reports'],
    ['Identity validation', 'Face-api.js for biometric detection and document verification support'],
    ['Certificate features', 'React QR Code integration for public verification and certificate display'],
    ['Reporting', 'Dashboard filters, application summaries and export-oriented admin interfaces']
  ];
  tech.forEach((item, i) => {
    const y = 1.2 + i * 0.8;
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.6,
      y,
      w: 12.1,
      h: 0.55,
      fill: { color: i % 2 === 0 ? lightGreen : 'FFFFFF' },
      line: { color: green, width: 1 }
    });
    slide.addText(item[0], {
      x: 0.9,
      y: y + 0.08,
      w: 2.5,
      h: 0.35,
      fontSize: 15,
      bold: true,
      color: dark
    });
    slide.addText(item[1], {
      x: 3.5,
      y: y + 0.08,
      w: 8.5,
      h: 0.35,
      fontSize: 12,
      color: '374151'
    });
  });

  // Slide 7: Security & Validation
  slide = pptx.addSlide();
  addTitle(slide, 'Security, Validation & Compliance');
  slide.addText([
    { text: '• Authentication and role-based navigation for public and official users\n', color: '1F2937' },
    { text: '• API-based data retrieval for states, LGAs, applications, and certificates\n', color: '1F2937' },
    { text: '• Face detection support via face-api.js for identity validation workflows\n', color: '1F2937' },
    { text: '• Certificate revocation capability to revoke invalid or disputed records\n', color: '1F2937' },
    { text: '• Public verification flow using certificate hash and QR-based access\n', color: '1F2937' },
    { text: '• Dashboard controls and audit-friendly reporting for administrative accountability', color: '1F2937' }
  ], {
    x: 0.7,
    y: 1.3,
    w: 10.7,
    h: 3.0,
    fontSize: 18,
    bullet: { indent: 0.1 }
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 11.6,
    y: 1.5,
    w: 1.1,
    h: 2.3,
    fill: { color: green },
    line: { color: green }
  });
  slide.addText('Secure', {
    x: 11.75,
    y: 2.2,
    w: 0.8,
    h: 0.8,
    fontSize: 16,
    bold: true,
    color: 'FFFFFF',
    rotate: 90
  });

  // Slide 8: Business Impact and Results
  slide = pptx.addSlide();
  addTitle(slide, 'Business Impact');
  slide.addText([
    { text: '1. Faster turnaround time for certificates\n', bold: true, color: dark },
    { text: 'Citizen requests can be processed digitally rather than through paper-heavy manual steps.\n\n', color: '374151' },
    { text: '2. Better administrative visibility\n', bold: true, color: dark },
    { text: 'Officials can see all applications, approvals, rejections, and certificate status in a single dashboard.\n\n', color: '374151' },
    { text: '3. Improved trust and transparency\n', bold: true, color: dark },
    { text: 'Public verification reduces fraud and supports stronger confidence in official documents.\n\n', color: '374151' },
    { text: '4. Scalable digital government service\n', bold: true, color: dark },
    { text: 'The portal is structured to handle additional services, reports, and operational workflows as the system grows.', color: '374151' }
  ], {
    x: 0.7,
    y: 1.2,
    w: 11.8,
    h: 4.4,
    fontSize: 17,
    margin: 0.1,
    bullet: false
  });

  // Slide 9: Summary & Closing
  slide = pptx.addSlide();
  slide.background = { color: dark };
  slide.addText('Project Summary', {
    x: 0.8,
    y: 0.7,
    w: 7.2,
    h: 0.7,
    fontSize: 28,
    bold: true,
    color: 'FFFFFF'
  });
  slide.addText([
    { text: 'The Ogun State LGA Certificate Acquisition Portal demonstrates how digital services can modernize public certificate issuance.', color: 'E5E7EB' },
    { text: '\n\nIt combines citizen convenience, official oversight, and public verification into one structured platform.', color: 'E5E7EB' },
    { text: '\n\nThe system is positioned as a practical e-government solution for efficient service delivery, improved accountability, and transparent document management.', color: 'E5E7EB' }
  ], {
    x: 0.8,
    y: 1.75,
    w: 7.5,
    h: 2.8,
    fontSize: 20,
    color: 'E5E7EB',
    margin: 0.1,
    breakLine: true
  });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 8.9,
    y: 1.5,
    w: 3.2,
    h: 2.5,
    fill: { color: green },
    line: { color: green },
    radius: 0.2
  });
  slide.addText('Final takeaway', {
    x: 9.2,
    y: 1.9,
    w: 2.5,
    h: 0.45,
    fontSize: 16,
    bold: true,
    color: 'FFFFFF'
  });
  slide.addText([
    { text: '• Digital-first\n', color: 'FFFFFF' },
    { text: '• Trusted\n', color: 'FFFFFF' },
    { text: '• Transparent\n', color: 'FFFFFF' },
    { text: '• Scalable', color: 'FFFFFF' }
  ], {
    x: 9.2,
    y: 2.45,
    w: 2.3,
    h: 1.4,
    fontSize: 15,
    bullet: { indent: 0.1 }
  });

  await pptx.writeFile({ fileName: outputFile });
  console.log(`Presentation created: ${outputFile}`);
})();
