import React, { useState } from 'react';
import { 
  Calculator, 
  Bookmark, 
  Rss, 
  Check, 
  ChevronDown, 
  PlayCircle,
  Globe
} from 'lucide-react';

/* * STEP 1: Define the image URL you want to use.
 * I am using a placeholder structural image from Unsplash.
 * You would replace this URL with your local asset path 
 * or your desired image URL.
 */
const estimationBackgroundImgUrl = 'https://i.pinimg.com/1200x/c1/05/87/c105872b1216731d3d3306a500ebfca7.jpg';

const translations = {
  en: {
    heroSub: "The future of construction management",
    heroTitle1: "Build Smarter,",
    heroTitle2: "Faster.",
    heroDesc: "From structural blueprints to the final finishing touches. Automate your workflow with AI-driven estimation and precision project management.",
    startBtn: "Start Free Trial",
    demoBtn: "Watch Demo",
    joined: "Joined by 2,000+ construction firms",
    liveEst: "Live Estimation",
    projectAlpha: "Project: High-Rise Alpha",
    featTitle: "What you can do",
    featDesc: "Explore the powerful capabilities built for construction professionals.",
    feat1Title: "Project creation with formula-based calculations",
    feat1Desc: "Accurate estimations using Projects, Formulas, Categories, and Units for ultimate precision.",
    feat2Title: "Save and like articles",
    feat2Desc: "Build your personal knowledge base from our expert insights and industry best practices.",
    feat3Title: "Access to Blog and News content",
    feat3Desc: "Stay informed with technical updates, case studies, and construction industry news.",
    priceTitle: "Pricing & Plans",
    priceDesc: "Choose the perfect plan for your construction management needs.",
    normUser: "Normal User",
    normDesc: "Perfect for independent surveyors and small projects.",
    mo: "/mo",
    upTo3: "Up to 3 projects",
    ai20: "20 AI requests",
    pdfExport: "PDF export",
    getStarted: "Get Started",
    recommended: "Recommended",
    company: "Company",
    compDesc: "Comprehensive solution for professional construction firms.",
    upTo20: "Up to 20 projects",
    aiUnlim: "Unlimited AI requests",
    extInt: "External services integration",
    chooseEnt: "Choose Enterprise",
    faqTitle: "Frequently Asked Questions",
    faqDesc: "Answers to common questions about our platform and estimation tools.",
    faq1: "How accurate is the AI estimation?",
    faq2: "Can I import my existing Excel formulas?",
    faq3: "Do you offer trial periods for the Company plan?"
  },
  ar: {
    heroSub: "مستقبل إدارة البناء",
    heroTitle1: "ابنِ بذكاء،",
    heroTitle2: "أسرع.",
    heroDesc: "من المخططات الهيكلية إلى اللمسات النهائية. قم بأتمتة سير عملك باستخدام التقدير المدعوم بالذكاء الاصطناعي والإدارة الدقيقة للمشاريع.",
    startBtn: "ابدأ التجربة المجانية",
    demoBtn: "شاهد العرض",
    joined: "انضم إلينا أكثر من 2000 شركة بناء",
    liveEst: "تقدير مباشر",
    projectAlpha: "المشروع: برج ألفا",
    featTitle: "ما يمكنك القيام به",
    featDesc: "استكشف القدرات القوية المصممة لمحترفي البناء.",
    feat1Title: "إنشاء مشاريع بحسابات تعتمد على المعادلات",
    feat1Desc: "تقديرات دقيقة باستخدام المشاريع، المعادلات، الفئات، والوحدات لأقصى درجات الدقة.",
    feat2Title: "حفظ والإعجاب بالمقالات",
    feat2Desc: "قم ببناء قاعدة معرفتك الشخصية من رؤى خبرائنا وأفضل الممارسات في الصناعة.",
    feat3Title: "الوصول إلى محتوى المدونة والأخبار",
    feat3Desc: "ابق على اطلاع بالتحديثات الفنية، دراسات الحالة، وأخبار صناعة البناء.",
    priceTitle: "الأسعار والخطط",
    priceDesc: "اختر الخطة المثالية لاحتياجات إدارة البناء الخاصة بك.",
    normUser: "مستخدم عادي",
    normDesc: "مثالي للمساحين المستقلين والمشاريع الصغيرة.",
    mo: "/شهر",
    upTo3: "حتى 3 مشاريع",
    ai20: "20 طلب ذكاء اصطناعي",
    pdfExport: "تصدير PDF",
    getStarted: "البدء",
    recommended: "موصى به",
    company: "شركة",
    compDesc: "حل شامل لشركات البناء المحترفة.",
    upTo20: "حتى 20 مشروع",
    aiUnlim: "طلبات ذكاء اصطناعي غير محدودة",
    extInt: "تكامل مع خدمات خارجية",
    chooseEnt: "اختر خطة الشركات",
    faqTitle: "الأسئلة الشائعة",
    faqDesc: "إجابات على الأسئلة الشائعة حول منصتنا وأدوات التقدير.",
    faq1: "ما مدى دقة التقدير بالذكاء الاصطناعي؟",
    faq2: "هل يمكنني استيراد معادلات Excel الحالية الخاصة بي؟",
    faq3: "هل تقدمون فترات تجريبية لخطة الشركات؟"
  }
};

