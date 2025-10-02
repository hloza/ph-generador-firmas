import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Tipo para el tema
export type Theme = 'light' | 'dark';

// Store para el tema actual
function createThemeStore() {
    const { subscribe, set, update } = writable<Theme>('light');
    
    return {
        subscribe,
        set,
        // Inicializar tema desde localStorage o preferencia del sistema
        init: () => {
            if (browser) {
                const stored = localStorage.getItem('theme') as Theme;
                if (stored) {
                    set(stored);
                    applyTheme(stored);
                } else {
                    // Detectar preferencia del sistema
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const systemTheme: Theme = prefersDark ? 'dark' : 'light';
                    set(systemTheme);
                    applyTheme(systemTheme);
                }
            }
        },
        // Alternar entre temas
        toggle: () => {
            update(current => {
                const newTheme: Theme = current === 'light' ? 'dark' : 'light';
                if (browser) {
                    localStorage.setItem('theme', newTheme);
                    applyTheme(newTheme);
                }
                return newTheme;
            });
        },
        // Establecer tema específico
        setTheme: (theme: Theme) => {
            set(theme);
            if (browser) {
                localStorage.setItem('theme', theme);
                applyTheme(theme);
            }
        }
    };
}

// Aplicar tema al documento
function applyTheme(theme: Theme) {
    if (browser) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }
}

export const themeStore = createThemeStore();