<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CompressResponse
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only compress if the client accepts gzip
        if (str_contains($request->header('Accept-Encoding', ''), 'gzip')) {
            $content = $response->getContent();
            
            // Only compress if content is larger than 1KB
            if (strlen($content) > 1024) {
                $compressed = gzencode($content, 6); // Compression level 6 (balance between speed and size)
                
                if ($compressed !== false) {
                    $response->setContent($compressed);
                    $response->headers->set('Content-Encoding', 'gzip');
                    $response->headers->set('Content-Length', strlen($compressed));
                }
            }
        }

        return $response;
    }
}