const Home = () => {
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  const isAr = lang === 'ar';

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  return (
    <div className="w-full bg-white font-sans transition-all duration-300" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* HEADER / NAV (Added for Language Switcher) */}
      <header className="max-w-7xl mx-auto px-6 lg:px-24 py-6 flex justify-end">
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition shadow-sm"
        >
          <Globe size={18} className="text-blue-600" />
          {isAr ? 'English' : 'العربية'}
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-10 px-6 lg:px-24 max-w-7xl mx-auto">
        <div className="lg:w-1/2 space-y-6">
          <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">
            {t.heroSub}
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            {t.heroTitle1} <br />
            <span className="text-blue-600">{t.heroTitle2}</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-md">
            {t.heroDesc}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-blue-600 text-white px-7 py-3.5 rounded-lg font-medium hover:bg-blue-700 transition">
              {t.startBtn}
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-7 py-3.5 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm">
              <PlayCircle size={20} className="text-gray-500" /> {t.demoBtn}
            </button>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
            </div>
            <span className="text-sm text-gray-500 font-medium">{t.joined}</span>
          </div>
        </div>

        {/* Hero Image / Mockup Area */}
        <div className="lg:w-1/2 mt-16 lg:mt-0 w-full relative">
          
          {/* * STEP 2: Find the background container 'div' for the mockup area.
           * A) REMOVE the solid background color class: 'bg-[#e2e1dd]'.
           * B) ADD image control classes: 'bg-cover', 'bg-center', 'bg-no-repeat'.
           * C) ADD the inline style: 'style={{ backgroundImage: `url(${estimationBackgroundImgUrl})` }}'.
           */
          }
          <div 
            className="rounded-2xl w-full h-[320px] md:h-[400px] shadow-sm relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${estimationBackgroundImgUrl})` }}
          >
            {/* The actual estimation card stays the same, layered on top */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-xl p-5 flex justify-between items-center shadow-lg">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{t.liveEst}</p>
                <p className="text-sm font-bold text-gray-900">{t.projectAlpha}</p>
              </div>
              <div className="text-blue-600 font-extrabold text-xl" dir="ltr">93.4%</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">{t.featTitle}</h2>
            <p className="text-gray-500 mt-4 text-lg">{t.featDesc}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Calculator size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg leading-snug">{t.feat1Title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t.feat1Desc}</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Bookmark size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg leading-snug">{t.feat2Title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t.feat2Desc}</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Rss size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg leading-snug">{t.feat3Title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t.feat3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">{t.priceTitle}</h2>
            <p className="text-gray-500 mt-4 text-lg">{t.priceDesc}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
            
            {/* Normal User Plan */}
            <div className="border border-gray-200 rounded-3xl p-10 bg-white flex flex-col h-full shadow-sm hover:shadow-md transition">
              <h3 className="text-2xl font-bold text-gray-900">{t.normUser}</h3>
              <p className="text-gray-500 text-sm mt-3 mb-8">{t.normDesc}</p>
              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900" dir="ltr">$29</span>
                <span className="text-gray-500 font-medium mx-1">{t.mo}</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center text-sm font-medium text-gray-700 gap-3">
                  <div className="bg-blue-50 p-1 rounded-full"><Check size={16} className="text-blue-600"/></div> {t.upTo3}
                </li>
                <li className="flex items-center text-sm font-medium text-gray-700 gap-3">
                  <div className="bg-blue-50 p-1 rounded-full"><Check size={16} className="text-blue-600"/></div> {t.ai20}
                </li>
                <li className="flex items-center text-sm font-medium text-gray-700 gap-3">
                  <div className="bg-blue-50 p-1 rounded-full"><Check size={16} className="text-blue-600"/></div> {t.pdfExport}
                </li>
              </ul>
              <button className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition">
                {t.getStarted}
              </button>
            </div>

            {/* Company Plan */}
            <div className="border-2 border-blue-600 rounded-3xl p-10 bg-white relative flex flex-col h-full shadow-xl md:scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full">
                {t.recommended}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{t.company}</h3>
              <p className="text-gray-500 text-sm mt-3 mb-8">{t.compDesc}</p>
              <div className="mb-8 flex items-baseline">
                <span className="text-5xl font-extrabold text-gray-900" dir="ltr">$149</span>
                <span className="text-gray-500 font-medium mx-1">{t.mo}</span>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center text-sm font-medium text-gray-700 gap-3">
                  <div className="bg-blue-50 p-1 rounded-full"><Check size={16} className="text-blue-600"/></div> {t.upTo20}
                </li>
                <li className="flex items-center text-sm font-medium text-gray-700 gap-3">
                  <div className="bg-blue-50 p-1 rounded-full"><Check size={16} className="text-blue-600"/></div> {t.aiUnlim}
                </li>
                <li className="flex items-center text-sm font-medium text-gray-700 gap-3">
                  <div className="bg-blue-50 p-1 rounded-full"><Check size={16} className="text-blue-600"/></div> {t.pdfExport}
                </li>
                <li className="flex items-center text-sm font-medium text-gray-700 gap-3">
                  <div className="bg-blue-50 p-1 rounded-full"><Check size={16} className="text-blue-600"/></div> {t.extInt}
                </li>
              </ul>
              <button className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition">
                {t.chooseEnt}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900">{t.faqTitle}</h2>
            <p className="text-gray-500 mt-4 text-lg">{t.faqDesc}</p>
          </div>
          <div className="space-y-4">
            {[t.faq1, t.faq2, t.faq3].map((question, i) => (
              <div 
                key={i} 
                className="bg-white border border-gray-200 rounded-xl p-6 flex justify-between items-center cursor-pointer hover:border-gray-300 transition shadow-sm"
              >
                <span className="font-semibold text-gray-900 text-sm md:text-base">{question}</span>
                <ChevronDown size={20} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;