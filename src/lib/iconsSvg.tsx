
export const iconsSvg = {
  // Microsoft file types
  Word_File:
    '<svg  viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="8" fill="#2B579A"/><text x="16" y="48" fill="white" font-size="18" font-family="Arial" font-weight="bold">W</text></svg>', // (.doc, .docx)
  Excel_File:
    '<svg  viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="8" fill="#217346"/><text x="16" y="48" fill="white" font-size="18" font-family="Arial" font-weight="bold">X</text></svg>', // (.xls, .xlsx)
  PowerPoint_File:
    '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="8" fill="#D24726"/><text x="16" y="48" fill="white" font-size="18" font-family="Arial" font-weight="bold">P</text></svg>', // (.ppt, .pptx)
  OneNote_File:
    '<svg  viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="8" fill="#7719AA"/><text x="10" y="48" fill="white" font-size="18" font-family="Arial" font-weight="bold">ON</text></svg>', // (.one)
  Access_File:
    '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="8" fill="#A4373A"/><text x="10" y="48" fill="white" font-size="18" font-family="Arial" font-weight="bold">A</text></svg>', // (.accdb)

  // Other file types
  PDF_File:
    '<svg " viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="8" fill="#D32F2F"/><text x="16" y="48" fill="white" font-size="18" font-family="Arial" font-weight="bold">PDF</text></svg>', // (.pdf)
  XML_File:
    '<svg  viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="8" fill="#FFA000"/><text x="12" y="48" fill="white" font-size="18" font-family="Arial" font-weight="bold">XML</text></svg>', // (.xml)
  CSV_File:
    '<svg  viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="8" fill="#4CAF50"/><text x="12" y="48" fill="white" font-size="18" font-family="Arial" font-weight="bold">CSV</text></svg>', // (.csv)
  TXT_File:
    '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="8" fill="#616161"/><text x="14" y="48" fill="white" font-size="18" font-family="Arial" font-weight="bold">TXT</text></svg>', // (.txt)
  JSON_File:
    '<svg  viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="8" fill="#FFCA28"/><text x="10" y="48" fill="black" font-size="18" font-family="Arial" font-weight="bold">JSON</text></svg>', // (.json)
  Image_File: 
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#ffffff"/><stop offset="100%" style="stop-color:#f7fafc"/></linearGradient><linearGradient id="mountain-gradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#4299e1"/><stop offset="100%" style="stop-color:#3182ce"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="3" fill="url(#bg-gradient)" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"/><path d="M5 5h14M5 5v14" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="2 2"/><path d="M2 17l6-6 4 4 2-2 8 8v1H2z" fill="url(#mountain-gradient)"/><circle cx="17" cy="7" r="2" fill="#f6e05e"/><circle cx="17" cy="7" r="1.3" fill="#faf089"/><rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="#4a5568" stroke-width="1.5"/></svg>`, // Image files
};

// component 
// File: FileIcons.tsx

import React from 'react';

export const PowerPointIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="8" fill="#FF0000" />
    {/* Add PowerPoint-specific paths here */}
  </svg>
);

export const WordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="8" fill="#2B579A" />
    {/* Add Word-specific paths here */}
  </svg>
);

export const ExcelIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="8" fill="#00A859" />
    {/* Add Excel-specific paths here */}
  </svg>
);

export const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="8" fill="#FFD700" />
    {/* Add Image-specific paths here */}
  </svg>
);

export const PDFIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="8" fill="#E03C31" />
    {/* Add PDF-specific paths here */}
  </svg>
);

export const JSONIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="8" fill="#A1C7E7" />
    {/* Add JSON-specific paths here */}
  </svg>
);

export const CSVIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="8" fill="#F1C40F" />
    {/* Add CSV-specific paths here */}
  </svg>
);

export const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="8" fill="#616161" />
    <text x="14" y="48" fill="white" fontSize="18" fontFamily="Arial" fontWeight="bold">TXT</text>
  </svg>
);

export const XMLIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="8" fill="#007ACC" />
    {/* Add XML-specific paths here */}
  </svg>
);


