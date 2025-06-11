import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('--- New Subscription Request ---');
  console.log('Time:', new Date().toISOString());
  
  try {
    // Log environment variables (without exposing full API key)
    console.log('Environment Variables:', {
      hasFormId: !!process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID,
      hasApiKey: !!process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY,
      apiKeyPrefix: process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY?.substring(0, 5) || 'none',
      formId: process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID || 'none'
    });

    const requestBody = await request.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { email } = requestBody;
    
    if (!email) {
      console.error('Error: No email provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Processing subscription for email:', email);
    
    const formId = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;
    const apiKey = process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY;

    if (!formId || !apiKey) {
      const errorMsg = 'Missing ConvertKit configuration - ';
      if (!formId) errorMsg += 'FORM_ID is missing, ';
      if (!apiKey) errorMsg += 'API_KEY is missing';
      console.error(errorMsg);
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const payload = {
      api_key: apiKey,
      email: email,
    };

    console.log('Sending to ConvertKit:', {
      url: `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      method: 'POST',
      payload: { 
        ...payload, 
        api_key: '***REDACTED***' 
      }
    });

    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await response.json().catch(e => {
      console.error('Failed to parse response as JSON:', e);
      return { error: 'Invalid response from ConvertKit' };
    });

    console.log('ConvertKit Response Status:', response.status);
    console.log('ConvertKit Headers:', Object.fromEntries([...response.headers.entries()]));
    console.log('ConvertKit Response:', JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      console.error('ConvertKit API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData
      });
      return NextResponse.json(
        { 
          error: responseData.message || 'Failed to subscribe',
          details: responseData 
        },
        { status: response.status }
      );
    }

    console.log('Subscription successful for email:', email);
    return NextResponse.json({ 
      success: true,
      message: 'Subscription successful' 
    });

  } catch (error) {
    console.error('Unexpected error in subscription:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}