import type { SignatureData } from "../stores/signature.js";
import { placeholderData, getValueOrPlaceholder, shouldShowSection, hasUserData } from "../data/placeholders.js";

export function generateSignatureHTML(data: SignatureData, forMobile: boolean = false): string {
  const templateId = data.templateId;
  const isMobile = forMobile; // Usar el parámetro para determinar si es móvil
  
  // Determinar si mostrar placeholders (solo si no hay datos de usuario)
  const showPlaceholders = !hasUserData(data);
  
  // Obtener valores reales o placeholders
  const name = getValueOrPlaceholder(data.name || data.fullName, placeholderData.name, showPlaceholders);
  const title = getValueOrPlaceholder(data.title || data.position, placeholderData.title, showPlaceholders);
  const company = getValueOrPlaceholder(data.company, placeholderData.company, showPlaceholders);
  const department = data.department 
    ? ` - ${data.department}` 
    : (showPlaceholders ? ` - ${placeholderData.department}` : '');
  const email = getValueOrPlaceholder(data.email, placeholderData.email, showPlaceholders);
  const phone = getValueOrPlaceholder(data.phone, placeholderData.phone, showPlaceholders);
  const website = getValueOrPlaceholder(data.website, placeholderData.website, showPlaceholders);
  const address = getValueOrPlaceholder(data.address, placeholderData.address, showPlaceholders);
  
  // Redes sociales (solo mostrar si hay datos reales o si es placeholder)
  const linkedin = shouldShowSection(data.linkedin, showPlaceholders) 
    ? (data.linkedin || (showPlaceholders ? placeholderData.linkedin : ''))
    : '';
  const twitter = shouldShowSection(data.twitter, showPlaceholders)
    ? (data.twitter || (showPlaceholders ? placeholderData.twitter : ''))
    : '';
  const github = shouldShowSection(data.github, showPlaceholders)
    ? (data.github || (showPlaceholders ? placeholderData.github : ''))
    : '';
  const instagram = shouldShowSection(data.instagram, showPlaceholders)
    ? (data.instagram || (showPlaceholders ? placeholderData.instagram : ''))
    : '';
  
  // Valores de personalización
  const primaryColor = data.primaryColor || '#1e40af';
  const accentColor = data.accentColor || '#d97706';
  const fontFamily = data.fontFamily || 'modern';
  
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
    const imageUrl = data.image?.url || (showPlaceholders ? placeholderData.imageUrl : '');
    
    if (!imageUrl) return '';
    
    const imageData = data.image || { 
      url: imageUrl, 
      size: 'medium' as const, 
      shape: 'circle' as const 
    };
    const size = imageData.size || 'medium';
    const shape = imageData.shape || 'circle';
    
    // Tamaños más grandes para evitar recortes
    const sizeMap = {
      small: '80px',
      medium: '100px', 
      large: '120px'
    };
    
    const imageSize = sizeMap[size];
    
    // Estilos según la forma
    const shapeStyles = {
      circle: 'border-radius: 50%;',
      square: 'border-radius: 0;',
      rounded: 'border-radius: 12px;'
    };
    
    const shapeStyle = shapeStyles[shape];
    
    // En móvil: imagen arriba centrada, en desktop: imagen a la izquierda, o forzado por forceTop
    if (isMobile || forceTop) {
      return `
        <div style="
          display: flex; 
          align-items: center; 
          justify-content: center;
          flex-shrink: 0;
          margin-right: 0;
          margin-bottom: 16px;
          padding: 4px;
          width: 100%;
          ${showPlaceholders && !data.image?.url ? placeholderStyle : ''}
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
    }
    
    // Desktop: imagen a la izquierda
    return `
      <div style="
        display: flex; 
        align-items: center; 
        justify-content: center;
        flex-shrink: 0;
        margin-right: 16px;
        margin-bottom: 0;
        padding: 4px;
        ${showPlaceholders && !data.image?.url ? placeholderStyle : ''}
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
          <img src="https://img.icons8.com/fluency/48/linkedin.png" alt="LinkedIn" style="width: 22px; height: 22px; vertical-align: middle;" />
        </a>
      `);
    }
    
    if (twitter) {
      socials.push(`
        <a href="${twitter}" style="text-decoration: none; margin-right: 6px; display: inline-block;">
          <img src="https://img.icons8.com/ios-filled/50/twitterx--v1.png" alt="Twitter/X" style="width: 22px; height: 22px; vertical-align: middle;" />
        </a>
      `);
    }
    
    if (github) {
      socials.push(`
        <a href="${github}" style="text-decoration: none; margin-right: 6px; display: inline-block;">
          <img src="https://img.icons8.com/glyph-neue/64/github.png" alt="GitHub" style="width: 22px; height: 22px; vertical-align: middle;" />
        </a>
      `);
    }
    
    if (instagram) {
      socials.push(`
        <a href="${instagram}" style="text-decoration: none; margin-right: 6px; display: inline-block;">
          <img src="https://img.icons8.com/3d-fluency/94/instagram-logo.png" alt="Instagram" style="width: 22px; height: 22px; vertical-align: middle;" />
        </a>
      `);
    }
    
    return socials.length > 0 ? `
      <div style="margin-top: 10px; display: flex; align-items: center; ${isMobile ? 'justify-content: center;' : 'justify-content: flex-start;'} gap: 4px;">
        ${socials.join('')}
      </div>
    ` : '';
  };

  // Plantillas con diseños completamente únicos
  const templates = {
    // MINIMAL CLEAN - Diseño ultra limpio con imagen a la izquierda en desktop
    'minimal-1': `
      <div style="${fontStyle} max-width: ${isMobile ? '400px' : '650px'}; width: 100%; display: flex; ${isMobile ? 'flex-direction: column; text-align: center;' : 'flex-direction: row;'} align-items: center; gap: 20px; padding: 16px;">
        ${getImageHtml(true)}
        <div style="flex: 1; min-width: 0; width: 100%;">
          <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: 16px; font-weight: 600; line-height: 1.2; ${placeholderStyle}">${name}</h3>
          <p style="color: ${accentColor}; margin: 0 0 3px 0; font-size: 12px; font-weight: 500; ${placeholderStyle}">${title}</p>
          ${shouldShowSection(data.company, showPlaceholders) ? `<p style="color: #666; margin: 0 0 6px 0; font-size: 11px; font-style: italic; ${placeholderStyle}">${company}${department}</p>` : ''}
          
          <div style="margin-top: 6px; font-size: 10px; color: #555; line-height: 1.3;">
            ${shouldShowSection(data.email, showPlaceholders) ? `<div style="margin-bottom: 2px; ${placeholderStyle}">${email}</div>` : ''}
            ${shouldShowSection(data.phone, showPlaceholders) ? `<div style="margin-bottom: 2px; ${placeholderStyle}">${phone}</div>` : ''}
            ${shouldShowSection(data.website, showPlaceholders) ? `<div style="margin-bottom: 2px; ${placeholderStyle}">${website}</div>` : ''}
            ${shouldShowSection(data.address, showPlaceholders) ? `<div style="${placeholderStyle}">${address}</div>` : ''}
          </div>
          
          ${getSocialIcons()}
        </div>
      </div>
    `,



    // PROFESSIONAL EXECUTIVE - Diseño ejecutivo con jerarquía clara
    'professional-1': `
      <div style="${fontStyle} max-width: ${isMobile ? '400px' : '690px'}; width: 100%; display: flex; ${isMobile ? 'flex-direction: column; text-align: center;' : 'flex-direction: row;'} align-items: center; gap: 24px; padding: 18px; ${isMobile ? '' : 'border-left: 4px solid ' + primaryColor + ';'}">
        ${getImageHtml(true)}
        <div style="flex: 1; min-width: 0; width: 100%;">
          <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; ${placeholderStyle}">${name}</h3>
          <p style="color: ${accentColor}; margin: 0 0 2px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; ${placeholderStyle}">${title}</p>
          ${shouldShowSection(data.company, showPlaceholders) ? `<p style="color: #333; margin: 0 0 8px 0; font-size: 11px; font-weight: 500; border-bottom: 1px solid #ddd; padding-bottom: 4px; ${placeholderStyle}">${company}${department}</p>` : ''}
          
          <table style="width: 100%; font-size: 10px; color: #555; ${isMobile ? 'margin: 0 auto;' : ''}">
            ${shouldShowSection(data.email, showPlaceholders) ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor}; ${isMobile ? 'text-align: right;' : ''}">EMAIL:</td><td style="padding: 1px 0; ${placeholderStyle} ${isMobile ? 'text-align: left;' : ''}">${email}</td></tr>` : ''}
            ${shouldShowSection(data.phone, showPlaceholders) ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor}; ${isMobile ? 'text-align: right;' : ''}">PHONE:</td><td style="padding: 1px 0; ${placeholderStyle} ${isMobile ? 'text-align: left;' : ''}">${phone}</td></tr>` : ''}
            ${shouldShowSection(data.website, showPlaceholders) ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor}; ${isMobile ? 'text-align: right;' : ''}">WEB:</td><td style="padding: 1px 0; ${placeholderStyle} ${isMobile ? 'text-align: left;' : ''}">${website}</td></tr>` : ''}
            ${shouldShowSection(data.address, showPlaceholders) ? `<tr><td style="padding: 1px 4px 1px 0; font-weight: 600; color: ${primaryColor}; ${isMobile ? 'text-align: right;' : ''}">ADDRESS:</td><td style="padding: 1px 0; ${placeholderStyle} ${isMobile ? 'text-align: left;' : ''}">${address}</td></tr>` : ''}
          </table>
          
          ${getSocialIcons()}
        </div>
      </div>
    `,

    // PROFESSIONAL MODERN - Moderno con estructura equilibrada
    'professional-2': `
      <div style="${fontStyle} max-width: ${isMobile ? '400px' : '710px'}; width: 100%; display: flex; ${isMobile ? 'flex-direction: column; text-align: center;' : 'flex-direction: row;'} align-items: center; gap: 22px; background: ${primaryColor}08; padding: 20px; border-radius: 10px;">
        ${data.image?.url ? getImageHtml(true) : ''}
        <div style="flex: 1; min-width: 0; width: 100%;">
          <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: 17px; font-weight: 600; letter-spacing: 0.3px; ${placeholderStyle}">${name}</h3>
          <div style="background: ${accentColor}; color: white; display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; margin-bottom: 6px; ${placeholderStyle}">${title.toUpperCase()}</div>
          ${shouldShowSection(data.company, showPlaceholders) ? `<p style="color: #444; margin: 0 0 8px 0; font-size: 11px; font-weight: 500; ${placeholderStyle}">${company}${department}</p>` : ''}
          
          <div style="background: white; padding: 10px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); font-size: 10px; color: #666;">
            ${shouldShowSection(data.email, showPlaceholders) ? `<div style="margin-bottom: 3px; display: flex; align-items: center; ${isMobile ? 'justify-content: center;' : ''} gap: 4px; ${placeholderStyle}"><img src="https://img.icons8.com/fluency/48/mail--v1.png" alt="Email" style="width: 12px; height: 12px;" /> ${email}</div>` : ''}
            ${shouldShowSection(data.phone, showPlaceholders) ? `<div style="margin-bottom: 3px; display: flex; align-items: center; ${isMobile ? 'justify-content: center;' : ''} gap: 4px; ${placeholderStyle}"><img src="https://img.icons8.com/color/48/phone.png" alt="Phone" style="width: 12px; height: 12px;" /> ${phone}</div>` : ''}
            ${shouldShowSection(data.website, showPlaceholders) ? `<div style="margin-bottom: 3px; display: flex; align-items: center; ${isMobile ? 'justify-content: center;' : ''} gap: 4px; ${placeholderStyle}"><img src="https://img.icons8.com/color/48/internet--v1.png" alt="Website" style="width: 12px; height: 12px;" /> ${website}</div>` : ''}
            ${shouldShowSection(data.address, showPlaceholders) ? `<div style="display: flex; align-items: center; ${isMobile ? 'justify-content: center;' : ''} gap: 4px; ${placeholderStyle}"><img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/external-place-essentials-icongeek26-flat-icongeek26.png" alt="Address" style="width: 12px; height: 12px;" /> ${address}</div>` : ''}
          </div>
          
          ${getSocialIcons()}
        </div>
      </div>
    `,

    // CREATIVE BOLD - Colores vibrantes y diseño dinámico
    'creative-1': `
      <div style="${fontStyle} max-width: ${isMobile ? '400px' : '580px'}; width: 100%; display: flex; ${isMobile ? 'flex-direction: column; text-align: center;' : 'flex-direction: row;'} align-items: center; gap: 20px; background: ${primaryColor}15; padding: 20px; border-radius: 12px; border: 2px solid ${primaryColor}30;">
        ${data.image?.url ? getImageHtml(true) : ''}
        <div style="flex: 1; min-width: 0; width: 100%;">
          <h3 style="color: ${primaryColor}; margin: 0 0 6px 0; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); ${placeholderStyle}">${name}</h3>
          <div style="background: ${accentColor}; color: white; display: inline-block; padding: 4px 12px; border-radius: 18px; font-size: 11px; font-weight: 700; margin-bottom: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); ${placeholderStyle}">${title}</div>
          ${shouldShowSection(data.company, showPlaceholders) ? `<p style="color: #333; margin: 0 0 10px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; ${placeholderStyle}">${company}${department}</p>` : ''}
          
          <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); font-size: 10px; color: #555;">
            ${shouldShowSection(data.email, showPlaceholders) ? `<div style="margin-bottom: 4px; display: flex; align-items: center; ${isMobile ? 'justify-content: center;' : ''} gap: 6px; ${placeholderStyle}"><span style="background: ${primaryColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/fluency/48/mail--v1.png" alt="Email" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> ${email}</div>` : ''}
            ${shouldShowSection(data.phone, showPlaceholders) ? `<div style="margin-bottom: 4px; display: flex; align-items: center; ${isMobile ? 'justify-content: center;' : ''} gap: 6px; ${placeholderStyle}"><span style="background: ${accentColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/color/48/phone.png" alt="Phone" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> ${phone}</div>` : ''}
            ${shouldShowSection(data.website, showPlaceholders) ? `<div style="margin-bottom: 4px; display: flex; align-items: center; ${isMobile ? 'justify-content: center;' : ''} gap: 6px; ${placeholderStyle}"><span style="background: ${primaryColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/color/48/internet--v1.png" alt="Website" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> ${website}</div>` : ''}
            ${shouldShowSection(data.address, showPlaceholders) ? `<div style="display: flex; align-items: center; ${isMobile ? 'justify-content: center;' : ''} gap: 6px; ${placeholderStyle}"><span style="background: ${accentColor}; color: white; padding: 3px; border-radius: 50%; display: flex; align-items: center; justify-content: center; width: 16px; height: 16px;"><img src="https://img.icons8.com/external-icongeek26-flat-icongeek26/64/external-place-essentials-icongeek26-flat-icongeek26.png" alt="Address" style="width: 8px; height: 8px; filter: brightness(0) invert(1);" /></span> ${address}</div>` : ''}
          </div>
          
          ${getSocialIcons()}
        </div>
      </div>
    `,

    // CORPORATE PREMIUM - Diseño institucional de alta gama
    'corporate-1': `
      <div style="${fontStyle} max-width: ${isMobile ? '400px' : '750px'}; width: 100%; display: flex; ${isMobile ? 'flex-direction: column; text-align: center;' : 'flex-direction: row;'} align-items: center; gap: 26px; background: #f8f9fa; border: 1px solid #e9ecef; ${isMobile ? '' : 'border-left: 4px solid ' + primaryColor + ';'} padding: 24px;">
        ${data.image?.url ? getImageHtml(true) : ''}
        <div style="flex: 1; min-width: 0; width: 100%;">
          <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: 18px; font-weight: 400; letter-spacing: 0.5px; font-family: Verdana, Geneva, Tahoma, sans-serif; ${placeholderStyle}">${name}</h3>
          <div style="width: 40px; height: 2px; background: ${primaryColor}; margin: ${isMobile ? '0 auto 6px auto' : '0 0 6px 0'};"></div>
          <p style="color: ${accentColor}; margin: 0 0 3px 0; font-size: 13px; font-weight: 600; font-style: italic; ${placeholderStyle}">${title}</p>
          ${shouldShowSection(data.company, showPlaceholders) ? `<p style="color: #666; margin: 0 0 8px 0; font-size: 11px; font-weight: 500; font-family: Verdana, Geneva, Tahoma, sans-serif; ${placeholderStyle}">${company}${department}</p>` : ''}
          
          <div style="border-top: 1px solid ${primaryColor}30; border-bottom: 1px solid ${primaryColor}30; padding: 8px 0; margin: 8px 0; font-size: 10px; color: #555; font-family: Verdana, Geneva, Tahoma, sans-serif;">
            ${shouldShowSection(data.email, showPlaceholders) ? `<div style="margin-bottom: 3px; ${placeholderStyle}">${email}</div>` : ''}
            ${shouldShowSection(data.phone, showPlaceholders) ? `<div style="margin-bottom: 3px; ${placeholderStyle}">${phone}</div>` : ''}
            ${shouldShowSection(data.website, showPlaceholders) ? `<div style="margin-bottom: 3px; ${placeholderStyle}">${website}</div>` : ''}
            ${shouldShowSection(data.address, showPlaceholders) ? `<div style="${placeholderStyle}">${address}</div>` : ''}
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
        ${shouldShowSection(data.company, showPlaceholders) ? `<p style="color: #444; margin: 0 0 16px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; ${placeholderStyle}">${company}${department}</p>` : ''}
        
        <div style="width: 50px; height: 2px; background: ${accentColor}; margin: 0 auto 16px auto;"></div>
        
        <div style="font-size: ${isMobile ? '10px' : '11px'}; color: #666; line-height: 1.6;">
          ${shouldShowSection(data.email, showPlaceholders) ? `<div style="margin-bottom: 4px; ${placeholderStyle}"><strong>E:</strong> <span style="color: ${primaryColor}">${email}</span></div>` : ''}
          ${shouldShowSection(data.phone, showPlaceholders) ? `<div style="margin-bottom: 4px; ${placeholderStyle}"><strong>T:</strong> ${phone}</div>` : ''}
          ${shouldShowSection(data.website, showPlaceholders) ? `<div style="margin-bottom: 4px; ${placeholderStyle}"><strong>W:</strong> ${website}</div>` : ''}
          ${shouldShowSection(data.address, showPlaceholders) ? `<div style="${placeholderStyle}"><strong>A:</strong> ${address}</div>` : ''}
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
          ${shouldShowSection(data.company, showPlaceholders) ? `<p style="color: #666; margin: 0 0 16px 0; font-size: ${isMobile ? '11px' : '12px'}; font-weight: 500; ${placeholderStyle}">${company}${department}</p>` : ''}
          
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 20px; font-size: ${isMobile ? '9px' : '11px'}; color: #555; border-top: 1px solid #eee; padding-top: 20px;">
            ${shouldShowSection(data.email, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 5px; ${placeholderStyle}"><img src="https://img.icons8.com/fluency/48/mail--v1.png" style="width:14px;height:14px;" alt="email"/> ${email}</div>` : ''}
            ${shouldShowSection(data.phone, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 5px; ${placeholderStyle}"><img src="https://img.icons8.com/color/48/phone.png" style="width:14px;height:14px;" alt="phone"/> ${phone}</div>` : ''}
            ${shouldShowSection(data.website, showPlaceholders) ? `<div style="display: flex; align-items: center; gap: 5px; ${placeholderStyle}"><img src="https://img.icons8.com/color/48/internet--v1.png" style="width:14px;height:14px;" alt="web"/> ${website}</div>` : ''}
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
            <div style="margin-top: 5px; width: 100%; display: flex; justify-content: center;">
              ${getSocialIcons()}
            </div>
            <div style="margin-top: 20px; text-align: center;">
               <p style="color: ${primaryColor}; font-weight: 800; font-size: 18px; margin: 0; letter-spacing: 2px;">${(data.company || 'CORP').substring(0, 4).toUpperCase()}</p>
            </div>
          </div>
          
          <!-- RIGHT COLUMN: 60% -->
          <div style="${isMobile ? 'width: 100%; padding: 30px;' : 'width: 60%; padding: 40px 30px;'} display: flex; flex-direction: column; justify-content: center;">
            <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: ${isMobile ? '20px' : '24px'}; font-weight: 700; letter-spacing: -0.5px;">${name}</h3>
            <p style="color: ${accentColor}; margin: 0 0 16px 0; font-size: ${isMobile ? '12px' : '14px'}; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">${title}</p>
            
            ${data.company ? `<p style="color: #475569; margin: 0 0 20px 0; font-size: ${isMobile ? '11px' : '13px'}; font-weight: 500; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; display: inline-block;">${company}${department}</p>` : ''}
            
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: ${isMobile ? '11px' : '12px'}; color: #475569;">
              ${data.email ? `<div style="display: flex; align-items: center; gap: 10px;"><span style="color: ${primaryColor}; font-weight: 700; width: 20px; text-align: center;">E</span> <a href="mailto:${data.email}" style="color: #475569; text-decoration: none;">${email}</a></div>` : ''}
              ${data.phone ? `<div style="display: flex; align-items: center; gap: 10px;"><span style="color: ${primaryColor}; font-weight: 700; width: 20px; text-align: center;">P</span> <a href="tel:${data.phone}" style="color: #475569; text-decoration: none;">${phone}</a></div>` : ''}
              ${data.website ? `<div style="display: flex; align-items: center; gap: 10px;"><span style="color: ${primaryColor}; font-weight: 700; width: 20px; text-align: center;">W</span> <a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}" style="color: #475569; text-decoration: none;">${website}</a></div>` : ''}
              ${data.address ? `<div style="display: flex; align-items: center; gap: 10px;"><span style="color: ${primaryColor}; font-weight: 700; width: 20px; text-align: center;">A</span> ${address}</div>` : ''}
            </div>
          </div>
          
        </div>
      `
  };

  // Retornar la plantilla seleccionada o una por defecto
  return templates[templateId as keyof typeof templates] || templates['minimal-1'];
}

// Función para copiar al portapapeles
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      textArea.remove();
      return success;
    }
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
}

// Función para formatear nombre de archivo
export function formatFileName(baseName: string, extension: string = 'html'): string {
  const cleanName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Eliminar guiones duplicados
    .trim();
  
  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `${cleanName || 'firma'}-${timestamp}.${extension}`;
}
