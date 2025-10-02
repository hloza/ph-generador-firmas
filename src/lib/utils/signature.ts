import type { SignatureData } from "../stores/signature.js";

export function generateSignatureHTML(data: SignatureData): string {
  const templateId = data.templateId;
  const isMobile = false; // Para HTML copiado, usar versión desktop
  const name = data.name || data.fullName || 'Tu nombre';
  const title = data.title || data.position || 'Tu título profesional';
  const company = data.company || 'Tu empresa';
  const department = data.department ? ` - ${data.department}` : '';
  const email = data.email || 'tu.email@empresa.com';
  const phone = data.phone || '+34 xxx xxx xxx';
  const website = data.website || '';
  const address = data.address || '';
  
  // Redes sociales
  const linkedin = data.linkedin || '';
  const twitter = data.twitter || '';
  const github = data.github || '';
  const instagram = data.instagram || '';
  
  // Valores de personalización
  const primaryColor = data.primaryColor || '#3b82f6';
  const accentColor = data.accentColor || '#8b5cf6';
  const fontFamily = data.fontFamily || 'modern';
  
  // Mapeo de familias de fuente
  const fontFamilyStyles = {
    modern: 'font-family: Arial, sans-serif;',
    classic: 'font-family: Georgia, serif;',
    minimal: 'font-family: Courier, monospace;'
  };
  
  const fontStyle = fontFamilyStyles[fontFamily as keyof typeof fontFamilyStyles];
  
  // Función para generar imagen de perfil
  const getImageHtml = (forDesktop = false) => {
    if (!data.image?.url) return '';
    
    const imageData = data.image;
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
    
    // Para HTML copiado, usar contenedor más robusto
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
          <img src="https://img.icons8.com/fluency/48/linkedin.png" alt="LinkedIn" style="width: 16px; height: 16px; vertical-align: middle;" />
        </a>
      `);
    }
    
    if (twitter) {
      socials.push(`
        <a href="${twitter}" style="text-decoration: none; margin-right: 4px; display: inline-block;">
          <img src="https://img.icons8.com/ios-filled/50/twitterx--v1.png" alt="Twitter/X" style="width: 16px; height: 16px; vertical-align: middle;" />
        </a>
      `);
    }
    
    if (github) {
      socials.push(`
        <a href="${github}" style="text-decoration: none; margin-right: 4px; display: inline-block;">
          <img src="https://img.icons8.com/glyph-neue/64/github.png" alt="GitHub" style="width: 16px; height: 16px; vertical-align: middle;" />
        </a>
      `);
    }
    
    if (instagram) {
      socials.push(`
        <a href="${instagram}" style="text-decoration: none; margin-right: 4px; display: inline-block;">
          <img src="https://img.icons8.com/3d-fluency/94/instagram-logo.png" alt="Instagram" style="width: 16px; height: 16px; vertical-align: middle;" />
        </a>
      `);
    }
    
    return socials.length > 0 ? `
      <div style="margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 2px;">
        ${socials.join('')}
      </div>
    ` : '';
  };

  // Plantillas con diseños completamente únicos
  const templates = {
    // MINIMAL CLEAN - Diseño ultra limpio con imagen a la izquierda en desktop
    'minimal-1': `
      <div style="${fontStyle} max-width: 650px; width: 100%; display: flex; align-items: flex-start; gap: 20px; padding: 16px;">
        ${data.image?.url ? getImageHtml(true) : ''}
        <div style="flex: 1; min-width: 0;">
          <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: 16px; font-weight: 600; line-height: 1.2;">${name}</h3>
          <p style="color: ${accentColor}; margin: 0 0 3px 0; font-size: 12px; font-weight: 500;">${title}</p>
          ${company !== 'Tu empresa' ? `<p style="color: #666; margin: 0 0 6px 0; font-size: 11px; font-style: italic;">${company}${department}</p>` : ''}
          
          <div style="margin-top: 6px; font-size: 10px; color: #555; line-height: 1.3;">
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
      <div style="${fontStyle} max-width: 670px; width: 100%; display: flex; align-items: flex-start; gap: 20px; padding: 16px;">
        ${data.image?.url ? getImageHtml(true) : ''}
        <div style="flex: 1; min-width: 0;">
          <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: 17px; font-weight: 300; letter-spacing: 0.5px;">${name}</h3>
          <div style="width: 20px; height: 1px; background: ${accentColor}; margin: 0 0 4px 0;"></div>
          <p style="color: ${accentColor}; margin: 0 0 4px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;">${title}</p>
          ${company !== 'Tu empresa' ? `<p style="color: #777; margin: 0 0 6px 0; font-size: 11px; font-weight: 400;">${company}${department}</p>` : ''}
          
          <div style="border-top: 1px solid #e0e0e0; padding-top: 4px; margin-top: 4px; font-size: 10px; color: #666;">
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
      <div style="${fontStyle} max-width: 690px; width: 100%; display: flex; align-items: flex-start; gap: 24px; padding: 18px; border-left: 4px solid ${primaryColor};">
        ${data.image?.url ? getImageHtml(true) : ''}
        <div style="flex: 1; min-width: 0;">
          <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${name}</h3>
          <p style="color: ${accentColor}; margin: 0 0 2px 0; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">${title}</p>
          ${company !== 'Tu empresa' ? `<p style="color: #333; margin: 0 0 8px 0; font-size: 11px; font-weight: 500; border-bottom: 1px solid #ddd; padding-bottom: 4px;">${company}${department}</p>` : ''}
          
          <table style="width: 100%; font-size: 10px; color: #555;">
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
      <div style="${fontStyle} max-width: 710px; width: 100%; display: flex; align-items: flex-start; gap: 22px; background: linear-gradient(135deg, ${primaryColor}08, ${accentColor}05); padding: 20px; border-radius: 10px;">
        ${data.image?.url ? getImageHtml(true) : ''}
        <div style="flex: 1; min-width: 0;">
          <h3 style="color: ${primaryColor}; margin: 0 0 4px 0; font-size: 17px; font-weight: 600; letter-spacing: 0.3px;">${name}</h3>
          <div style="background: ${accentColor}; color: white; display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; margin-bottom: 6px;">${title.toUpperCase()}</div>
          ${company !== 'Tu empresa' ? `<p style="color: #444; margin: 0 0 8px 0; font-size: 11px; font-weight: 500;">${company}${department}</p>` : ''}
          
          <div style="background: white; padding: 10px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); font-size: 10px; color: #666;">
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
      <div style="${fontStyle} max-width: 580px; width: 100%; display: flex; align-items: flex-start; gap: 20px; background: linear-gradient(45deg, ${primaryColor}15, ${accentColor}15); padding: 20px; border-radius: 12px; border: 2px solid ${primaryColor}30;">
        ${data.image?.url ? getImageHtml(true) : ''}
        <div style="flex: 1; min-width: 0;">
          <h3 style="background: linear-gradient(45deg, ${primaryColor}, ${accentColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0 0 6px 0; font-size: 20px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">${name}</h3>
          <div style="background: linear-gradient(135deg, ${accentColor}, ${primaryColor}); color: white; display: inline-block; padding: 4px 12px; border-radius: 18px; font-size: 11px; font-weight: 700; margin-bottom: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">${title}</div>
          ${company !== 'Tu empresa' ? `<p style="color: #333; margin: 0 0 10px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${company}${department}</p>` : ''}
          
          <div style="background: rgba(255,255,255,0.9); padding: 12px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); font-size: 10px; color: #555;">
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
      <div style="${fontStyle} max-width: 750px; width: 100%; display: flex; align-items: flex-start; gap: 26px; background: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid ${primaryColor}; padding: 24px;">
        ${data.image?.url ? getImageHtml(true) : ''}
        <div style="flex: 1; min-width: 0;">
          <h3 style="color: ${primaryColor}; margin: 0 0 3px 0; font-size: 18px; font-weight: 400; letter-spacing: 0.5px; font-family: Georgia, serif;">${name}</h3>
          <div style="width: 40px; height: 2px; background: linear-gradient(to right, ${primaryColor}, ${accentColor}); margin: 0 0 6px 0;"></div>
          <p style="color: ${accentColor}; margin: 0 0 3px 0; font-size: 13px; font-weight: 600; font-style: italic;">${title}</p>
          ${company !== 'Tu empresa' ? `<p style="color: #666; margin: 0 0 8px 0; font-size: 11px; font-weight: 500; font-family: Georgia, serif;">${company}${department}</p>` : ''}
          
          <div style="border-top: 1px solid ${primaryColor}30; border-bottom: 1px solid ${primaryColor}30; padding: 8px 0; margin: 8px 0; font-size: 10px; color: #555; font-family: Georgia, serif;">
            ${email !== 'tu.email@empresa.com' ? `<div style="margin-bottom: 3px;">${email}</div>` : ''}
            ${phone !== '+34 xxx xxx xxx' ? `<div style="margin-bottom: 3px;">${phone}</div>` : ''}
            ${website ? `<div style="margin-bottom: 3px;">${website}</div>` : ''}
            ${address ? `<div>${address}</div>` : ''}
          </div>
          
          ${getSocialIcons()}
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
