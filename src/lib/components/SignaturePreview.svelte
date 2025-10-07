<script lang="ts">
  import { signatureData } from '../stores/signature.js';
  import { templates } from '../data/templates.js';
  import type { Template } from '../stores/signature.js';
  import { placeholderData, getValueOrPlaceholder, shouldShowSection, hasUserData } from '../data/placeholders.js';

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
    
    // Determinar si mostrar placeholders (solo si no hay datos de usuario)
    const showPlaceholders = !hasUserData($signatureData);
    
    // Obtener valores reales o placeholders
    const name = getValueOrPlaceholder($signatureData.name || $signatureData.fullName, placeholderData.name, showPlaceholders);
    const title = getValueOrPlaceholder($signatureData.title || $signatureData.position, placeholderData.title, showPlaceholders);
    const company = getValueOrPlaceholder($signatureData.company, placeholderData.company, showPlaceholders);
    const department = $signatureData.department 
      ? ` - ${$signatureData.department}` 
      : (showPlaceholders ? ` - ${placeholderData.department}` : '');
    const email = getValueOrPlaceholder($signatureData.email, placeholderData.email, showPlaceholders);
    const phone = getValueOrPlaceholder($signatureData.phone, placeholderData.phone, showPlaceholders);
    const website = getValueOrPlaceholder($signatureData.website, placeholderData.website, showPlaceholders);
    const address = getValueOrPlaceholder($signatureData.address, placeholderData.address, showPlaceholders);
    
    // Redes sociales (solo mostrar si hay datos reales o si es placeholder)
    const linkedin = shouldShowSection($signatureData.linkedin, showPlaceholders) 
      ? ($signatureData.linkedin || (showPlaceholders ? placeholderData.linkedin : ''))
      : '';
    const twitter = shouldShowSection($signatureData.twitter, showPlaceholders)
      ? ($signatureData.twitter || (showPlaceholders ? placeholderData.twitter : ''))
      : '';
    const github = shouldShowSection($signatureData.github, showPlaceholders)
      ? ($signatureData.github || (showPlaceholders ? placeholderData.github : ''))
      : '';
    const instagram = shouldShowSection($signatureData.instagram, showPlaceholders)
      ? ($signatureData.instagram || (showPlaceholders ? placeholderData.instagram : ''))
      : '';
    
    // Valores de personalización
    const primaryColor = $signatureData.primaryColor || '#3b82f6';
    const accentColor = $signatureData.accentColor || '#8b5cf6';
    const fontFamily = $signatureData.fontFamily || 'modern';
    
    // Indicador visual de placeholder (opacidad y estilo)
    const placeholderStyle = showPlaceholders ? 'opacity: 0.7; font-style: italic;' : '';
    
    // Mapeo de familias de fuente (100% compatibles con clientes de email)
    const fontFamilyStyles = {
      modern: 'font-family: Helvetica, Verdana, Arial, sans-serif;',
      classic: 'font-family: Verdana, Geneva, Tahoma, sans-serif;',
      minimal: "font-family: 'Courier New', Courier, monospace;"
    };
    
    const fontStyle = fontFamilyStyles[fontFamily as keyof typeof fontFamilyStyles];
    
    // Función para generar imagen de perfil
    const getImageHtml = (forDesktop = false) => {
      // Usar imagen del usuario o placeholder
      const imageUrl = $signatureData.image?.url || (showPlaceholders ? placeholderData.imageUrl : '');
      
      if (!imageUrl) return '';
      
      const imageData = $signatureData.image || { 
        url: imageUrl, 
        size: 'medium' as const, 
        shape: 'circle' as const 
      };
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
          <div style="text-align: center; margin-bottom: 16px; width: 100%; padding: 0; ${showPlaceholders && !$signatureData.image?.url ? placeholderStyle : ''}">
            <img 
              src="${imageUrl}" 
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
      
      // En desktop, la imagen siempre a la izquierda
      return `
        <div style="
          display: flex; 
          align-items: center; 
          justify-content: center;
          flex-shrink: 0;
          margin-right: 16px;
          margin-bottom: 0;
          padding: 4px;
          ${showPlaceholders && !$signatureData.image?.url ? placeholderStyle : ''}
        ">
          <img 
            src="${imageUrl}" 
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
      // MINIMAL CLEAN - Diseño minimalista y limpio
      'minimal-1': `
        <div style="${fontStyle} max-width: 650px; width: 100%; ${isMobile ? 'text-align: center; padding: 20px;' : 'display: flex; align-items: center; gap: 20px; padding: 16px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '14px' : '16px'}; font-weight: 600; line-height: 1.2; ${placeholderStyle}">${name}</h3>
            <p style="color: ${accentColor}; margin: 0 0 3px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 500; ${placeholderStyle}">${title}</p>
            ${shouldShowSection($signatureData.company, showPlaceholders) ? `<p style="color: #666; margin: 0 0 6px 0; font-size: ${isMobile ? '10px' : '11px'}; font-style: italic; ${placeholderStyle}">${company}${department}</p>` : ''}
            
            <div style="margin-top: 6px; font-size: ${isMobile ? '9px' : '10px'}; color: #555; line-height: 1.3;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="margin-bottom: 2px; ${placeholderStyle}">${email}</div>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="margin-bottom: 2px; ${placeholderStyle}">${phone}</div>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="margin-bottom: 2px; ${placeholderStyle}">${website}</div>` : ''}
              ${shouldShowSection($signatureData.address, showPlaceholders) ? `<div style="${placeholderStyle}">${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // MINIMAL LINES - Con líneas separadoras elegantes
      'minimal-2': `
        <div style="${fontStyle} max-width: 670px; width: 100%; ${isMobile ? 'text-align: center; padding: 20px;' : 'display: flex; align-items: center; gap: 20px; padding: 16px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: ${isMobile ? '15px' : '17px'}; font-weight: 300; letter-spacing: 0.5px; ${placeholderStyle}">${name}</h3>
            <div style="width: 20px; height: 1px; background: ${accentColor}; margin: 0 ${isMobile ? 'auto' : '0'} 4px ${isMobile ? 'auto' : '0'};"></div>
            <p style="color: ${accentColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; ${placeholderStyle}">${title}</p>
            ${shouldShowSection($signatureData.company, showPlaceholders) ? `<p style="color: #777; margin: 0 0 6px 0; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 400; ${placeholderStyle}">${company}${department}</p>` : ''}
            
            <div style="border-top: 1px solid #e0e0e0; padding-top: 4px; margin-top: 4px; font-size: ${isMobile ? '9px' : '10px'}; color: #666;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="margin-bottom: 2px; display: flex; align-items: center; gap: 4px; ${placeholderStyle}"><img src="https://img.icons8.com/fluency/48/mail--v1.png" alt="Email" style="width: 10px; height: 10px;" /> ${email}</div>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="margin-bottom: 2px; display: flex; align-items: center; gap: 4px; ${placeholderStyle}"><img src="https://img.icons8.com/color/48/phone.png" alt="Phone" style="width: 10px; height: 10px;" /> ${phone}</div>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="margin-bottom: 2px; display: flex; align-items: center; gap: 4px; ${placeholderStyle}"><img src="https://img.icons8.com/color/48/internet--v1.png" alt="Website" style="width: 10px; height: 10px;" /> ${website}</div>` : ''}
              ${shouldShowSection($signatureData.address, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 4px; ${placeholderStyle}"><img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/external-place-essentials-icongeek26-flat-icongeek26.png" alt="Address" style="width: 10px; height: 10px;" /> ${address}</div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // PROFESSIONAL EXECUTIVE - Diseño ejecutivo con jerarquía clara
      'professional-1': `
        <div style="${fontStyle} max-width: 690px; width: 100%; ${isMobile ? 'padding: 20px; text-align: center;' : 'display: flex; align-items: center; gap: 24px; padding: 18px; border-left: 4px solid ' + primaryColor + ';'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: ${isMobile ? '16px' : '18px'}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; ${placeholderStyle}">${name}</h3>
            <p style="color: ${accentColor}; margin: 0 0 2px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 600; letter-spacing: 0.5px; ${placeholderStyle}">${title}</p>
            ${shouldShowSection($signatureData.company, showPlaceholders) ? `<p style="color: #333; margin: 0 0 8px 0; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500; border-bottom: 1px solid #ddd; padding-bottom: 4px; ${placeholderStyle}">${company}${department}</p>` : ''}
            
            <table style="width: 100%; font-size: ${isMobile ? '9px' : '10px'}; color: #555;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor};">EMAIL:</td><td style="padding: 1px 0; ${placeholderStyle}">${email}</td></tr>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor};">PHONE:</td><td style="padding: 1px 0; ${placeholderStyle}">${phone}</td></tr>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor};">WEB:</td><td style="padding: 1px 0; ${placeholderStyle}">${website}</td></tr>` : ''}
              ${shouldShowSection($signatureData.address, showPlaceholders) ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor};">ADDRESS:</td><td style="padding: 1px 0; ${placeholderStyle}">${address}</td></tr>` : ''}
            </table>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // PROFESSIONAL MODERN - Moderno con estructura equilibrada
      'professional-2': `
        <div style="${fontStyle} max-width: 710px; width: 100%; ${isMobile ? 'padding: 20px; text-align: center;' : 'display: flex; align-items: center; gap: 22px; background: linear-gradient(135deg, ' + primaryColor + '08, ' + accentColor + '05); padding: 20px; border-radius: 10px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '15px' : '17px'}; font-weight: 600; letter-spacing: 0.3px; ${placeholderStyle}">${name}</h3>
            <div style="background: ${accentColor}; color: white; display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: ${isMobile ? '9px' : '10px'}; font-weight: 600; margin-bottom: 6px; ${placeholderStyle}">${title.toUpperCase()}</div>
            ${shouldShowSection($signatureData.company, showPlaceholders) ? `<p style="color: #444; margin: 0 0 8px 0; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500; ${placeholderStyle}">${company}${department}</p>` : ''}
            
            <div style="background: white; padding: 10px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); font-size: ${isMobile ? '9px' : '10px'}; color: #666;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="margin-bottom: 3px; display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/fluency/48/mail--v1.png" alt="Email" style="width: 12px; height: 12px;" /> <span style="${placeholderStyle}">${email}</span></div>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="margin-bottom: 3px; display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/color/48/phone.png" alt="Phone" style="width: 12px; height: 12px;" /> <span style="${placeholderStyle}">${phone}</span></div>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="margin-bottom: 3px; display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/color/48/internet--v1.png" alt="Website" style="width: 12px; height: 12px;" /> <span style="${placeholderStyle}">${website}</span></div>` : ''}
              ${shouldShowSection($signatureData.address, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 4px;"><img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/external-place-essentials-icongeek26-flat-icongeek26.png" alt="Address" style="width: 12px; height: 12px;" /> <span style="${placeholderStyle}">${address}</span></div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // CREATIVE BOLD - Colores vibrantes y diseño dinámico
      'creative-1': `
        <div style="${fontStyle} max-width: 730px; width: 100%; ${isMobile ? 'padding: 24px; text-align: center;' : 'display: flex; align-items: center; gap: 24px; background: linear-gradient(45deg, ' + primaryColor + '15, ' + accentColor + '15); padding: 24px; border-radius: 14px; border: 2px solid ' + primaryColor + '30;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="background: linear-gradient(45deg, ${primaryColor}, ${accentColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 6px 0; font-size: ${isMobile ? '18px' : '20px'}; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); ${placeholderStyle}">${name}</h3>
            <div style="background: linear-gradient(135deg, ${accentColor}, ${primaryColor}); color: white; display: inline-block; padding: 4px 12px; border-radius: 18px; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 700; margin-bottom: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); ${placeholderStyle}">${title}</div>
            ${shouldShowSection($signatureData.company, showPlaceholders) ? `<p style="color: #333; margin: 0 0 10px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; ${placeholderStyle}">${company}${department}</p>` : ''}
            
            <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); font-size: ${isMobile ? '9px' : '10px'}; color: #555;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px;"><span style="background: ${primaryColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/fluency/48/mail--v1.png" alt="Email" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> <span style="${placeholderStyle}">${email}</span></div>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px;"><span style="background: ${accentColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/color/48/phone.png" alt="Phone" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> <span style="${placeholderStyle}">${phone}</span></div>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="margin-bottom: 4px; display: flex; align-items: center; gap: 6px;"><span style="background: ${primaryColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/color/48/internet--v1.png" alt="Website" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> <span style="${placeholderStyle}">${website}</span></div>` : ''}
              ${shouldShowSection($signatureData.address, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 6px;"><span style="background: ${accentColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/external-place-essentials-icongeek26-flat-icongeek26.png" alt="Address" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> <span style="${placeholderStyle}">${address}</span></div>` : ''}
            </div>
            
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // CORPORATE PREMIUM - Diseño institucional de alta gama
      'corporate-1': `
        <div style="${fontStyle} max-width: 750px; width: 100%; ${isMobile ? 'padding: 22px; text-align: center;' : 'display: flex; align-items: center; gap: 26px; background: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid ' + primaryColor + '; padding: 24px;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: ${isMobile ? '16px' : '18px'}; font-weight: 400; letter-spacing: 0.5px; font-family: Verdana, Geneva, Tahoma, sans-serif; ${placeholderStyle}">${name}</h3>
            <div style="width: 40px; height: 2px; background: linear-gradient(to right, ${primaryColor}, ${accentColor}); margin: 0 ${isMobile ? 'auto' : '0'} 6px ${isMobile ? 'auto' : '0'};"></div>
            <p style="color: ${accentColor}; margin: 0 0 3px 0; font-size: ${isMobile ? '12px' : '13px'}; font-weight: 600; font-style: italic; ${placeholderStyle}">${title}</p>
            ${shouldShowSection($signatureData.company, showPlaceholders) ? `<p style="color: #666; margin: 0 0 8px 0; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500; font-family: Verdana, Geneva, Tahoma, sans-serif; ${placeholderStyle}">${company}${department}</p>` : ''}
            
            <div style="border-top: 1px solid ${primaryColor}30; border-bottom: 1px solid ${primaryColor}30; padding: 8px 0; margin: 8px 0; font-size: ${isMobile ? '9px' : '10px'}; color: #555; font-family: Verdana, Geneva, Tahoma, sans-serif;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="margin-bottom: 3px; text-align: ${isMobile ? 'center' : 'left'}; ${placeholderStyle}">${email}</div>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="margin-bottom: 3px; text-align: ${isMobile ? 'center' : 'left'}; ${placeholderStyle}">${phone}</div>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="margin-bottom: 3px; text-align: ${isMobile ? 'center' : 'left'}; ${placeholderStyle}">${website}</div>` : ''}
              ${shouldShowSection($signatureData.address, showPlaceholders) ? `<div style="text-align: ${isMobile ? 'center' : 'left'}; ${placeholderStyle}">${address}</div>` : ''}
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
      <!-- Simulación de email compacta -->
      <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
        <!-- Header del email simulado compacto -->
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
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