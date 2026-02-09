import '../css/app.css';
import '../css/director-theme.css';
import './bootstrap';
<<<<<<< HEAD
=======
import { route } from 'ziggy-js';
window.route = route;
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
<<<<<<< HEAD
import { route } from 'ziggy-js';

window.route = route;
=======
>>>>>>> c3c2e32 (Final sync: Integrated all premium Teacher/Parent portal components and configurations)

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: false,
});
