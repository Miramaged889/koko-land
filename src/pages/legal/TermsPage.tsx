import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Scale, Shield, AlertTriangle, CreditCard, UserX } from 'lucide-react';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = '15 يناير 2025';

  const sections = [
    {
      icon: FileText,
      title: 'قبول الشروط',
      content: [
        'باستخدام منصة كوكو لاند، فإنك توافق على هذه الشروط والأحكام',
        'إذا كنت لا توافق على أي من هذه الشروط، يجب عدم استخدام الخدمة',
        'قد نحدث هذه الشروط من وقت لآخر وسنخطرك بأي تغييرات مهمة',
        'استمرار استخدامك للخدمة يعني موافقتك على الشروط المحدثة',
        'يجب أن تكون بالغاً أو تحت إشراف والدين لاستخدام الخدمة'
      ]
    },
    {
      icon: UserX,
      title: 'استخدام الخدمة',
      content: [
        'الخدمة مخصصة لإنشاء قصص مخصصة للأطفال فقط',
        'يجب استخدام الخدمة لأغراض شخصية وغير تجارية',
        'ممنوع رفع محتوى مخالف أو غير مناسب للأطفال',
        'ممنوع انتهاك حقوق الملكية الفكرية للآخرين',
        'نحتفظ بالحق في إيقاف الحسابات المخالفة دون إنذار مسبق',
        'المستخدم مسؤول عن الحفاظ على سرية بيانات دخوله'
      ]
    },
    {
      icon: CreditCard,
      title: 'الدفع والاسترداد',
      content: [
        'جميع الأسعار معروضة بالريال السعودي وتشمل ضريبة القيمة المضافة',
        'الدفع مطلوب مقدماً قبل إنشاء القصة المخصصة',
        'يمكن طلب استرداد خلال 30 يوماً من الشراء',
        'الاسترداد متاح إذا لم تكن راضياً عن جودة القصة',
        'رسوم معالجة الدفع غير قابلة للاسترداد',
        'معالجة طلبات الاسترداد تستغرق 5-10 أيام عمل'
      ]
    },
    {
      icon: Shield,
      title: 'الملكية الفكرية',
      content: [
        'كوكو لاند يمتلك جميع حقوق القصص الأصلية والتصاميم',
        'القصص المخصصة تصبح ملكاً خاصاً للمشتري للاستخدام الشخصي',
        'ممنوع إعادة بيع أو توزيع القصص المخصصة تجارياً',
        'يحتفظ كوكو لاند بحق استخدام التصاميم العامة (غير المخصصة)',
        'صور الأطفال المرفوعة تبقى ملكاً للأهل ولا نستخدمها لأغراض أخرى',
        'شعار وعلامة كوكو لاند محمية بحقوق الطبع والنشر'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'المسؤولية والضمانات',
      content: [
        'نسعى لتقديم أفضل جودة لكن لا نضمن خلو الخدمة من الأخطاء',
        'غير مسؤولين عن أي أضرار مباشرة أو غير مباشرة',
        'المستخدم مسؤول عن صحة المعلومات المقدمة',
        'نحتفظ بالحق في تعديل أو إيقاف الخدمة مؤقتاً للصيانة',
        'غير مسؤولين عن فقدان البيانات بسبب أعطال تقنية',
        'ضمان الرضا لمدة 30 يوماً على جودة القصص المخصصة'
      ]
    },
    {
      icon: Scale,
      title: 'القانون المطبق وحل النزاعات',
      content: [
        'هذه الشروط محكومة بقوانين المملكة العربية السعودية',
        'أي نزاع يحل عبر التفاوض الودي أولاً',
        'في حالة عدم التوصل لحل، يتم اللجوء للمحاكم السعودية',
        'لغة التعامل الرسمية هي العربية',
        'جميع الإشعارات الرسمية ترسل عبر البريد الإلكتروني',
        'يحق لأي طرف طلب الوساطة قبل اللجوء للمحاكم'
      ]
    }
  ];

  const prohibitedActivities = [
    'رفع محتوى مخالف للآداب العامة أو غير مناسب للأطفال',
    'انتهاك حقوق الطبع والنشر أو الملكية الفكرية',
    'استخدام الخدمة لأغراض تجارية دون موافقة',
    'محاولة اختراق أو تعطيل أنظمة المنصة',
    'إنشاء حسابات وهمية أو متعددة',
    'إساءة استخدام نظام الاسترداد أو الشكاوى',
    'مشاركة بيانات دخول الحساب مع آخرين',
    'رفع صور لأطفال آخرين دون موافقة أولياء أمورهم'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Scale className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-changa font-bold text-primary mb-4">
            الشروط والأحكام
          </h1>
          <p className="text-xl font-reem text-gray-600 max-w-2xl mx-auto mb-4">
            يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا
          </p>
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full px-4 py-2">
            <FileText className="h-4 w-4 text-primary ml-2" />
            <span className="font-reem text-sm text-primary">
              آخر تحديث: {lastUpdated}
            </span>
          </div>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-reem font-bold text-gray-800 mb-4">
            مرحباً بك في كوكو لاند
          </h2>
          <div className="font-tajawal text-gray-700 leading-relaxed space-y-4">
            <p>
              هذه الشروط والأحكام تحكم استخدامك لمنصة كوكو لاند لإنشاء القصص المخصصة للأطفال. 
              نحن ملتزمون بتقديم خدمة آمنة وممتعة لك ولأطفالك.
            </p>
            <p>
              كوكو لاند ("نحن" أو "الشركة") تقدم خدمات إنشاء قصص مخصصة تفاعلية للأطفال 
              من خلال موقعنا الإلكتروني والتطبيقات المرتبطة به.
            </p>
            <p className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 border border-primary/20">
              <strong className="font-reem text-primary">تنبيه مهم:</strong> 
              باستخدام خدماتنا، فإنك تؤكد موافقتك على جميع الشروط الواردة أدناه. 
              إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الخدمة.
            </p>
          </div>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-3xl shadow-lg p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center ml-4">
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-reem font-bold text-gray-800">
                  {section.title}
                </h2>
              </div>
              
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <motion.li
                    key={itemIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (itemIndex * 0.05) }}
                    className="flex items-start font-tajawal text-gray-700"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 ml-3 flex-shrink-0"></div>
                    <span className="leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Prohibited Activities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 mt-8 border border-red-200"
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center ml-4">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-reem font-bold text-red-700">
              الأنشطة المحظورة
            </h2>
          </div>
          
          <p className="font-tajawal text-gray-700 mb-4">
            يُمنع منعاً باتاً القيام بالأنشطة التالية:
          </p>
          
          <ul className="space-y-3">
            {prohibitedActivities.map((activity, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start font-tajawal text-gray-700"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span className="leading-relaxed">{activity}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-6 p-4 bg-white/50 rounded-2xl border border-red-200">
            <p className="font-reem font-semibold text-red-700 mb-2">
              عواقب المخالفة:
            </p>
            <p className="font-tajawal text-sm text-gray-700">
              قد تؤدي مخالفة هذه القواعد إلى إيقاف الحساب نهائياً، إلغاء الطلبات، 
              وعدم استرداد المبالغ المدفوعة، بالإضافة إلى اتخاذ الإجراءات القانونية اللازمة.
            </p>
          </div>
        </motion.div>

        {/* Service Availability */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 mt-8"
        >
          <h2 className="text-xl font-reem font-bold text-gray-800 mb-4">
            توفر الخدمة والدعم الفني
          </h2>
          <div className="font-tajawal text-gray-700 leading-relaxed space-y-4">
            <p>
              نسعى لتوفير الخدمة على مدار الساعة، لكن قد نحتاج لإيقافها مؤقتاً للصيانة أو التطوير. 
              سنخطرك بأي انقطاع مخطط له مسبقاً.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-4 border border-primary/10">
                <h3 className="font-reem font-semibold text-primary mb-2">
                  وقت الاستجابة:
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>• إنشاء القصص: 24-48 ساعة</li>
                  <li>• الدعم الفني: خلال 24 ساعة</li>
                  <li>• طلبات الاسترداد: 5-10 أيام عمل</li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-accent2/5 to-accent1/5 rounded-2xl p-4 border border-accent2/10">
                <h3 className="font-reem font-semibold text-accent2 mb-2">
                  قنوات الدعم:
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>• البريد الإلكتروني: support@koko-land.com</li>
                  <li>• الهاتف: +966 50 123 4567</li>
                  <li>• الدردشة المباشرة في الموقع</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Termination */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent1/20 to-orange-100 rounded-3xl p-8 mt-8 border border-accent1/30"
        >
          <h2 className="text-xl font-reem font-bold text-accent1 mb-4">
            إنهاء الحساب
          </h2>
          <div className="font-tajawal text-gray-700 leading-relaxed space-y-4">
            <p>
              يمكنك إنهاء حسابك في أي وقت من خلال إعدادات الحساب أو التواصل معنا. 
              عند إنهاء الحساب:
            </p>
            <ul className="space-y-2 pr-4">
              <li>• ستفقد الوصول لجميع القصص المحفوظة في الحساب</li>
              <li>• سيتم حذف جميع بياناتك الشخصية خلال 30 يوماً</li>
              <li>• القصص المحملة مسبقاً تبقى ملكك</li>
              <li>• لا يمكن استرداد المبالغ للقصص المكتملة</li>
            </ul>
            <div className="bg-white/70 rounded-2xl p-4 border border-accent1/20 mt-4">
              <p className="font-reem font-semibold text-accent1 mb-2">
                نصيحة مهمة:
              </p>
              <p className="text-sm">
                قبل حذف حسابك، تأكد من تحميل جميع القصص التي تريد الاحتفاظ بها، 
                حيث لن تتمكن من استردادها بعد حذف الحساب.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 mt-8"
        >
          <h2 className="text-xl font-reem font-bold text-primary mb-4">
            تواصل معنا
          </h2>
          <div className="font-tajawal text-gray-700 leading-relaxed space-y-4">
            <p>
              إذا كانت لديك أسئلة حول هذه الشروط أو تحتاج لمساعدة، 
              لا تتردد في التواصل معنا:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center ml-3">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-reem font-semibold">للشؤون القانونية:</p>
                  <p>legal@koko-land.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center ml-3">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-reem font-semibold">الدعم العام:</p>
                  <p>support@koko-land.com</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 mt-8 text-white text-center"
        >
          <h3 className="text-xl font-reem font-bold mb-4">
            شكراً لاختيارك كوكو لاند
          </h3>
          <p className="font-tajawal leading-relaxed mb-6">
            نحن فخورون بثقتكم فينا لإنشاء قصص رائعة لأطفالكم. 
            هدفنا هو تقديم تجربة آمنة وممتعة لجميع أفراد العائلة.
          </p>
          <p className="font-reem text-white/90 text-sm">
            هذه الشروط نافذة اعتباراً من {lastUpdated}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/privacy')}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-reem text-lg font-semibold shadow-lg"
            >
              اطلع على سياسة الخصوصية
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className="bg-white border-2 border-primary text-primary px-8 py-4 rounded-full font-reem text-lg font-semibold hover:bg-primary hover:text-white transition-all"
            >
              تواصل معنا للاستفسارات
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;