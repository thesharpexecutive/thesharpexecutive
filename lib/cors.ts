import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to add CORS headers to API responses
 * 
 * @param req - The incoming request
 * @param allowedOrigin - Optional specific origin to allow (defaults to the request origin or '*')
 */
export function setCorsHeaders(headers: Headers, origin?: string) {
  // Set default origin to the request origin or a wildcard
  const allowedOrigin = origin || '*';
  
  // Set CORS headers
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Origin', allowedOrigin);
  headers.set(
    'Access-Control-Allow-Methods',
    'GET,DELETE,PATCH,POST,PUT,OPTIONS'
  );
  headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
}

/**
 * CORS middleware for Next.js API routes
 */
export function withCors(handler: Function) {
  return async function(req: NextRequest) {
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      setCorsHeaders(response.headers, req.headers.get('origin') || undefined);
      return response;
    }
    
    try {
      // Call the original handler
      const response = await handler(req);
      
      // Add CORS headers to the response
      setCorsHeaders(response.headers, req.headers.get('origin') || undefined);
      
      return response;
    } catch (error) {
      // If there's an error, ensure we still return a response with CORS headers
      console.error('Error in API route:', error);
      
      const errorResponse = new NextResponse(
        JSON.stringify({ error: 'Internal Server Error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
      
      setCorsHeaders(errorResponse.headers, req.headers.get('origin') || undefined);
      return errorResponse;
    }
  };
}
