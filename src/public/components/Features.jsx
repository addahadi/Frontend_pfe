import React from 'react';

const Features = () => {
  const features = [
    {
      title: "Project creation with formula-based calculations",
      description: "Accurate estimations using Projects, Formulas, Categories, and Units for ultimate precision.",
      icon: "📊"
    }, // تأكدي من هاد الفاصلة هنا
    {
      title: "Save and like articles",
      description: "Build your personal knowledge base from our expert insights and industry best practices.",
      icon: "📑"
    }, // وهنا ثاني
    {
      title: "Access to Blog and News content",
      description: "Stay informed with technical updates, case studies, and construction industry news.",
      icon: "🌐"
    }
  ];

  return (
    <section className="py-24 px-12 bg-white text-center">
      <h2 className="text-xl font-bold text-slate-800 mb-2">What you can do</h2>
      <p className="text-slate-500 mb-16">Explore the powerful capabilities built for construction professionals.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div key={index} className="bg-slate-50 p-8 rounded-2xl text-left hover:shadow-lg transition">
            <div className="bg-white w-12 h-12 flex items-center justify-center rounded-lg shadow-sm mb-6 text-xl">
              {feature.icon}
            </div>
            <h3 className="font-bold text-slate-900 mb-3 leading-tight">{feature.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;