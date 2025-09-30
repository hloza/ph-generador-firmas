import type { SignatureData } from '../stores/signature.js';

/**
 * Genera el HTML de la firma basado en los datos y plantilla seleccionada
 */
export function generateSignatureHTML(data: SignatureData): string {
  const socialLinksHTML = data.socialLinks
    .filter(link => link.enabled && link.url)
    .map(link => {
      const iconMap = {
        linkedin: '💼',
        twitter: '🐦',
        github: '💻',
        instagram: '📷',
        facebook: '👥',
        youtube: '🎥'
      };
      
      return `
        <a href="${link.url}" style="text-decoration: none; margin-right: 8px;">
          <span style="
            display: inline-block;
            width: 24px;
            height: 24px;
            background-color: ${data.primaryColor};
            color: white;
            text-align: center;
            line-height: 24px;
            border-radius: 4px;
            font-size: 12px;
          ">${iconMap[link.platform]}</span>
        </a>
      `;
    })
    .join('');

  const imageHTML = data.profileImage ? `
    <td style="vertical-align: top; padding-right: 20px;">
      <img src="${data.profileImage}" alt="${data.fullName}" style="
        width: 80px;
        height: 80px;
        object-fit: cover;
        ${data.imageShape === 'circle' ? 'border-radius: 50%;' : ''}
        ${data.imageShape === 'rounded' ? 'border-radius: 8px;' : ''}
        ${data.imageShape === 'square' ? 'border-radius: 0;' : ''}
      " />
    </td>
  ` : '';

  return `
    <table style="font-family: Arial, sans-serif; border-collapse: collapse; margin: 0; padding: 0;">
      <tr>
        ${imageHTML}
        <td style="vertical-align: top;">
          <table style="border-collapse: collapse;">
            <tr>
              <td style="padding-bottom: 8px;">
                <span style="
                  font-size: 18px;
                  font-weight: bold;
                  color: ${data.primaryColor};
                  display: block;
                  margin-bottom: 4px;
                ">${data.fullName}</span>
                <span style="
                  font-size: 14px;
                  color: #666666;
                  display: block;
                ">${data.position}</span>
                ${data.company ? `<span style="
                  font-size: 14px;
                  color: #666666;
                  display: block;
                ">${data.company}</span>` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding-top: 8px; border-top: 1px solid #e5e7eb;">
                ${data.email ? `
                  <div style="margin-bottom: 4px;">
                    <a href="mailto:${data.email}" style="
                      color: #374151;
                      text-decoration: none;
                      font-size: 14px;
                    ">📧 ${data.email}</a>
                  </div>
                ` : ''}
                ${data.phone ? `
                  <div style="margin-bottom: 4px;">
                    <span style="color: #374151; font-size: 14px;">📞 ${data.phone}</span>
                  </div>
                ` : ''}
                ${data.website ? `
                  <div style="margin-bottom: 4px;">
                    <a href="${data.website}" style="
                      color: ${data.primaryColor};
                      text-decoration: none;
                      font-size: 14px;
                    ">🌐 ${data.website}</a>
                  </div>
                ` : ''}
                ${data.address ? `
                  <div style="margin-bottom: 8px;">
                    <span style="color: #374151; font-size: 14px;">📍 ${data.address}</span>
                  </div>
                ` : ''}
                ${socialLinksHTML ? `
                  <div style="margin-top: 8px;">
                    ${socialLinksHTML}
                  </div>
                ` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Copia texto al portapapeles
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores antiguos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Convierte un archivo a base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Valida si una URL es válida
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Valida si un email es válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Genera un ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Formatea un nombre de archivo
 */
export function formatFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Descarga un archivo
 */
export function downloadFile(content: string, filename: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}