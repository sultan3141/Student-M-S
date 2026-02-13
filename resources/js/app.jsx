import '../css/app.css';
import '../css/director-theme.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import React from 'react';

// Import Ziggy route helper
import { route as ziggyRoute } from 'ziggy-js';

// Make route available globally with defensive error handling
window.route = function (...args) {
    try {
        const result = ziggyRoute(...args);
        // If ziggyRoute returns successfully, return it
        return result;
    } catch (error) {
        console.error('Route error:', error, 'Args:', args);
        // Return a mock Ziggy object to prevent crashes when .current() is called
        const mockRoute = function () { return '#'; };
        mockRoute.current = function () { return false; };
        mockRoute.params = {};
        return args.length === 0 ? mockRoute : '#';
    }
};

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Simple Root Error Boundary for startup crashes
class RootErrorDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', backgroundColor: '#fee2e2', color: '#991b1b', fontFamily: 'monospace' }}>
                    <h1>Application Crash</h1>
                    <pre>{this.state.error.toString()}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <RootErrorDisplay>
                <App {...props} />
            </RootErrorDisplay>
        );
    },
    progress: false,
});
