<script lang="ts">
  import { signatureData } from '../stores/signature.js';
  import { templates } from '../data/templates.js';
  import type { Template } from '../stores/signature.js';

  $: selectedTemplateId = $signatureData.templateId;
  $: selectedTemplate = selectedTemplateId ? templates.find((t: Template) => t.id === selectedTemplateId) : null;
  
  // Estado para vista responsiva
  let viewMode: 'desktop' | 'mobile' = 'desktop';
  
  // Key reactivo para forzar actualización cuando cambian datos profundos
  $: updateKey = JSON.stringify({
    image: $signatureData.image,
    name: $signatureData.name,
    fullName: $signatureData.fullName,
    title: $signatureData.title,
    company: $signatureData.company,
    email: $signatureData.email,
    phone: $signatureData.phone,
    primaryColor: $signatureData.primaryColor,
    templateId: $signatureData.templateId
  });
  
  // Función reactiva que se recalcula cuando cambian los datos del store, el templateId o el viewMode
  $: templatePreviewHtml = (() => {
    // Forzar dependencia en updateKey para recalcular cuando cambia cualquier dato
    const _ = updateKey;
    
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
    
    // Función para generar imagen de perfil
    const getImageHtml = (forDesktop = false) => {
      if (!$signatureData.image?.url) return '';
      
      const imageData = $signatureData.image;
      const size = imageData.size || 'medium';
      const shape = imageData.shape || 'circle';
      
      // Tamaños más grandes según el dispositivo y configuración
      const sizeMap = {
        small: isMobile ? '60px' : '80px',
        medium: isMobile ? '70px' : '100px',
        large: isMobile ? '80px' : '120px'
      };
      
      const imageSize = sizeMap[size];
      
      // Estilos según la forma
      const shapeStyles = {
        circle: 'border-radius: 50%;',
        square: 'border-radius: 0;',
        rounded: 'border-radius: 12px;'
      };
      
      const shapeStyle = shapeStyles[shape];
      
      // En móvil, la imagen debe ir arriba de todo y centrada
      if (isMobile) {
        return `
          <div style="text-align: center; margin-bottom: 16px; width: 100%; padding: 0;">
            <img 
              src="${imageData.url}" 
              alt="Foto de perfil" 
              style="
                width: ${imageSize}; 
                height: ${imageSize}; 
                object-fit: cover; 
                ${shapeStyle}
                border: 3px solid ${primaryColor}40;
                display: block;
                margin: 0 auto;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              " 
            />
          </div>
        `;
      }
      
      // En desktop, usar un contenedor más robusto para evitar recortes
      return `
        <div style="
          display: flex; 
          align-items: center; 
          justify-content: center;
          flex-shrink: 0;
          margin-right: ${forDesktop ? '0' : '16px'}; 
          margin-bottom: ${forDesktop ? '16px' : '0'};
          padding: 4px;
          width: ${forDesktop ? 'auto' : `calc(${imageSize} + 12px)`};
          height: ${forDesktop ? 'auto' : `calc(${imageSize} + 12px)`};
        ">
          <img 
            src="${imageData.url}" 
            alt="Foto de perfil" 
            style="
              width: ${imageSize}; 
              height: ${imageSize}; 
              object-fit: cover; 
              ${shapeStyle}
              border: 3px solid ${primaryColor}40;
              display: block;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            " 
          />
        </div>
      `;
    };
    
    // Función para generar iconos de redes sociales
    const getSocialIcons = () => {
      const socials = [];
      
      if (linkedin) {
        socials.push(`
          <a href="${linkedin}" style="text-decoration: none; margin-right: 4px; display: inline-block;">
            <img src="https://img.icons8.com/fluency/48/linkedin.png" alt="LinkedIn" style="width: ${isMobile ? '14px' : '16px'}; height: ${isMobile ? '14px' : '16px'}; vertical-align: middle;" />
          </a>
        `);
      }
      
      if (twitter) {
        socials.push(`
          <a href="${twitter}" style="text-decoration: none; margin-right: 4px; display: inline-block;">
            <img src="https://img.icons8.com/ios-filled/50/twitterx--v1.png" alt="Twitter/X" style="width: ${isMobile ? '14px' : '16px'}; height: ${isMobile ? '14px' : '16px'}; vertical-align: middle;" />
          </a>
        `);
      }
      
      if (github) {
        socials.push(`
          <a href="${github}" style="text-decoration: none; margin-right: 4px; display: inline-block;">
            <img src="https://img.icons8.com/glyph-neue/64/github.png" alt="GitHub" style="width: ${isMobile ? '14px' : '16px'}; height: ${isMobile ? '14px' : '16px'}; vertical-align: middle;" />
          </a>
        `);
      }
      
      if (instagram) {
        socials.push(`
          <a href="${instagram}" style="text-decoration: none; margin-right: 4px; display: inline-block;">
            <img src="https://img.icons8.com/3d-fluency/94/instagram-logo.png" alt="Instagram" style="width: ${isMobile ? '14px' : '16px'}; height: ${isMobile ? '14px' : '16px'}; vertical-align: middle;" />
          </a>
        `);
      }
      
      return socials.length > 0 ? `
        <div style="margin-top: ${isMobile ? '8px' : '10px'}; display: flex; align-items: center; justify-content: center; gap: 2px;">
          ${socials.join('')}
        </div>
      ` : '';
    };

    // Plantillas con diseños completamente únicos
    const previews = {
      // MINIMAL CLEAN - Diseño ultra limpio con imagen a la izquierda en desktop
      'minimal-1': `
        <div style="${fontStyle} max-width: 650px; width: 100%; ${isMobile ? 'text-align: center; padding: 20px;' : 'display: flex; align-items: flex-start; gap: 20px; padding: 16px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '14px' : '16px'}; font-weight: 600; line-height: 1.2;">${name}</h3>
            <p style="color: ${accentColor}; margin: 0 0 3px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 500;">${title}</p>
            ${company !== 'Tu empresa' ? `<p style="color: #666; margin: 0 0 6px 0; font-size: ${isMobile ? '10px' : '11px'}; font-style: italic;">${company}${department}</p>` : ''}
            
            <div style="margin-top: 6px; font-size: ${isMobile ? '9px' : '10px'}; color: #555; line-height: 1.3;">
              ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 2px;">${email}</div>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 2px;">${phone}</div>` : ''}
              ${website ? `<div style="margin-bottom: 2px;">${website}</div>` : ''}
              ${address ? `<div>${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // MINIMAL LINES - Con líneas separadoras elegantes
      'minimal-2': `
        <div style="${fontStyle} max-width: 670px; width: 100%; ${isMobile ? 'text-align: center; padding: 20px;' : 'display: flex; align-items: flex-start; gap: 20px; padding: 16px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: ${isMobile ? '15px' : '17px'}; font-weight: 300; letter-spacing: 0.5px;">${name}</h3>
            <div style="width: 20px; height: 1px; background: ${accentColor}; margin: 0 ${isMobile ? 'auto' : '0'} 4px ${isMobile ? 'auto' : '0'};"></div>
            <p style="color: ${accentColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">${title}</p>
            ${company !== 'Tu empresa' ? `<p style="color: #777; margin: 0 0 6px 0; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 400;">${company}${department}</p>` : ''}
            
            <div style="border-top: 1px solid #e0e0e0; padding-top: 4px; margin-top: 4px; font-size: ${isMobile ? '9px' : '10px'}; color: #666;">
              ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 2px; display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/fluency/48/mail--v1.png" alt="Email" style="width: 10px; height: 10px;" /> ${email}</div>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 2px; display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/color/48/phone.png" alt="Phone" style="width: 10px; height: 10px;" /> ${phone}</div>` : ''}
              ${website ? `<div style="margin-bottom: 2px; display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/color/48/internet--v1.png" alt="Website" style="width: 10px; height: 10px;" /> ${website}</div>` : ''}
              ${address ? `<div style="display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/external-place-essentials-icongeek26-flat-icongeek26.png" alt="Address" style="width: 10px; height: 10px;" /> ${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // PROFESSIONAL EXECUTIVE - Diseño ejecutivo con jerarquía clara
      'professional-1': `
        <div style="${fontStyle} max-width: 690px; width: 100%; ${isMobile ? 'padding: 20px; text-align: center;' : 'display: flex; align-items: flex-start; gap: 24px; padding: 18px; border-left: 4px solid ' + primaryColor + ';'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: ${isMobile ? '16px' : '18px'}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${name}</h3>
            <p style="color: ${accentColor}; margin: 0 0 2px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 600; letter-spacing: 0.5px;">${title}</p>
            ${company !== 'Tu empresa' ? `<p style="color: #333; margin: 0 0 8px 0; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500; border-bottom: 1px solid #ddd; padding-bottom: 4px;">${company}${department}</p>` : ''}
            
            <table style="width: 100%; font-size: ${isMobile ? '9px' : '10px'}; color: #555;">
              ${email !== 'tu.email@empresa.com' ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor};">EMAIL:</td><td style="padding: 1px 0;">${email}</td></tr>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor};">PHONE:</td><td style="padding: 1px 0;">${phone}</td></tr>` : ''}
              ${website ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor};">WEB:</td><td style="padding: 1px 0;">${website}</td></tr>` : ''}
              ${address ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor};">ADDRESS:</td><td style="padding: 1px 0;">${address}</td></tr>` : ''}
            </table>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // PROFESSIONAL MODERN - Moderno con estructura equilibrada
      'professional-2': `
        <div style="${fontStyle} max-width: 710px; width: 100%; ${isMobile ? 'padding: 20px; text-align: center;' : 'display: flex; align-items: flex-start; gap: 22px; background: linear-gradient(135deg, ' + primaryColor + '08, ' + accentColor + '05); padding: 20px; border-radius: 10px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '15px' : '17px'}; font-weight: 600; letter-spacing: 0.3px;">${name}</h3>
            <div style="background: ${accentColor}; color: white; display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: ${isMobile ? '9px' : '10px'}; font-weight: 600; margin-bottom: 6px;">${title.toUpperCase()}</div>
            ${company !== 'Tu empresa' ? `<p style="color: #444; margin: 0 0 8px 0; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500;">${company}${department}</p>` : ''}
            
            <div style="background: white; padding: 10px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); font-size: ${isMobile ? '9px' : '10px'}; color: #666;">
              ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 3px; display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/fluency/48/mail--v1.png" alt="Email" style="width: 12px; height: 12px;" /> ${email}</div>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 3px; display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/color/48/phone.png" alt="Phone" style="width: 12px; height: 12px;" /> ${phone}</div>` : ''}
              ${website ? `<div style="margin-bottom: 3px; display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/color/48/internet--v1.png" alt="Website" style="width: 12px; height: 12px;" /> ${website}</div>` : ''}
              ${address ? `<div style="display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/external-place-essentials-icongeek26-flat-icongeek26.png" alt="Address" style="width: 12px; height: 12px;" /> ${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // CREATIVE BOLD - Colores vibrantes y diseño dinámico
      'creative-1': `
        <div style="${fontStyle} max-width: 730px; width: 100%; ${isMobile ? 'padding: 24px; text-align: center;' : 'display: flex; align-items: flex-start; gap: 24px; background: linear-gradient(45deg, ' + primaryColor + '15, ' + accentColor + '15); padding: 24px; border-radius: 14px; border: 2px solid ' + primaryColor + '30;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="background: linear-gradient(45deg, ${primaryColor}, ${accentColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 6px 0; font-size: ${isMobile ? '18px' : '20px'}; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">${name}</h3>
            <div style="background: linear-gradient(135deg, ${accentColor}, ${primaryColor}); color: white; display: inline-block; padding: 4px 12px; border-radius: 18px; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 700; margin-bottom: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">${title}</div>
            ${company !== 'Tu empresa' ? `<p style="color: #333; margin: 0 0 10px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${company}${department}</p>` : ''}
            
            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); font-size: ${isMobile ? '9px' : '10px'}; color: #555;">
              ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px;"><span style="background: ${primaryColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/fluency/48/mail--v1.png" alt="Email" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> ${email}</div>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px;"><span style="background: ${accentColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/color/48/phone.png" alt="Phone" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> ${phone}</div>` : ''}
              ${website ? `<div style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px;"><span style="background: ${primaryColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/color/48/internet--v1.png" alt="Website" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> ${website}</div>` : ''}
              ${address ? `<div style="display: flex; align-items: center; gap: 6px;"><span style="background: ${accentColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/external-place-essentials-icongeek26-flat-icongeek26.png" alt="Address" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> ${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // CORPORATE PREMIUM - Diseño institucional de alta gama
      'corporate-1': `
        <div style="${fontStyle} max-width: 750px; width: 100%; ${isMobile ? 'padding: 22px; text-align: center;' : 'display: flex; align-items: flex-start; gap: 26px; background: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid ' + primaryColor + '; padding: 24px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile && $signatureData.image?.url ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: ${isMobile ? '16px' : '18px'}; font-weight: 400; letter-spacing: 0.5px; font-family: Georgia, serif;">${name}</h3>
            <div style="width: 40px; height: 2px; background: linear-gradient(to right, ${primaryColor}, ${accentColor}); margin: 0 ${isMobile ? 'auto' : '0'} 6px ${isMobile ? 'auto' : '0'};"></div>
            <p style="color: ${accentColor}; margin: 0 0 3px 0; font-size: ${isMobile ? '12px' : '13px'}; font-weight: 600; font-style: italic;">${title}</p>
            ${company !== 'Tu empresa' ? `<p style="color: #666; margin: 0 0 8px 0; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500; font-family: Georgia, serif;">${company}${department}</p>` : ''}
            
            <div style="border-top: 1px solid ${primaryColor}30; border-bottom: 1px solid ${primaryColor}30; padding: 8px 0; margin: 8px 0; font-size: ${isMobile ? '9px' : '10px'}; color: #555; font-family: Georgia, serif;">
              ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 3px; text-align: ${isMobile ? 'center' : 'left'};">${email}</div>` : ''}
              ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 3px; text-align: ${isMobile ? 'center' : 'left'};">${phone}</div>` : ''}
              ${website ? `<div style="margin-bottom: 3px; text-align: ${isMobile ? 'center' : 'left'};">${website}</div>` : ''}
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

      </div>

      <!-- Simulación de email compacta -->
      <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
        <!-- Header del email simulado compacto -->
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
            </div>
            <div>
              <p class="text-white font-bold text-xs">Nuevo Email</p>
              <p class="text-slate-400 text-xs">Así se verá tu firma</p>
            </div>
          </div>
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <!-- Contenido del email compacto -->
        <div class="mb-3">
          <div class="text-slate-300 text-xs">
            <p class="mb-1">Hola equipo,</p>
            <p class="mb-1">Espero que tengan un excelente día. Adjunto encontrarán el reporte solicitado.</p>
            <p class="mb-2">Saludos cordiales,</p>
          </div>
        </div>

        <!-- Línea separadora -->
        <div class="border-t border-slate-700 mb-3"></div>

        <!-- Vista previa de la firma -->
        <div class="signature-preview-container {viewMode === 'mobile' ? 'mobile-view' : 'desktop-view'}">
          <div class="signature-content signature-preview-content">
            {#key updateKey}
              {@html templatePreviewHtml}
            {/key}
          </div>
        </div>
      </div>

      <!-- Información adicional -->
      <div class="text-center space-y-4">

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