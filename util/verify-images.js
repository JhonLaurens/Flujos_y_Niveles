// Script para verificar que todas las imágenes requeridas existen

const fs = require('fs');
const path = require('path');

// Lista de imágenes SVG que deben existir
const requiredImages = [
  'placeholder.svg',
  'intro-system-dynamics.svg',
  'level-examples.svg',
  'flow-diagram.svg',
  'structure-diagram.svg',
  'bathtub-metaphor.svg',
  'delays-oscillation.svg',
  'continuous-vs-discrete.svg',
  'clothing-inventory-diagram.svg'
];

// Directorio de imágenes
const imgDir = path.join(__dirname, '..', 'img');

console.log('Verificando imágenes en:', imgDir);
console.log('----------------------------------------');

// Verificar si cada imagen existe
let missingFiles = 0;
requiredImages.forEach(imgFile => {
  const filePath = path.join(imgDir, imgFile);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${imgFile} - OK`);
  } else {
    console.log(`❌ ${imgFile} - FALTA`);
    missingFiles++;
  }
});

console.log('----------------------------------------');
if (missingFiles === 0) {
  console.log('Todas las imágenes requeridas están presentes.');
} else {
  console.log(`Faltan ${missingFiles} imágenes. Por favor, crea los archivos faltantes.`);
}

// Verificar accesibilidad de las imágenes existentes
console.log('\nVerificando permisos de archivos:');
console.log('----------------------------------------');

fs.readdir(imgDir, (err, files) => {
  if (err) {
    console.error('Error al leer el directorio de imágenes:', err);
    return;
  }

  const svgFiles = files.filter(file => file.endsWith('.svg'));
  svgFiles.forEach(file => {
    const filePath = path.join(imgDir, file);
    try {
      // Intentar abrir el archivo para leer
      const fd = fs.openSync(filePath, 'r');
      fs.closeSync(fd);
      console.log(`✅ ${file} - Accesible`);
    } catch (error) {
      console.log(`❌ ${file} - Error de acceso: ${error.message}`);
    }
  });
});
