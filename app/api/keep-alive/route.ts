import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // Lakukan query ringan untuk memberitahu Supabase bahwa project ini aktif
    const { data, error } = await supabase
      .from('reports')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Keep-alive ping failed:', error);
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase pinged successfully to prevent pause', 
      data 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
