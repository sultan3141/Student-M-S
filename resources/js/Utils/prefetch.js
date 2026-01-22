import { router } from '@inertiajs/react';

// Cache for prefetched pages
const prefetchCache = new Map();
const prefetchingUrls = new Set();

/**
 * Prefetch a page for instant navigation
 * @param {string} url - The URL to prefetch
 */
export const prefetchPage = (url) => {
    // Don't prefetch if already cached or currently prefetching
    if (prefetchCache.has(url) || prefetchingUrls.has(url)) {
        return;
    }

    prefetchingUrls.add(url);

    // Use Inertia's visit with preserveState to prefetch
    router.reload({
        only: [],
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
            prefetchCache.set(url, Date.now());
            prefetchingUrls.delete(url);
        },
        onError: () => {
            prefetchingUrls.delete(url);
        }
    });
};

/**
 * Clear old prefetch cache entries (older than 5 minutes)
 */
export const clearOldPrefetchCache = () => {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    
    for (const [url, timestamp] of prefetchCache.entries()) {
        if (timestamp < fiveMinutesAgo) {
            prefetchCache.delete(url);
        }
    }
};

// Clear old cache every minute
setInterval(clearOldPrefetchCache, 60000);
