import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HeadphonesIcon } from 'lucide-react';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'البريد الإلكتروني',
      value: 'info@koko-land.com',
      description: 'راسلنا في أي وقت',
      color: 'from-primary to-accent1'
    },
    {
      icon: Phone,
      title: 'الهاتف',
      value: '+966 50 123 4567',
      description: 'متاح من 9 صباحاً - 6 مساءً',
      color: 'from-secondary to-accent2'
    },
    {
      icon: MapPin,
      title: 'العنوان',
      value: 'الرياض، المملكة العربية السعودية',
      description: 'يمكنك زيارتنا بموعد مسبق',
      color: 'from-accent2 to-primary'
    },
    {
      icon: Clock,
      title: 'ساعات العمل',
      value: 'الأحد - الخميس',
      description: '9:00 ص - 6:00 م',
      color: 'from-accent1 to-secondary'
    }
  ];

  const supportOptions = [
    {
      icon: HeadphonesIcon,
      title: 'الدعم الفني',
      description: 'مساعدة في استخدام المنصة',
      action: 'تواصل الآن'
    },
    {
      icon: MessageCircle,
      title: 'استفسارات عامة',
      description: 'أسئلة حول الخدمات والأسعار',
      action: 'اسأل سؤالك'
    },
    {
      icon: Mail,
      title: 'اقتراحات وتطوير',
      description: 'شاركنا أفكارك لتحسين الخدمة',
      action: 'شارك فكرتك'
    }
  ];

  const subjectOptions = [
    'استفسار عام',
    'مشكلة تقنية',
    'طلب مساعدة',
    'تحسين الخدمة',
    'شكوى',
    'اقتراح',
    'طلب شراكة'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-changa font-bold text-primary mb-4">
            تواصل معنا
          </h1>
          <p className="text-xl font-reem text-gray-600 max-w-2xl mx-auto">
            نحن هنا لمساعدتك! راسلnا أو اتصل بنا وسنرد عليك في أقرب وقت ممكن
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              className="bg-white rounded-3xl shadow-lg p-6 text-center"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <info.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-reem font-bold text-gray-800 mb-2">
                {info.title}
              </h3>
              <p className="font-tajawal font-semibold text-primary mb-1">
                {info.value}
              </p>
              <p className="font-tajawal text-sm text-gray-600">
                {info.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-reem font-bold text-gray-800 mb-6">
                أرسل لنا رسالة
              </h2>

              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-accent2/20 to-secondary/20 border border-accent2/30 rounded-2xl p-4 mb-6"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent2 to-secondary rounded-full flex items-center justify-center ml-3">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-reem font-semibold text-accent2">تم إرسال الرسالة بنجاح!</h4>
                      <p className="font-tajawal text-sm text-gray-600">سنرد عليك خلال 24 ساعة</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-reem font-semibold text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right"
                  />
                </div>

                <div>
                  <label className="block font-reem font-semibold text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="example@email.com"
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right"
                  />
                </div>

                <div>
                  <label className="block font-reem font-semibold text-gray-700 mb-2">
                    موضوع الرسالة *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right bg-white"
                  >
                    <option value="">اختر موضوع الرسالة</option>
                    {subjectOptions.map((option, index) => (
                      <option key={index} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-reem font-semibold text-gray-700 mb-2">
                    الرسالة *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full py-4 rounded-2xl font-reem text-lg font-semibold transition-all flex items-center justify-center ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-3"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 ml-3" />
                      إرسال الرسالة
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Support Options & FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Support Options */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-reem font-bold text-gray-800 mb-6">
                كيف يمكننا مساعدتك؟
              </h2>
              
              <div className="space-y-4">
                {supportOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-2xl p-4 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center ml-4">
                        <option.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-reem font-semibold text-gray-800 mb-1">
                          {option.title}
                        </h3>
                        <p className="font-tajawal text-sm text-gray-600 mb-2">
                          {option.description}
                        </p>
                        <span className="text-primary font-reem text-sm font-medium">
                          {option.action} ←
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8">
              <h3 className="text-xl font-reem font-bold text-primary mb-4">
                أسئلة شائعة
              </h3>
              <div className="space-y-3">
                {[
                  'كيف أنشئ قصة مخصصة لطفلي؟',
                  'كم يستغرق إعداد القصة؟',
                  'ما هي طرق الدفع المتاحة؟',
                  'هل يمكنني تعديل القصة بعد الشراء؟',
                  'كيف أحمل القصة؟'
                ].map((question, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ x: 5 }}
                    className="block w-full text-right font-tajawal text-gray-700 hover:text-primary transition-colors text-sm py-2"
                  >
                    • {question}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-accent1/20 rounded-2xl p-6 border border-accent1/30"
            >
              <div className="flex items-center mb-3">
                <Clock className="h-6 w-6 text-accent1 ml-3" />
                <h3 className="font-reem font-bold text-accent1">وقت الاستجابة</h3>
              </div>
              <p className="font-tajawal text-gray-700 text-sm leading-relaxed">
                نرد على جميع الرسائل خلال 24 ساعة. للاستفسارات العاجلة، 
                يرجى الاتصال بنا هاتفياً خلال ساعات العمل.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8"
        >
          <h2 className="text-2xl md:text-3xl font-changa font-bold text-primary mb-4">
            هل أنت مستعد لبدء المغامرة؟
          </h2>
          <p className="font-reem text-gray-600 mb-6 max-w-2xl mx-auto">
            لا تتردد في إنشاء قصة مخصصة لطفلك اليوم واكتشف عالم كوكو المليء بالمتعة والتعلم
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/create')}
            className="bg-gradient-to-r from-accent2 to-secondary text-white px-8 py-4 rounded-full font-reem text-lg font-semibold shadow-lg"
          >
            ابدأ قصتك الآن
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;