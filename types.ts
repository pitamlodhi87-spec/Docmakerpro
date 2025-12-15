
import { LucideIcon } from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: string;
}

export enum ImageFormat {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  WEBP = 'image/webp',
  GIF = 'image/gif',
  BMP = 'image/bmp',
  SVG = 'image/svg+xml'
}

export interface ImageDimension {
  width: number;
  height: number;
}

export interface PdfPageData {
  pageIndex: number;
  thumbnail: string; // Data URL
  originalIndex: number;
  rotation: number;
  selected: boolean;
}