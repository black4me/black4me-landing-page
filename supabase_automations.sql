-- Automation Steps Table
CREATE TABLE IF NOT EXISTS public.email_automation_steps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL, -- 'abandoned_cart' or 'newsletter_welcome'
  step_index integer NOT NULL,
  delay_minutes integer NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.email_automation_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read to automation_steps" ON public.email_automation_steps FOR SELECT USING (true);
CREATE POLICY "Allow admin all on automation_steps" ON public.email_automation_steps FOR ALL USING (true);

-- Checkout Sessions Updates
ALTER TABLE public.checkout_sessions ADD COLUMN IF NOT EXISTS last_automation_step integer DEFAULT 0;
ALTER TABLE public.checkout_sessions ADD COLUMN IF NOT EXISTS last_email_sent_at timestamp with time zone;

-- Subscribers Table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  status text DEFAULT 'active',
  last_automation_step integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin all on subscribers" ON public.subscribers FOR ALL USING (true);

-- Tracking Logs Table
CREATE TABLE IF NOT EXISTS public.email_tracking_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  session_id uuid REFERENCES public.checkout_sessions(id) ON DELETE SET NULL,
  step_id uuid REFERENCES public.email_automation_steps(id) ON DELETE CASCADE,
  resend_id text,
  status text DEFAULT 'sent', -- sent, delivered, opened, clicked
  sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  opened_at timestamp with time zone,
  clicked_at timestamp with time zone
);
ALTER TABLE public.email_tracking_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin all on email_tracking_logs" ON public.email_tracking_logs FOR ALL USING (true);


-- Insert Initial Automations if not exists
INSERT INTO public.email_automation_steps (type, step_index, delay_minutes, subject, body_html)
SELECT 'abandoned_cart', 1, 30, 'أنت قريب من خطوة قد تغيّر طريقة عملك', 
'<div dir="rtl" style="font-family: Cairo, Arial, sans-serif; line-height: 1.8; color: #333;">
<p>مرحباً {{customer_name}}</p>
<p>لاحظنا أنك كنت مهتماً بـ:<br/><strong>{{product_name}}</strong></p>
<p>لكن يبدو أنك توقفت قبل إكمال الطلب.</p>
<p>في كثير من الأحيان لا نحتاج معلومة جديدة بقدر ما نحتاج خطوة واضحة تساعدنا على التقدم.</p>
<p>إذا كان المنتج مناسباً لك فما زال بإمكانك إكمال الطلب من هنا:</p>
<a href="{{product_link}}" style="display:inline-block; padding:12px 24px; background-color:#1a1a1a; color:#fff; text-decoration:none; border-radius:6px; margin: 10px 0;">إكمال الطلب الآن</a>
<p>قد تكون هذه الخطوة الصغيرة هي الفرق بين الاستمرار في التخمين وبين امتلاك خطة أوضح للعمل.</p>
<p>نراك داخل المنصة.</p>
<br/>
<p>مع خالص التقدير،<br/>المستشار التسويقي الأستاذ<br/><strong>JASIM MOHAMMED | BLACK4ME</strong></p>
</div>'
WHERE NOT EXISTS (SELECT 1 FROM public.email_automation_steps WHERE type = 'abandoned_cart' AND step_index = 1);

INSERT INTO public.email_automation_steps (type, step_index, delay_minutes, subject, body_html)
SELECT 'abandoned_cart', 2, 180, 'هل المشكلة في السعر أم في التردد؟', 
'<div dir="rtl" style="font-family: Cairo, Arial, sans-serif; line-height: 1.8; color: #333;">
<p>مرحباً {{customer_name}}</p>
<p>دعني أشاركك فكرة بسيطة.<br/>الكثير من الأشخاص لا يخسرون بسبب نقص الفرص. بل بسبب تأجيل القرار الصحيح.</p>
<p>المنتج الذي شاهدته:<br/><strong>{{product_name}}</strong></p>
<p>تم تصميمه ليساعدك على اختصار الوقت وتجنب الأخطاء الشائعة التي يقع فيها أغلب المبتدئين وأصحاب المشاريع.</p>
<p>إذا كنت ترى أن هذا المنتج يخدم هدفك فعلاً فلا تجعل التردد يؤجل تقدمك.</p>
<a href="{{product_link}}" style="display:inline-block; padding:12px 24px; background-color:#1a1a1a; color:#fff; text-decoration:none; border-radius:6px; margin: 10px 0;">رابط المنتج</a>
<p>نتطلع لرؤيتك بين عملائنا.</p>
<br/>
<p>المستشار التسويقي الأستاذ<br/><strong>JASIM MOHAMMED | BLACK4ME</strong></p>
</div>'
WHERE NOT EXISTS (SELECT 1 FROM public.email_automation_steps WHERE type = 'abandoned_cart' AND step_index = 2);

