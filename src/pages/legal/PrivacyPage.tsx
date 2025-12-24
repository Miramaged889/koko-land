import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, UserCheck, FileText, AlertCircle } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = '15 يناير 2025';

  const sections = [
    {
      icon: UserCheck,
      title: 'المعلومات التي نجمعها',
      content: [
        'المعلومات الشخصية: الاسم، البريد الإلكتروني، معلومات الاتصال',
        'معلومات الأطفال: الاسم والعمر (فقط لتخصيص القصص)',
        'الصور: صور الأطفال المرفوعة لإنشاء القصص المخصصة',
        'معلومات الاستخدام: كيفية استخدامك للمنصة والصفحات التي تزورها',
        'معلومات الجهاز: نوع الجهاز، نظام التشغيل، المتصفح المستخدم'
      ]
    },
    {
      icon: Eye,
      title: 'كيف نستخدم معلوماتك',
      content: [
        'إنشاء وتخصيص القصص حسب طلبك',
        'معالجة الطلبات والمدفوعات',
        'تحسين خدماتنا وتطوير ميزات جديدة',
        'التواصل معك بخصوص حسابك أو طلباتك',
        'إرسال تحديثات مهمة حول الخدمة',
        'ضمان أمان المنصة ومنع الاستخدام غير المشروع'
      ]
    },
    {
      icon: Lock,
      title: 'حماية المعلومات',
      content: [
        'تشفير جميع البيانات أثناء النقل والتخزين باستخدام SSL',
        'تخزين آمن للصور والمعلومات الشخصية',
        'وصول محدود للموظفين المخولين فقط',
        'مراقبة أمنية مستمرة لمنع التسريبات',
        'نسخ احتياطية منتظمة ومحمية',
        'حذف البيانات غير الضرورية بانتظام'
      ]
    },
    {
      icon: FileText,
      title: 'مشاركة المعلومات',
      content: [
        'لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة',
        'قد نشارك معلومات محدودة مع مقدمي الخدمات الموثوقين',
        'نشارك المعلومات فقط عند الضرورة القانونية',
        'جميع الشركاء ملزمون بحماية خصوصيتك',
        'لا نستخدم صور الأطفال لأي غرض غير إنشاء القصص المطلوبة'
      ]
    },
    {
      icon: Shield,
      title: 'حقوقك',
      content: [
        'الحق في الوصول إلى معلوماتك الشخصية',
        'الحق في تعديل أو تحديث بياناتك',
        'الحق في حذف حسابك ومعلوماتك',
        'الحق في تحميل نسخة من بياناتك',
        'الحق في إيقاف الرسائل التسويقية',
        'الحق في تقديم شكوى بخصوص معالجة بياناتك'
      ]
    },
    {
      icon: AlertCircle,
      title: 'معلومات الأطفال',
      content: [
        'نحمي خصوصية الأطفال وفقاً لأعلى المعايير الدولية',
        'نجمع الحد الأدنى من المعلومات اللازمة فقط',
        'صور الأطفال تُستخدم حصرياً لإنشاء القصص المطلوبة',
        'لا نشارك معلومات الأطفال مع أي طرف ثالث',
        'يمكن للوالدين طلب حذف معلومات أطفالهم في أي وقت',
        'جميع البيانات محمية بأعلى مستويات الأمان'
      ]
    }
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
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-changa font-bold text-primary mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-xl font-reem text-gray-600 max-w-2xl mx-auto mb-4">
            نحن ملتزمون بحماية خصوصيتك وخصوصية أطفالك
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
            مقدمة
          </h2>
          <div className="font-tajawal text-gray-700 leading-relaxed space-y-4">
            <p>
              مرحباً بكم في عالم كوكو (Koko Land). نحن نؤمن بأن الخصوصية حق أساسي، 
              خاصة عندما يتعلق الأمر بالأطفال. هذه السياسة توضح كيف نجمع ونستخدم ونحمي 
              معلوماتكم الشخصية ومعلومات أطفالكم.
            </p>
            <p>
              نحن ملتزمون بشفافية كاملة في ممارساتنا، ونستخدم أحدث التقنيات لضمان 
              أمان وحماية جميع البيانات المؤتمنة لدينا.
            </p>
            <p>
              باستخدام منصتنا، فإنك توافق على الممارسات الموضحة في هذه السياسة. 
              إذا كان لديك أي استفسارات، لا تتردد في التواصل معنا.
            </p>
          </div>
        </motion.div>

        {/* Privacy Sections */}
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

        {/* Cookies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent1/20 to-primary/20 rounded-3xl p-8 mt-8 border border-accent1/30"
        >
          <h2 className="text-xl font-reem font-bold text-primary mb-4">
            استخدام ملفات الارتباط (Cookies)
          </h2>
          <div className="font-tajawal text-gray-700 leading-relaxed space-y-3">
            <p>
              نستخدم ملفات الارتباط لتحسين تجربتك على موقعنا. هذه الملفات تساعدنا في:
            </p>
            <ul className="space-y-2 pr-4">
              <li>• تذكر تفضيلاتك وإعداداتك</li>
              <li>• تحسين أداء الموقع وسرعة التحميل</li>
              <li>• فهم كيفية استخدامك للموقع لتطويره</li>
              <li>• تقديم محتوى مناسب لاهتماماتك</li>
            </ul>
            <p>
              يمكنك تعطيل ملفات الارتباط من إعدادات متصفحك، لكن هذا قد يؤثر على بعض وظائف الموقع.
            </p>
          </div>
        </motion.div>

        {/* Data Retention */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg p-8 mt-8"
        >
          <h2 className="text-xl font-reem font-bold text-gray-800 mb-4">
            مدة الاحتفاظ بالبيانات
          </h2>
          <div className="font-tajawal text-gray-700 leading-relaxed space-y-4">
            <p>
              نحتفظ بمعلوماتك الشخصية طالما كان حسابك نشطاً أو حسب الحاجة لتقديم خدماتنا. 
              عند طلب حذف الحساب، نحذف جميع البيانات الشخصية خلال 30 يوماً.
            </p>
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-4 border border-primary/10">
              <p className="font-reem font-semibold text-primary mb-2">
                صور الأطفال:
              </p>
              <p>
                تُحذف صور الأطفال فور الانتهاء من إنشاء القصة المطلوبة، 
                ولا نحتفظ بها في خوادمنا لأي فترة إضافية.
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
            التواصل معنا
          </h2>
          <div className="font-tajawal text-gray-700 leading-relaxed space-y-4">
            <p>
              إذا كانت لديك أسئلة حول هذه السياسة أو ممارساتنا في الخصوصية، 
              أو تريد ممارسة حقوقك المتعلقة ببياناتك، يمكنك التواصل معنا:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center ml-3">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-reem font-semibold">البريد الإلكتروني:</p>
                  <p>privacy@koko-land.com</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center ml-3">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-reem font-semibold">موظف حماية البيانات:</p>
                  <p>dpo@koko-land.com</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Updates Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-accent1/20 rounded-2xl p-6 mt-8 border border-accent1/30"
        >
          <div className="flex items-center mb-3">
            <AlertCircle className="h-6 w-6 text-accent1 ml-3" />
            <h3 className="font-reem font-bold text-accent1">تحديثات السياسة</h3>
          </div>
          <p className="font-tajawal text-gray-700 text-sm leading-relaxed">
            قد نحدث هذه السياسة من وقت لآخر. سنخطرك بأي تغييرات مهمة عبر البريد الإلكتروني 
            أو من خلال إشعار على الموقع. ننصحك بمراجعة هذه الصفحة بانتظام للاطلاع على أحدث المعلومات.
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
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-reem text-lg font-semibold shadow-lg"
            >
              تواصل معنا للاستفسارات
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/terms')}
              className="bg-white border-2 border-primary text-primary px-8 py-4 rounded-full font-reem text-lg font-semibold hover:bg-primary hover:text-white transition-all"
            >
              اطلع على الشروط والأحكام
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;