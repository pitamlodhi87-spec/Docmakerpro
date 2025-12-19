
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import ImageConverter from './pages/ImageConverter';
import ImageResizer from './pages/ImageResizer';
import ImageToPdf from './pages/ImageToPdf';
import ImageCompressor from './pages/ImageCompressor';
import ImageRotator from './pages/ImageRotator';
import MemeGenerator from './pages/MemeGenerator';
import EmailResizer from './pages/EmailResizer';
import AiTool from './pages/AiTool';
import AgeCalculator from './pages/AgeCalculator';
import UniversalConverter from './pages/UniversalConverter';
import ImageSizeIncreaser from './pages/ImageSizeIncreaser';
import PdfMerge from './pages/PdfMerge';
import PdfCompress from './pages/PdfCompress';
import PdfOrganize from './pages/PdfOrganize';
import PdfToImage from './pages/PdfToImage';
import Chrome from './pages/Chrome';
import ImageCropper from './pages/ImageCropper';
import RemoveBg from './pages/RemoveBg';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import { Privacy, About, Contact, Terms } from './pages/StaticPages';
import { ImageFormat } from './types';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route path="/universal-converter" element={<UniversalConverter />} />
          <Route path="/size-increaser" element={<ImageSizeIncreaser />} />
          
          {/* New Tools */}
          <Route path="/cropper" element={<ImageCropper />} />
          <Route path="/remove-bg" element={<RemoveBg />} />

          {/* Converters */}
          <Route 
            path="/img-to-png" 
            element={
              <ImageConverter 
                targetFormat={ImageFormat.PNG} 
                title="JPG/WEBP to PNG Converter"
                description="Convert JPG, GIF, and WebP to transparent PNG format instantly."
              />
            } 
          />
          <Route 
            path="/jpeg-to-png" 
            element={
              <ImageConverter 
                targetFormat={ImageFormat.PNG} 
                title="JPEG to PNG Converter"
                description="Convert standard JPEG images to PNG format."
              />
            } 
          />
          <Route 
            path="/img-to-jpg" 
            element={
              <ImageConverter 
                targetFormat={ImageFormat.JPEG} 
                title="PNG to JPG Converter"
                description="Convert PNG and other heavy formats to optimized JPG images."
              />
            } 
          />
          <Route 
            path="/img-to-jpeg" 
            element={
              <ImageConverter 
                targetFormat={ImageFormat.JPEG} 
                title="Image to JPEG Converter"
                description="Convert any image format to standard JPEG format."
              />
            } 
          />
          <Route 
            path="/svg-to-img" 
            element={
              <ImageConverter 
                targetFormat={ImageFormat.PNG} 
                title="SVG to PNG/JPG Converter"
                description="Convert Vector SVG files to raster PNG images."
              />
            } 
          />
          <Route 
            path="/webp-to-img" 
            element={
              <ImageConverter 
                targetFormat={ImageFormat.JPEG} 
                title="WebP to JPG/PNG Converter"
                description="Convert modern WebP images to standard JPG format."
              />
            } 
          />
          <Route 
            path="/img-to-webp" 
            element={
              <ImageConverter 
                targetFormat={ImageFormat.WEBP} 
                title="Image to WebP Converter"
                description="Convert images to next-gen WebP format for faster websites."
              />
            } 
          />
          <Route 
            path="/img-to-gif" 
            element={
              <ImageConverter 
                targetFormat={ImageFormat.GIF} 
                title="Image to GIF Converter"
                description="Convert static images to GIF format."
              />
            } 
          />
          <Route 
            path="/img-to-bmp" 
            element={
              <ImageConverter 
                targetFormat={ImageFormat.BMP} 
                title="Image to BMP Converter"
                description="Convert images to Bitmap (BMP) raster format."
              />
            } 
          />
          <Route 
            path="/img-to-svg" 
            element={
              <ImageConverter 
                targetFormat={ImageFormat.SVG} 
                title="Image to SVG Converter"
                description="Convert raster images to Scalable Vector Graphics (SVG)."
              />
            } 
          />
          
          <Route path="/resizer" element={<ImageResizer />} />
          <Route path="/compressor" element={<ImageCompressor />} />
          <Route path="/img-to-pdf" element={<ImageToPdf />} />
          <Route path="/rotator" element={<ImageRotator />} />
          <Route path="/meme-gen" element={<MemeGenerator />} />
          <Route path="/email-resizer" element={<EmailResizer />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/ai-tool" element={<AiTool />} />

          {/* PDF Routes */}
          <Route path="/pdf-merge" element={<PdfMerge />} />
          <Route path="/pdf-compress" element={<PdfCompress />} />
          <Route path="/pdf-organize" element={<PdfOrganize />} />
          <Route path="/pdf-to-image" element={<PdfToImage />} />
          
          {/* Chrome Tools */}
          <Route path="/chrome" element={<Chrome />} />
          
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
