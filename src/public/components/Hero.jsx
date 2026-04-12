import React from 'react';
import { useTranslation } from 'react-i18next'; // استيراد الترجمة

const Hero = () => {
  const { t } = useTranslation(); // تعريف الدالة t (لا تنسي هذا السطر!)

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* القسم الأيسر - النصوص */}
        <div className="text-start space-y-6">
          {/* الشارة الزرقاء الصغيرة */}
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full inline-block">
            {t('hero_badge')}
          </span>
          
          {/* العناوين الكبيرة */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            {t('hero_t1')},<br />
            <span className="text-blue-600">{t('hero_t2')}.</span>
          </h1>
          
          {/* الوصف */}
          <p className="text-base text-slate-500 max-w-lg leading-relaxed">
            {t('hero_desc')}
          </p>
          
          {/* الأزرار */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-7 py-3.5 bg-blue-600 text-white font-semibold rounded-2xl shadow-sm hover:bg-blue-700 transition-colors text-sm">
              {t('btn_free')}
            </button>
            <button className="px-7 py-3.5 bg-white text-slate-700 font-medium rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-sm">
              {t('btn_demo')}
            </button>
          </div>
        </div>

        {/* القسم الأيمن - الصورة */}
        <div className="relative flex justify-center md:justify-end">
          <div className="border-[12px] border-slate-50 shadow-2xl rounded-3xl overflow-hidden aspect-[4/3] w-full max-w-lg">
            {/* استبدلي هذا الرابط برابط صورتك الحقيقية */}
            <img 
              src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1470&auto=format&fit=crop" 
              alt="Build Smarter" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;