import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { iconsSvg } from "./iconsSvg"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: "accurate" | "normal"
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`
}

const fileTypes = {
  // Microsoft Office formats
  "application/vnd.ms-powerpoint": iconsSvg.PowerPoint_File, // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": iconsSvg.PowerPoint_File, // .pptx
  "application/msword": iconsSvg.Word_File, // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": iconsSvg.Word_File, // .docx
  "application/vnd.ms-excel": iconsSvg.Excel_File, // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": iconsSvg.Excel_File, // .xlsx

  // Accept all image formats
  "image/*": iconsSvg.Image_File,

  // Other file types 
  "application/pdf": iconsSvg.PDF_File, // .pdf
  "application/xml": iconsSvg.XML_File, // .xml
  "text/csv": iconsSvg.CSV_File, // .csv
  "text/plain": iconsSvg.TXT_File, // .txt
  "application/json": iconsSvg.JSON_File, // .json
  ".doc": iconsSvg.Word_File, // .doc
  ".docx": iconsSvg.Word_File, // .docx
  ".pdf": iconsSvg.PDF_File, // .pdf
  ".xml": iconsSvg.XML_File, // .xml
  ".csv": iconsSvg.CSV_File, // .csv
  ".txt": iconsSvg.TXT_File, // .txt
  ".json": iconsSvg.JSON_File, // .json
  ".xlsx": iconsSvg.Excel_File, // .xlsx
  ".xls": iconsSvg.Excel_File, // .xls
};
