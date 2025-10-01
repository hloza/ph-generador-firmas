<script lang="ts">
  import { signatureData } from '../stores/signature.js';
  import { templates } from '../data/templates.js';
  import type { Template } from '../stores/signature.js';

  $: selectedTemplateId = $signatureData.templateId;
  $: selectedTemplate = selectedTemplateId ? templates.find((t: Template) => t.id === selectedTemplateId) : null;
  
  // Estado para vista responsiva
  let viewMode: 'desktop' | 'mobile' = 'desktop';
  
  // Función reactiva que se recalcula cuando cambian los datos del store, el templateId o el viewMode
  $: templatePreviewHtml = (() => {
    const templateId = selectedTemplateId;
    const isMobile = viewMode === 'mobile';
    const name = $signatureData.name || $signatureData.fullName || 'Tu nombre';
    const title = $signatureData.title || $signatureData.position || 'Tu título profesional';
    const company = $signatureData.company || 'Tu empresa';
    const department = $signatureData.department ? ` - ${$signatureData.department}` : '';
    const email = $signatureData.email || 'tu.email@empresa.com';
    const phone = $signatureData.phone || '+34 xxx xxx xxx';
    const website = $signatureData.website || '';
    const address = $signatureData.address || '';
    
    // Redes sociales
    const linkedin = $signatureData.linkedin || '';
    const twitter = $signatureData.twitter || '';
    const github = $signatureData.github || '';
    const instagram = $signatureData.instagram || '';
    
    // Valores de personalización
    const primaryColor = $signatureData.primaryColor || '#3b82f6';
    const accentColor = $signatureData.accentColor || '#8b5cf6';
    const fontFamily = $signatureData.fontFamily || 'modern';
    
    // Mapeo de familias de fuente
    const fontFamilyStyles = {
      modern: 'font-family: Arial, sans-serif;',
      classic: 'font-family: Georgia, serif;',
      minimal: 'font-family: Courier, monospace;'
    };
    
    const fontStyle = fontFamilyStyles[fontFamily as keyof typeof fontFamilyStyles];
    
    // Función para generar imagen
    const getImageHtml = (standalone = false) => {
      if (!$signatureData.image?.url) return '';
      
      const image = $signatureData.image;
      const sizes = {
        small: isMobile ? '48px' : '56px',
        medium: isMobile ? '56px' : '64px',
        large: isMobile ? '64px' : '72px'
      };
      
      const size = sizes[image.size as keyof typeof sizes];
      const borderRadius = image.shape === 'circle' ? '50%' : image.shape === 'rounded' ? '8px' : '0';
      
      if (standalone) {
        return `
          <img 
            src="${image.url}" 
            alt="Profile" 
            style="width: ${size}; height: ${size}; object-fit: cover; border: 2px solid ${primaryColor}; border-radius: ${borderRadius}; margin-right: 16px; flex-shrink: 0;"
          />
        `;
      }
      
      return `
        <div style="display: flex; ${isMobile ? 'justify-content: center; margin-bottom: 16px;' : 'justify-content: flex-start; margin-bottom: 12px;'}">
          <img 
            src="${image.url}" 
            alt="Profile" 
            style="width: ${size}; height: ${size}; object-fit: cover; border: 2px solid ${primaryColor}; border-radius: ${borderRadius};"
          />
        </div>
      `;
    };
    
    // Función para generar iconos de redes sociales
    const getSocialIcons = () => {
      const socials = [];
      
      if (linkedin) {
        socials.push(`
          <a href="${linkedin}" style="color: ${accentColor}; text-decoration: none; margin-right: 12px;">
            <svg style="width: ${isMobile ? '16px' : '18px'}; height: ${isMobile ? '16px' : '18px'}; display: inline-block;" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        `);
      }
      
      if (twitter) {
        socials.push(`
          <a href="${twitter}" style="color: ${accentColor}; text-decoration: none; margin-right: 12px;">
            <svg style="width: ${isMobile ? '16px' : '18px'}; height: ${isMobile ? '16px' : '18px'}; display: inline-block;" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>
        `);
      }
      
      if (github) {
        socials.push(`
          <a href="${github}" style="color: ${accentColor}; text-decoration: none; margin-right: 12px;">
            <svg style="width: ${isMobile ? '16px' : '18px'}; height: ${isMobile ? '16px' : '18px'}; display: inline-block;" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        `);
      }
      
      if (instagram) {
        socials.push(`
          <a href="${instagram}" style="color: ${accentColor}; text-decoration: none; margin-right: 12px;">
            <svg style="width: ${isMobile ? '16px' : '18px'}; height: ${isMobile ? '16px' : '18px'}; display: inline-block;" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        `);
      }
      
      return socials.length > 0 ? `
        <div style="margin-top: ${isMobile ? '12px' : '16px'}; display: flex; align-items: center;">
          ${socials.join('')}
        </div>
      ` : '';
    };

    // Plantillas con diseños completamente únicos
    const previews = {
      // MINIMAL CLEAN - Diseño ultra limpio con imagen a la izquierda en desktop
      'minimal-1': `
        <div style="${fontStyle} max-width: 500px; ${isMobile ? 'text-align: center; padding: 16px;' : 'display: flex; align-items: flex-start; gap: 20px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 8px 0; font-size: ${isMobile ? '18px' : '20px'}; font-weight: 600; line-height: 1.2;">${name}</h3>
            <p style="color: ${accentColor}; margin: 0 0 6px 0; font-size: ${isMobile ? '14px' : '15px'}; font-weight: 500;">${title}</p>
            ${company !== 'Tu empresa' ? `<p style="color: #666; margin: 0 0 12px 0; font-size: ${isMobile ? '12px' : '13px'}; font-style: italic;">${company}${department}</p>` : ''}
            
            <div style="margin-top: 10px; font-size: ${isMobile ? '11px' : '12px'}; color: #555; line-height: 1.4;">
              ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 4px;">${email}</div>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 4px;">${phone}</div>` : ''}
              ${website ? `<div style="margin-bottom: 4px;">${website}</div>` : ''}
              ${address ? `<div>${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // MINIMAL LINES - Con líneas separadoras elegantes
      'minimal-2': `
        <div style="${fontStyle} max-width: 520px; ${isMobile ? 'text-align: center; padding: 16px;' : 'display: flex; align-items: flex-start; gap: 18px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '19px' : '21px'}; font-weight: 300; letter-spacing: 1px;">${name}</h3>
            <div style="width: 30px; height: 2px; background: ${accentColor}; margin: 0 ${isMobile ? 'auto' : '0'} 8px ${isMobile ? 'auto' : '0'};"></div>
            <p style="color: ${accentColor}; margin: 0 0 8px 0; font-size: ${isMobile ? '13px' : '14px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${title}</p>
            ${company !== 'Tu empresa' ? `<p style="color: #777; margin: 0 0 12px 0; font-size: ${isMobile ? '12px' : '13px'}; font-weight: 400;">${company}${department}</p>` : ''}
            
            <div style="border-top: 1px solid #e0e0e0; padding-top: 8px; margin-top: 8px; font-size: ${isMobile ? '11px' : '12px'}; color: #666;">
              ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 3px;">✉ ${email}</div>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 3px;">📞 ${phone}</div>` : ''}
              ${website ? `<div style="margin-bottom: 3px;">🌐 ${website}</div>` : ''}
              ${address ? `<div>📍 ${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // PROFESSIONAL EXECUTIVE - Diseño ejecutivo con jerarquía clara
      'professional-1': `
        <div style="${fontStyle} max-width: 550px; ${isMobile ? 'padding: 20px; text-align: center;' : 'display: flex; align-items: flex-start; gap: 24px; padding: 16px; border-left: 4px solid ' + primaryColor + ';'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 6px 0; font-size: ${isMobile ? '22px' : '24px'}; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">${name}</h3>
            <p style="color: ${accentColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '14px' : '16px'}; font-weight: 600; letter-spacing: 1px;">${title}</p>
            ${company !== 'Tu empresa' ? `<p style="color: #333; margin: 0 0 16px 0; font-size: ${isMobile ? '13px' : '15px'}; font-weight: 500; border-bottom: 1px solid #ddd; padding-bottom: 8px;">${company}${department}</p>` : ''}
            
            <table style="width: 100%; font-size: ${isMobile ? '12px' : '13px'}; color: #555;">
              ${email !== 'tu.email@empresa.com' ? `<tr><td style="padding: 2px 8px 2px 0; font-weight: 600; color: ${primaryColor};">EMAIL:</td><td style="padding: 2px 0;">${email}</td></tr>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<tr><td style="padding: 2px 8px 2px 0; font-weight: 600; color: ${primaryColor};">PHONE:</td><td style="padding: 2px 0;">${phone}</td></tr>` : ''}
              ${website ? `<tr><td style="padding: 2px 8px 2px 0; font-weight: 600; color: ${primaryColor};">WEB:</td><td style="padding: 2px 0;">${website}</td></tr>` : ''}
              ${address ? `<tr><td style="padding: 2px 8px 2px 0; font-weight: 600; color: ${primaryColor};">ADDRESS:</td><td style="padding: 2px 0;">${address}</td></tr>` : ''}
            </table>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // PROFESSIONAL MODERN - Moderno con estructura equilibrada
      'professional-2': `
        <div style="${fontStyle} max-width: 560px; ${isMobile ? 'padding: 18px; text-align: center;' : 'display: flex; align-items: flex-start; gap: 20px; background: linear-gradient(135deg, ' + primaryColor + '08, ' + accentColor + '05); padding: 20px; border-radius: 8px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 8px 0; font-size: ${isMobile ? '20px' : '22px'}; font-weight: 600; letter-spacing: 0.5px;">${name}</h3>
            <div style="background: ${accentColor}; color: white; display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 600; margin-bottom: 10px;">${title.toUpperCase()}</div>
            ${company !== 'Tu empresa' ? `<p style="color: #444; margin: 0 0 14px 0; font-size: ${isMobile ? '13px' : '14px'}; font-weight: 500;">${company}${department}</p>` : ''}
            
            <div style="background: white; padding: 12px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-size: ${isMobile ? '11px' : '12px'}; color: #666;">
              ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 6px; display: flex; align-items: center; gap: 8px;"><span style="color: ${primaryColor}; font-weight: 600;">@</span> ${email}</div>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 6px; display: flex; align-items: center; gap: 8px;"><span style="color: ${primaryColor}; font-weight: 600;">📱</span> ${phone}</div>` : ''}
              ${website ? `<div style="margin-bottom: 6px; display: flex; align-items: center; gap: 8px;"><span style="color: ${primaryColor}; font-weight: 600;">🌐</span> ${website}</div>` : ''}
              ${address ? `<div style="display: flex; align-items: center; gap: 8px;"><span style="color: ${primaryColor}; font-weight: 600;">📍</span> ${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // CREATIVE BOLD - Colores vibrantes y diseño dinámico
      'creative-1': `
        <div style="${fontStyle} max-width: 580px; ${isMobile ? 'padding: 24px; text-align: center;' : 'display: flex; align-items: flex-start; gap: 22px; background: linear-gradient(45deg, ' + primaryColor + '15, ' + accentColor + '15); padding: 24px; border-radius: 16px; border: 2px solid ' + primaryColor + '30;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1;'}">
            <h3 style="background: linear-gradient(45deg, ${primaryColor}, ${accentColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 10px 0; font-size: ${isMobile ? '24px' : '26px'}; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">${name}</h3>
            <div style="background: linear-gradient(135deg, ${accentColor}, ${primaryColor}); color: white; display: inline-block; padding: 8px 20px; border-radius: 25px; font-size: ${isMobile ? '12px' : '14px'}; font-weight: 700; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">${title}</div>
            ${company !== 'Tu empresa' ? `<p style="color: #333; margin: 0 0 16px 0; font-size: ${isMobile ? '14px' : '16px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">${company}${department}</p>` : ''}
            
            <div style="background: rgba(255,255,255,0.9); padding: 16px; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); font-size: ${isMobile ? '12px' : '13px'}; color: #555;">
              ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 10px;"><span style="background: ${primaryColor}; color: white; padding: 4px 8px; border-radius: 50%; font-size: 10px; font-weight: bold;">✉</span> ${email}</div>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 10px;"><span style="background: ${accentColor}; color: white; padding: 4px 8px; border-radius: 50%; font-size: 10px; font-weight: bold;">📱</span> ${phone}</div>` : ''}
              ${website ? `<div style="margin-bottom: 8px; display: flex; align-items: center; gap: 10px;"><span style="background: ${primaryColor}; color: white; padding: 4px 8px; border-radius: 50%; font-size: 10px; font-weight: bold;">🌐</span> ${website}</div>` : ''}
              ${address ? `<div style="display: flex; align-items: center; gap: 10px;"><span style="background: ${accentColor}; color: white; padding: 4px 8px; border-radius: 50%; font-size: 10px; font-weight: bold;">📍</span> ${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // CORPORATE PREMIUM - Diseño institucional de alta gama
      'corporate-1': `
        <div style="${fontStyle} max-width: 600px; ${isMobile ? 'padding: 20px; text-align: center;' : 'display: flex; align-items: flex-start; gap: 26px; background: #f8f9fa; border: 1px solid #e9ecef; border-left: 6px solid ' + primaryColor + '; padding: 24px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 6px 0; font-size: ${isMobile ? '21px' : '23px'}; font-weight: 400; letter-spacing: 1px; font-family: Georgia, serif;">${name}</h3>
            <div style="width: 60px; height: 3px; background: linear-gradient(to right, ${primaryColor}, ${accentColor}); margin: 0 ${isMobile ? 'auto' : '0'} 10px ${isMobile ? 'auto' : '0'};"></div>
            <p style="color: ${accentColor}; margin: 0 0 6px 0; font-size: ${isMobile ? '15px' : '17px'}; font-weight: 600; font-style: italic;">${title}</p>
            ${company !== 'Tu empresa' ? `<p style="color: #666; margin: 0 0 18px 0; font-size: ${isMobile ? '13px' : '15px'}; font-weight: 500; font-family: Georgia, serif;">${company}${department}</p>` : ''}
            
            <div style="border-top: 2px solid ${primaryColor}30; border-bottom: 2px solid ${primaryColor}30; padding: 12px 0; margin: 12px 0; font-size: ${isMobile ? '12px' : '13px'}; color: #555; font-family: Georgia, serif;">
              ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 6px; text-align: ${isMobile ? 'center' : 'left'};">${email}</div>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 6px; text-align: ${isMobile ? 'center' : 'left'};">${phone}</div>` : ''}
              ${website ? `<div style="margin-bottom: 6px; text-align: ${isMobile ? 'center' : 'left'};">${website}</div>` : ''}
              ${address ? `<div style="text-align: ${isMobile ? 'center' : 'left'};">${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `
    };
    return previews[templateId as keyof typeof previews] || previews['minimal-1'];
  })();
</script>

<!-- Contenedor principal con diseño premium -->
<div class="h-full">
  {#if selectedTemplate}
    <!-- Vista previa con plantilla seleccionada -->
    <div class="space-y-6">
      <!-- Header del preview -->
      <div class="text-center space-y-4">
        <div class="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
          <div class="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
          <span class="text-emerald-300 font-bold text-sm">Vista Previa</span>
        </div>
        
        <!-- Controles de vista responsiva -->
        <div class="flex justify-center space-x-2">
          <button 
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 {viewMode === 'desktop' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
            on:click={() => viewMode = 'desktop'}
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H9.2l-.9 2H9.2l.771-2z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm font-medium">Escritorio</span>
          </button>
          
          <button 
            class="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 {viewMode === 'mobile' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
            on:click={() => viewMode = 'mobile'}
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM6 4a1 1 0 011-1h6a1 1 0 011 1v10a1 1 0 01-1 1H7a1 1 0 01-1-1V4zm2 12a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm font-medium">Móvil</span>
          </button>
        </div>
        <h3 class="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {selectedTemplate.name}
        </h3>
        <p class="text-slate-400 text-sm">
          Categoría: <span class="text-cyan-300 font-medium">{selectedTemplate.category}</span>
        </p>
      </div>

      <!-- Simulación de email -->
      <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <!-- Header del email simulado -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
            </div>
            <div>
              <p class="text-white font-bold text-sm">Nuevo Email</p>
              <p class="text-slate-400 text-xs">Así se verá tu firma</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <!-- Contenido del email -->
        <div class="space-y-4 mb-6">
          <div class="text-slate-300 text-sm">
            <p class="mb-2">Hola equipo,</p>
            <p class="mb-2">Espero que tengan un excelente día. Adjunto encontrarán el reporte solicitado.</p>
            <p class="mb-4">Saludos cordiales,</p>
          </div>
        </div>

        <!-- Línea separadora -->
        <div class="border-t border-slate-700 mb-6"></div>

        <!-- Vista previa de la firma -->
        <div class="signature-preview-container {viewMode === 'mobile' ? 'mobile-view' : 'desktop-view'}">
          <div class="signature-content">
            {@html templatePreviewHtml}
          </div>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="text-center space-y-4">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-3 backdrop-blur-sm">
            <div class="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <p class="text-cyan-300 text-xs font-bold">Responsive</p>
          </div>
          <div class="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-3 backdrop-blur-sm">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM16 8a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-2z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <p class="text-purple-300 text-xs font-bold">Profesional</p>
          </div>
          <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 backdrop-blur-sm">
            <div class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <p class="text-emerald-300 text-xs font-bold">Rápido</p>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- Estado sin selección -->
    <div class="flex flex-col items-center justify-center h-full text-center space-y-6">
      <!-- Icono central animado -->
      <div class="relative">
        <div class="w-24 h-24 bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-full flex items-center justify-center border-4 border-dashed border-slate-600/50 backdrop-blur-sm">
          <svg class="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </div>
        <!-- Anillos animados -->
        <div class="absolute inset-0 w-24 h-24 border-2 border-slate-600/30 rounded-full animate-ping" style="animation-duration: 3s;"></div>
        <div class="absolute inset-2 w-20 h-20 border border-slate-500/20 rounded-full animate-ping" style="animation-duration: 2s; animation-delay: 1s;"></div>
      </div>

      <!-- Texto informativo -->
      <div class="space-y-3 max-w-sm">
        <h3 class="text-2xl font-bold text-slate-300">
          Vista Previa
        </h3>
        <p class="text-slate-400 leading-relaxed">
          Selecciona una plantilla del panel izquierdo para ver cómo se verá tu firma de email profesional
        </p>
      </div>

      <!-- Indicadores -->
      <div class="flex space-x-2">
        <div class="w-3 h-3 bg-slate-600 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
        <div class="w-3 h-3 bg-slate-600 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
        <div class="w-3 h-3 bg-slate-600 rounded-full animate-bounce" style="animation-delay: 0.4s;"></div>
      </div>
    </div>
  {/if}
</div>