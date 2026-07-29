import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { RtcTokenBuilder, RtcRole } from "npm:agora-token"

// إعدادات الـ CORS عشان المتصفح يقدر يكلم الفانكشن دي بدون مشاكل أمنية
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // التعامل مع طلبات الـ CORS المبدئية (Preflight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // استقبال البيانات المرسلة من الـ Frontend
    const { channelName, uid, role } = await req.json()

    if (!channelName) {
      return new Response(JSON.stringify({ error: 'channelName is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // جلب مفاتيح أجورا السرية المخزنة في الـ Environment Variables بـ Supabase
    const appId = Deno.env.get('AGORA_APP_ID')
    const appCertificate = Deno.env.get('AGORA_APP_CERTIFICATE')

    if (!appId || !appCertificate) {
      return new Response(JSON.stringify({ error: 'Agora credentials are not set on Supabase' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // تحديد دور المستخدم (هل هو مدرس هيبث 'host' أم طالب هيشاهد بس)
    const agoraRole = role === 'host' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER

    // تحديد وقت انتهاء صلاحية التوكين (ساعتين مثلاً للأمان)
    const expirationTimeInSeconds = 3600 * 2
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    // توليد التوكين الآمن باستخدام مكتبة Agora الرسمية
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid || 0, // لو صفر، أجورا بتديله رقم تعريفي عشوائي
      agoraRole,
      privilegeExpiredTs,
      privilegeExpiredTs
    )

    // إرجاع التوكين للـ Frontend
    return new Response(JSON.stringify({ token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})