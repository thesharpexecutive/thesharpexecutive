import { NextRequest, NextResponse } from 'next/server';

// Helper method to wait for a specified time
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Configure CORS headers
export async function corsMiddleware(
  req: NextRequest,
  res: NextResponse,
  origin?: string
) {
  // Set default origin to the request origin or a wildcard
  const requestOrigin = req.headers.get('origin') || '*';
  const allowedOrigin = origin || requestOrigin;
  
  // Set CORS headers
  res.headers.set('Access-Control-Allow-Credentials', 'true');
  res.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  res.headers.set(
    'Access-Control-Allow-Methods',
    'GET,DELETE,PATCH,POST,PUT,OPTIONS'
  );
  res.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.headers.set('Content-Length', '0');
    return new NextResponse(null, { 
      status: 204, 
      headers: res.headers 
    });
  }

  return res;
}

// Export a wrapper function to easily apply CORS to API routes
export function withCors(handler: Function, origin?: string) {
  return async function(req: NextRequest) {
    // Create an empty response object
    const res = NextResponse.next();
    
    // Apply CORS headers
    const corsRes = await corsMiddleware(req, res, origin);
    
    // If it's an OPTIONS request, return the CORS response directly
    if (req.method === 'OPTIONS') {
      return corsRes;
    }
    
    // Otherwise, call the original handler
    const result = await handler(req);
    
    // Copy CORS headers to the result
    Object.entries(corsRes.headers).forEach(([key, value]) => {
      result.headers.set(key, value);
    });
    
    return result;
  };
}
