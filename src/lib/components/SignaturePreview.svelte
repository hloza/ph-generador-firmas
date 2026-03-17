<script lang="ts">
  import { signatureData } from '../stores/signature.js';
  import { templates } from '../data/templates.js';
  import type { Template } from '../stores/signature.js';
  import { placeholderData, getValueOrPlaceholder, shouldShowSection, hasUserData } from '../data/placeholders.js';

  const primaryColor = $signatureData.primaryColor || '#1e40af';
  const accentColor = $signatureData.accentColor || '#d97706';

  $: selectedTemplateId = $signatureData.templateId;
  $: selectedTemplate = selectedTemplateId ? templates.find((t: Template) => t.id === selectedTemplateId) : null;
  
  // Estado para vista responsiva
  export let viewMode: 'desktop' | 'mobile' = 'desktop';
  
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
    const getImageHtml = (forDesktop = false, forceTop = false) => {
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
      
      // En móvil, la imagen debe ir arriba de todo y centrada, o si se fuerza con forceTop
      if (isMobile || forceTop) {
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
          <a href="${linkedin}" style="text-decoration: none; margin-right: 6px; display: inline-block;">
            <img src="https://img.icons8.com/fluency/48/linkedin.png" alt="LinkedIn" style="width: ${isMobile ? '18px' : '22px'}; height: ${isMobile ? '18px' : '22px'}; vertical-align: middle;" />
          </a>
        `);
      }
      
      if (twitter) {
        socials.push(`
          <a href="${twitter}" style="text-decoration: none; margin-right: 6px; display: inline-block;">
            <img src="https://img.icons8.com/ios-filled/50/twitterx--v1.png" alt="Twitter/X" style="width: ${isMobile ? '18px' : '22px'}; height: ${isMobile ? '18px' : '22px'}; vertical-align: middle;" />
          </a>
        `);
      }
      
      if (github) {
        socials.push(`
          <a href="${github}" style="text-decoration: none; margin-right: 6px; display: inline-block;">
            <img src="https://img.icons8.com/glyph-neue/64/github.png" alt="GitHub" style="width: ${isMobile ? '18px' : '22px'}; height: ${isMobile ? '18px' : '22px'}; vertical-align: middle;" />
          </a>
        `);
      }
      
      if (instagram) {
        socials.push(`
          <a href="${instagram}" style="text-decoration: none; margin-right: 6px; display: inline-block;">
            <img src="https://img.icons8.com/3d-fluency/94/instagram-logo.png" alt="Instagram" style="width: ${isMobile ? '18px' : '22px'}; height: ${isMobile ? '18px' : '22px'}; vertical-align: middle;" />
          </a>
        `);
      }
      
      return socials.length > 0 ? `
        <div style="margin-top: ${isMobile ? '8px' : '10px'}; display: flex; align-items: center; ${isMobile ? 'justify-content: center;' : 'justify-content: flex-start;'} gap: 4px;">
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
        <div style="${fontStyle} max-width: 710px; width: 100%; ${isMobile ? 'padding: 20px; text-align: center;' : 'display: flex; align-items: center; gap: 22px; background: ' + primaryColor + '08; padding: 20px; border-radius: 10px;'}">
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
        <div style="${fontStyle} max-width: 730px; width: 100%; ${isMobile ? 'padding: 24px; text-align: center;' : 'display: flex; align-items: center; gap: 24px; background: ' + primaryColor + '15; padding: 24px; border-radius: 14px; border: 2px solid ' + primaryColor + '30;'}">
          ${isMobile ? getImageHtml() : ''}
          ${!isMobile ? getImageHtml(true) : ''}
          <div style="${isMobile ? '' : 'flex: 1; min-width: 0;'}">
            <h3 style="color: ${primaryColor}; margin: 0 0 6px 0; font-size: ${isMobile ? '18px' : '20px'}; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); ${placeholderStyle}">${name}</h3>
            <div style="background: ${accentColor}; color: white; display: inline-block; padding: 4px 12px; border-radius: 18px; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 700; margin-bottom: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); ${placeholderStyle}">${title}</div>
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
            <div style="width: 40px; height: 2px; background: ${primaryColor}; margin: 0 ${isMobile ? 'auto' : '0'} 6px ${isMobile ? 'auto' : '0'};"></div>
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
      `,

      // CORPORATE CENTERED - Imagen en la parte superior, contenido centrado
      'corporate-center': `
        <div style="${fontStyle} max-width: 600px; width: 100%; text-align: center; background: white; border: 1px solid #eaeaea; border-top: 5px solid ${primaryColor}; padding: 30px 20px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          ${getImageHtml(false, true)}
          <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '18px' : '22px'}; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; ${placeholderStyle}">${name}</h3>
          <p style="color: ${accentColor}; margin: 0 0 12px 0; font-size: ${isMobile ? '12px' : '14px'}; font-weight: 500; letter-spacing: 0.5px; ${placeholderStyle}">${title}</p>
          ${shouldShowSection($signatureData.company, showPlaceholders) ? `<p style="color: #444; margin: 0 0 16px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; ${placeholderStyle}">${company}${department}</p>` : ''}
          
          <div style="width: 50px; height: 2px; background: ${accentColor}; margin: 0 auto 16px auto;"></div>
          
          <div style="font-size: ${isMobile ? '10px' : '11px'}; color: #666; line-height: 1.6;">
            ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="margin-bottom: 4px; ${placeholderStyle}"><strong>Email:</strong> <span style="color: ${primaryColor}">${email}</span></div>` : ''}
            ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="margin-bottom: 4px; ${placeholderStyle}"><strong>Teléfono:</strong> ${phone}</div>` : ''}
            ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="margin-bottom: 4px; ${placeholderStyle}"><strong>Web:</strong> ${website}</div>` : ''}
            ${shouldShowSection($signatureData.address, showPlaceholders) ? `<div style="${placeholderStyle}"><strong>Dirección:</strong> ${address}</div>` : ''}
          </div>
          
          <div style="margin-top: 16px; display: inline-block;">
            ${getSocialIcons()}
          </div>
        </div>
      `,

      // CORPORATE BANNER - Banner coloreado en la parte superior
      'corporate-banner': `
        <div style="${fontStyle} max-width: 650px; width: 100%; overflow: hidden; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.08); background: white; border: 1px solid #f0f0f0;">
          <div style="background: linear-gradient(135deg, ${primaryColor}, ${accentColor}); padding: 30px; text-align: center;">
            ${getImageHtml(false, true).replace(/border: 3px solid.*?;/g, 'border: 4px solid white;').replace(/margin-bottom: 16px;/g, 'margin-bottom: -60px; position: relative; z-index: 10;')}
          </div>
          <div style="padding: 50px 30px 30px 30px; text-align: center; background: white;">
            <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '18px' : '22px'}; font-weight: 800; ${placeholderStyle}">${name}</h3>
            <p style="color: ${accentColor}; margin: 0 0 8px 0; font-size: ${isMobile ? '11px' : '13px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; ${placeholderStyle}">${title}</p>
            ${shouldShowSection($signatureData.company, showPlaceholders) ? `<p style="color: #666; margin: 0 0 16px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 500; ${placeholderStyle}">${company}${department}</p>` : ''}
            
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 20px; font-size: ${isMobile ? '9px' : '11px'}; color: #555; border-top: 1px solid #eee; padding-top: 20px;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 5px; ${placeholderStyle}"><img src="https://img.icons8.com/fluency/48/mail--v1.png" style="width:14px;height:14px;" alt="email"/> ${email}</div>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 5px; ${placeholderStyle}"><img src="https://img.icons8.com/color/48/phone.png" style="width:14px;height:14px;" alt="phone"/> ${phone}</div>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 5px; ${placeholderStyle}"><img src="https://img.icons8.com/color/48/internet--v1.png" style="width:14px;height:14px;" alt="web"/> ${website}</div>` : ''}
            </div>
            
            <div style="margin-top: 20px; display: flex; justify-content: center;">
              ${getSocialIcons()}
            </div>
          </div>
        </div>
      `,

      'modern': `
        <div style="${fontStyle} max-width: 500px; width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);">
          <div style="padding: 24px; border-bottom: 4px solid ${primaryColor};">
            <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: 20px; font-weight: 700; ${placeholderStyle}">${name}</h3>
            <p style="color: #64748b; margin: 0; font-size: 14px; font-weight: 500; ${placeholderStyle}">${title}</p>
          </div>
          <div style="padding: 24px; background: #f8fafc;">
            <div style="display: flex; flex-direction: column; gap: 10px; color: #334155; font-size: 13px; margin-bottom: 20px;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 8px; ${placeholderStyle}"><span style="color: ${primaryColor};">✉</span> ${email}</div>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 8px; ${placeholderStyle}"><span style="color: ${primaryColor};">☎</span> ${phone}</div>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 8px; ${placeholderStyle}"><span style="color: ${primaryColor};">🌐</span> ${website}</div>` : ''}
            </div>
            <div style="display: flex; gap: 12px;">
              ${getSocialIcons()}
            </div>
          </div>
        </div>
      `,

      'minimal': `
        <div style="${fontStyle} max-width: 450px; width: 100%; border-left: 3px solid ${primaryColor}; padding: 10px 0 10px 20px; color: #333;">
          <h3 style="color: #000; margin: 0 0 2px 0; font-size: 18px; font-weight: 700; ${placeholderStyle}">${name}</h3>
          <p style="color: ${primaryColor}; margin: 0 0 12px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; ${placeholderStyle}">${title}</p>
          <div style="font-size: 12px; line-height: 1.6; color: #666;">
            ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="${placeholderStyle}">${email}</div>` : ''}
            ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="${placeholderStyle}">${phone}</div>` : ''}
            ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="${placeholderStyle}">${website}</div>` : ''}
            <div style="margin-top: 10px;">
              ${getSocialIcons()}
            </div>
          </div>
        </div>
      `,

      'classic': `
        <div style="${fontStyle} max-width: 500px; width: 100%; padding: 20px; background: #ffffff; border: 1px solid #eee; border-radius: 4px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top;">
                <h3 style="color: #333; margin: 0 0 4px 0; font-size: 22px; font-weight: bold; ${placeholderStyle}">${name}</h3>
                <p style="color: #666; margin: 0 0 16px 0; font-size: 14px; ${placeholderStyle}">${title}</p>
                <div style="font-size: 12px; color: #444; line-height: 1.8;">
                  ${shouldShowSection($signatureData.company, showPlaceholders) ? `<div style="${placeholderStyle}"><strong>${company}</strong> | ${department}</div>` : ''}
                  ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="${placeholderStyle}">Email: ${email}</div>` : ''}
                  ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="${placeholderStyle}">Tel: ${phone}</div>` : ''}
                </div>
                <div style="margin-top: 15px;">
                  ${getSocialIcons()}
                </div>
              </td>
            </tr>
          </table>
        </div>
      `,

      'professional': `
        <div style="${fontStyle} max-width: 550px; width: 100%; display: flex; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <div style="padding: 24px; flex: 1;">
            <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: 20px; font-weight: 700; ${placeholderStyle}">${name}</h3>
            <p style="color: #334155; font-weight: 600; margin: 0 0 16px 0; font-size: 14px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; ${placeholderStyle}">${title}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; color: #475569;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="${placeholderStyle}">📧 ${email}</div>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="${placeholderStyle}">📱 ${phone}</div>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="${placeholderStyle}">🌐 ${website}</div>` : ''}
              ${shouldShowSection($signatureData.address, showPlaceholders) ? `<div style="${placeholderStyle}">📍 ${address}</div>` : ''}
            </div>
            <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
              ${getSocialIcons()}
            </div>
          </div>
        </div>
      `,

      'creative': `
        <div style="${fontStyle} max-width: 500px; width: 100%; background: #ffffff; border-radius: 20px; border: 2px solid ${primaryColor}; padding: 30px; text-align: center; position: relative; overflow: hidden;">
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 10px; background: linear-gradient(to right, ${primaryColor}, ${accentColor});"></div>
          
          <h3 style="color: #1e293b; margin: 0 0 4px 0; font-size: 24px; font-weight: 900; ${placeholderStyle}">${name}</h3>
          <span style="display: inline-block; background: ${primaryColor}15; color: ${primaryColor}; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; margin-bottom: 20px; ${placeholderStyle}">${title}</span>
          
          <div style="color: #64748b; font-size: 13px; margin-bottom: 25px;">
            ${shouldShowSection($signatureData.company, showPlaceholders) ? `<p style="color: #666; margin: 0 0 16px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 500; ${placeholderStyle}">${company}${department}</p>` : ''}
            
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 20px; font-size: ${isMobile ? '9px' : '11px'}; color: #555; border-top: 1px solid #eee; padding-top: 20px;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 5px; ${placeholderStyle}"><img src="https://img.icons8.com/fluency/48/mail--v1.png" style="width:14px;height:14px;" alt="email"/> ${email}</div>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 5px; ${placeholderStyle}"><img src="https://img.icons8.com/color/48/phone.png" style="width:14px;height:14px;" alt="phone"/> ${phone}</div>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 5px; ${placeholderStyle}"><img src="https://img.icons8.com/color/48/internet--v1.png" style="width:14px;height:14px;" alt="web"/> ${website}</div>` : ''}
            </div>
            
            <div style="margin-top: 20px; display: flex; justify-content: center;">
              ${getSocialIcons()}
            </div>
          </div>
        </div>
      `,

      // CORPORATE ELEGANCE - Diseño asimétrico elegante (40/60 split)
      'corporate-elegance': `
        <div style="${fontStyle} max-width: 750px; width: 100%; display: flex; ${isMobile ? 'flex-direction: column;' : 'flex-direction: row;'} background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), border-top: 4px solid ${primaryColor};">
          
          <!-- LEFT COLUMN: 40% -->
          <div style="${isMobile ? 'width: 100%; border-bottom: 1px solid #e2e8f0; padding: 30px;' : 'width: 40%; border-right: 1px solid #e2e8f0; padding: 40px 20px;'} display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f8fafc;">
            ${getImageHtml()}
            <div style="margin-top: 15px; width: 100%; display: flex; justify-content: center;">
              ${getSocialIcons()}
            </div>
          </div>
          
          <!-- RIGHT COLUMN: 60% -->
          <div style="${isMobile ? 'width: 100%; padding: 30px;' : 'width: 60%; padding: 40px 30px;'} display: flex; flex-direction: column; justify-content: center;">
            <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '20px' : '24px'}; font-weight: 700; letter-spacing: -0.5px; ${placeholderStyle}">${name}</h3>
            <p style="color: ${accentColor}; margin: 0 0 16px 0; font-size: ${isMobile ? '12px' : '14px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; ${placeholderStyle}">${title}</p>
            
            ${shouldShowSection($signatureData.company, showPlaceholders) ? `<p style="color: #475569; margin: 0 0 20px 0; font-size: ${isMobile ? '11px' : '13px'}; font-weight: 500; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; display: inline-block; ${placeholderStyle}">${company}${department}</p>` : ''}
            
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: ${isMobile ? '11px' : '12px'}; color: #475569;">
              ${shouldShowSection($signatureData.email, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 10px; ${placeholderStyle}"> ${email}</div>` : ''}
              ${shouldShowSection($signatureData.phone, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 10px; ${placeholderStyle}"> ${phone}</div>` : ''}
              ${shouldShowSection($signatureData.website, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 10px; ${placeholderStyle}"> ${website}</div>` : ''}
              ${shouldShowSection($signatureData.address, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 10px; ${placeholderStyle}"> ${address}</div>` : ''}
            </div>
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
    <!-- Vista previa de la firma sin marco decorativo -->
    <div class="signature-preview-container {viewMode === 'mobile' ? 'mobile-view' : 'desktop-view'}">
      <div class="signature-content signature-preview-content">
        {#key updateKey}
          {@html templatePreviewHtml}
        {/key}
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
        <div class="w-24 h-24 bg-slate-700/30 rounded-full flex items-center justify-center border-4 border-dashed border-slate-600/50 backdrop-blur-sm">
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