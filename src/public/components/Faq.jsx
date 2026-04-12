import React from 'react';
import { useTranslation } from 'react-i18next';

const Faq = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* العناوين العلوية */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
          {t('faq_h')}
        </h2>
        <p className="text-slate-500 mb-16 text-lg">
          {t('faq_s')}
        </p>

        {/* قائمة الأسئلة (المربعات البيضاء) */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="group flex justify-between items-center p-6 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
            >
              {/* نص السؤال - تأكدي من استخدام الـ Backtick هنا */}
              <span className="text-slate-700 font-semibold text-start text-sm md:text-base">
                {t(faq_q${i})}
              </span>
              
              {/* أيقونة السهم الرمادي الصغير */}
              <div className="text-slate-300 group-hover:text-slate-500 transition-colors">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;