INSERT INTO public.email_automation_steps (type, step_index, delay_minutes, subject, body_html)
SELECT 'abandoned_cart', 3, 1440, 'الخوف من التجربة طبيعي', 
'<div dir="rtl" style="font-family: Cairo, Arial, sans-serif; line-height: 1.8; color: #333;">
<p>مرحباً {{customer_name}}</p>
<p>من الطبيعي أن تتردد قبل شراء أي منتج أو خدمة.<br/>لكن اسأل نفسك: هل ما تفعله الآن أوصلَك للنتيجة التي تريدها؟</p>
<p>إذا كانت الإجابة لا... فربما حان الوقت لتجربة شيء مختلف.</p>
<p><strong>{{product_name}}</strong> لن يغيّر حياتك بين ليلة وضحاها. لكنه قد يمنحك معرفة أو استراتيجية أو خطوة عملية تساعدك على التقدم بشكل أفضل من وضعك الحالي.</p>
<p>المعرفة الصحيحة لا تضمن النجاح. لكن غيابها يضمن استمرار نفس النتائج.</p>
<a href="{{product_link}}" style="display:inline-block; padding:12px 24px; background-color:#1a1a1a; color:#fff; text-decoration:none; border-radius:6px; margin: 10px 0;">اكتشف المزيد هنا</a>
<p>مع تمنياتنا لك بالتوفيق.</p>
<br/>
<p>المستشار التسويقي الأستاذ<br/><strong>JASIM MOHAMMED | BLACK4ME</strong></p>
</div>'
WHERE NOT EXISTS (SELECT 1 FROM public.email_automation_steps WHERE type = 'abandoned_cart' AND step_index = 3);

INSERT INTO public.email_automation_steps (type, step_index, delay_minutes, subject, body_html)
SELECT 'abandoned_cart', 4, 2880, 'هدية بسيطة لمساعدتك على اتخاذ القرار', 
'<div dir="rtl" style="font-family: Cairo, Arial, sans-serif; line-height: 1.8; color: #333;">
<p>مرحباً {{customer_name}}</p>
<p>نقدّر اهتمامك بـ: <strong>{{product_name}}</strong></p>
<p>ولذلك خصصنا لك كود خصم محدود:</p>
<p>الكود: <strong>{{discount_code}}</strong><br/>قيمة الخصم: <strong>{{discount_value}}</strong></p>
<p>استخدمه من خلال الرابط التالي:</p>
<a href="{{product_link}}" style="display:inline-block; padding:12px 24px; background-color:#6C3BFF; color:#fff; text-decoration:none; border-radius:6px; margin: 10px 0;">استخدم الخصم الآن</a>
<p>إذا كان المنتج مناسباً لاحتياجك الحالي فهذه فرصة جيدة للبدء. أما إذا لم يكن مناسباً لك حالياً فلا داعي للشراء.</p>
<p>الأهم أن تستثمر في تطوير نفسك بالطريقة التي تناسب أهدافك.</p>
<br/>
<p>المستشار التسويقي الأستاذ<br/><strong>JASIM MOHAMMED | BLACK4ME</strong></p>
</div>'
WHERE NOT EXISTS (SELECT 1 FROM public.email_automation_steps WHERE type = 'abandoned_cart' AND step_index = 4);

INSERT INTO public.email_automation_steps (type, step_index, delay_minutes, subject, body_html)
SELECT 'abandoned_cart', 5, 7200, 'حتى لو لم تشترِ اليوم', 
'<div dir="rtl" style="font-family: Cairo, Arial, sans-serif; line-height: 1.8; color: #333;">
<p>مرحباً {{customer_name}}</p>
<p>قد لا يكون الوقت مناسباً الآن. وهذا أمر طبيعي.</p>
<p>لكن إذا كنت مهتماً بالتسويق الرقمي وبناء العروض وزيادة المبيعات وتطوير المشاريع الرقمية... فيسعدنا انضمامك إلى نشرتنا البريدية.</p>
<p>نرسل بشكل دوري:<br/>
✓ أفكار تسويقية عملية<br/>
✓ استراتيجيات مبيعات<br/>
✓ دروس قصيرة<br/>
✓ عروض خاصة للمشتركين</p>
<a href="{{newsletter_link}}" style="display:inline-block; padding:12px 24px; background-color:#1a1a1a; color:#fff; text-decoration:none; border-radius:6px; margin: 10px 0;">اشترك في النشرة مجاناً</a>
<p>نتمنى أن نكون جزءاً من رحلتك القادمة.</p>
<br/>
<p>المستشار التسويقي الأستاذ<br/><strong>JASIM MOHAMMED | BLACK4ME</strong></p>
</div>'
WHERE NOT EXISTS (SELECT 1 FROM public.email_automation_steps WHERE type = 'abandoned_cart' AND step_index = 5);

INSERT INTO public.email_automation_steps (type, step_index, delay_minutes, subject, body_html)
SELECT 'newsletter_welcome', 1, 0, 'أهلاً بك في مجتمع BLACK4ME', 
'<div dir="rtl" style="font-family: Cairo, Arial, sans-serif; line-height: 1.8; color: #333;">
<p>مرحباً {{customer_name}}</p>
<p>سعيدون بانضمامك إلى نشرتنا البريدية.</p>
<p>ستصلك منا رسائل مختصرة وعملية تساعدك على تطوير مشروعك وتسويق خدماتك ومنتجاتك بطريقة أكثر وضوحاً.</p>
<p>هدفنا ليس إغراقك بالمحتوى. هدفنا أن نقدم لك أفكاراً قابلة للتطبيق تساعدك على اتخاذ قرارات أفضل.</p>
<p>ترقب أول رسالة قريباً.<br/>أهلاً بك معنا.</p>
<br/>
<p>المستشار التسويقي الأستاذ<br/><strong>JASIM MOHAMMED | BLACK4ME</strong></p>
</div>'
WHERE NOT EXISTS (SELECT 1 FROM public.email_automation_steps WHERE type = 'newsletter_welcome' AND step_index = 1);
