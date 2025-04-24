// Simple diagnostic script to check for common issues

document.addEventListener('DOMContentLoaded', function() {
  console.group('Flujos y Niveles - Diagnostic Report');
  
  // 1. Check for missing images
  const images = document.querySelectorAll('img');
  console.log(`Total images: ${images.length}`);
  
  const missingImages = Array.from(images).filter(img => 
    img.naturalWidth === 0 && !img.classList.contains('loading')
  );
  
  if (missingImages.length > 0) {
    console.warn(`⚠️ Missing images: ${missingImages.length}`);
    missingImages.forEach(img => console.warn(` - ${img.src}`));
  } else {
    console.log('✅ All images loaded successfully');
  }
  
  // 2. Check for interactive elements
  const buttons = document.querySelectorAll('button');
  console.log(`Total buttons: ${buttons.length}`);
  
  const simButton = document.getElementById('showSimulation');
  if (simButton) {
    console.log('✅ Simulation button found');
  } else {
    console.warn('⚠️ Simulation button not found');
  }
  
  // 3. Check for Chart.js
  if (typeof Chart !== 'undefined') {
    console.log('✅ Chart.js loaded successfully');
  } else {
    console.error('❌ Chart.js not loaded');
  }
  
  // 4. Check browser compatibility
  console.log(`User Agent: ${navigator.userAgent}`);
  
  // 5. Log performance metrics
  const performanceEntries = performance.getEntriesByType('navigation');
  if (performanceEntries.length > 0) {
    const timing = performanceEntries[0];
    console.log(`Page load time: ${Math.round(timing.loadEventEnd - timing.startTime)}ms`);
    console.log(`DOM interactive: ${Math.round(timing.domInteractive - timing.startTime)}ms`);
  }
  
  console.groupEnd();
});
