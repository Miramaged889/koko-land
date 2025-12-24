import React from 'react';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import { ContactFormData } from '../../types';
import { CONTACT_SUBJECTS } from '../../constants';
import { useForm } from '../../hooks/useForm';
import { validateEmail } from '../../utils';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  isSubmitted?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isSubmitted = false }) => {
  const validateForm = (values: ContactFormData) => {
    const errors: Partial<ContactFormData> = {};
    
    if (!values.name.trim()) {
      errors.name = 'الاسم مطلوب';
    }
    
    if (!values.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!validateEmail(values.email)) {
      errors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!values.subject.trim()) {
      errors.subject = 'موضوع الرسالة مطلوب';
    }
    
    if (!values.message.trim()) {
      errors.message = 'الرسالة مطلوبة';
    } else if (values.message.length < 10) {
      errors.message = 'الرسالة قصيرة جداً';
    }
    
    return errors;
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    onSubmit,
    validate: validateForm
  });

  return (
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
        <Input
          name="name"
          value={values.name}
          onChange={handleChange}
          label="الاسم الكامل"
          placeholder="أدخل اسمك الكامل"
          required
          error={errors.name}
        />

        <Input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          label="البريد الإلكتروني"
          placeholder="example@email.com"
          required
          error={errors.email}
        />

        <div>
          <label className="block font-reem font-semibold text-gray-700 mb-2">
            موضوع الرسالة *
          </label>
          <select
            name="subject"
            value={values.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right bg-white"
          >
            <option value="">اختر موضوع الرسالة</option>
            {CONTACT_SUBJECTS.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          {errors.subject && (
            <p className="text-red-500 text-sm font-tajawal mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block font-reem font-semibold text-gray-700 mb-2">
            الرسالة *
          </label>
          <textarea
            name="message"
            value={values.message}
            onChange={handleChange}
            required
            rows={6}
            placeholder="اكتب رسالتك هنا..."
            className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right resize-none"
          />
          {errors.message && (
            <p className="text-red-500 text-sm font-tajawal mt-1">{errors.message}</p>
          )}
        </div>

        <Button
          type="submit"
          loading={isSubmitting}
          icon={<Send className="h-5 w-5" />}
          className="w-full"
        >
          إرسال الرسالة
        </Button>
      </form>
    </div>
  );
};

export default ContactForm; 