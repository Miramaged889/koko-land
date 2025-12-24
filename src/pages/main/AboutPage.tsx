import React from "react";
import { motion } from "framer-motion";
import { Target, Award } from "lucide-react";
import { TEAM_MEMBERS, VALUES, ACHIEVEMENTS } from "../../constants";
import { PageHeader, PageContainer, CallToAction } from "../components";

const AboutPage: React.FC = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <PageHeader
            title="من نحن؟"
            subtitle="نحن فريق متحمس لإنشاء قصص تفاعلية مخصصة تجعل كل طفل بطل مغامرته الخاصة"
            emoji="🌟"
          />

          {/* Animated Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-12 relative"
          >
            <div className="text-8xl md:text-9xl mb-8">🌟</div>
            {["📚", "🎨", "✨", "💫"].map((emoji, index) => (
              <motion.div
                key={index}
                className="absolute text-4xl"
                style={{
                  top: `${30 + Math.cos((index * Math.PI) / 2) * 30}%`,
                  left: `${30 + Math.sin((index * Math.PI) / 2) * 30}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-changa font-bold text-primary mb-6">
              قصتنا
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 font-tajawal text-lg text-gray-700 leading-relaxed">
              <p>
                بدأت رحلتنا من إيماننا العميق بأن كل طفل يستحق أن يرى نفسه بطلاً
                في قصصه المفضلة. لاحظنا أن الأطفال يشعرون بسعادة غامرة عندما
                يرون أنفسهم في القصص، مما يزيد من حبهم للقراءة ويطور خيالهم بشكل
                أكبر.
              </p>
              <p>
                مع التطور التقني الحديث، قررنا استخدام أحدث التقنيات لإنشاء منصة
                تفاعلية تمكن الأهل من إنشاء قصص مخصصة لأطفالهم بسهولة وسرعة، مع
                الحفاظ على أعلى معايير الجودة في المحتوى والتصميم.
              </p>
              <p>
                اليوم، نحن فخورون بأن نكون جزءًا من رحلة آلاف الأطفال في اكتشاف
                عالم القراءة والخيال، ونسعى دائماً لتطوير منتجاتنا وخدماتنا
                لنقدم أفضل تجربة ممكنة.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-changa font-bold text-primary mb-6">
              قيمنا
            </h2>
            <p className="text-xl font-reem text-gray-600 max-w-2xl mx-auto">
              نؤمن بقيم أساسية توجه عملنا وتحدد رؤيتنا للمستقبل
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg p-8 text-center"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center mx-auto mb-6`}
                >
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-reem font-bold text-gray-800 mb-4">
                  {value.title}
                </h3>
                <p className="font-tajawal text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-changa font-bold text-primary mb-6">
              فريقنا
            </h2>
            <p className="text-xl font-reem text-gray-600 max-w-2xl mx-auto">
              نحن مجموعة من المبدعين والمطورين المتحمسين لإنشاء تجارب رائعة
              للأطفال
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg p-8 text-center"
              >
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="text-xl font-reem font-bold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary font-reem font-semibold mb-4">
                  {member.role}
                </p>
                <p className="font-tajawal text-gray-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-changa font-bold text-primary mb-6">
              إنجازاتنا
            </h2>
            <p className="text-xl font-reem text-gray-600 max-w-2xl mx-auto">
              أرقام تعكس ثقة عملائنا ونجاح منصتنا
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ACHIEVEMENTS.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 text-center border border-primary/20"
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <div className="text-2xl md:text-3xl font-changa font-bold text-primary mb-2">
                  {achievement.number}
                </div>
                <div className="font-reem text-gray-600 text-sm">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-right"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-changa font-bold text-primary mb-4">
                رسالتنا
              </h3>
              <p className="font-tajawal text-gray-700 leading-relaxed">
                تمكين الأطفال من أن يكونوا أبطال قصصهم الخاصة، وتعزيز حبهم
                للقراءة والتعلم من خلال تجارب تفاعلية مميزة ومحتوى عالي الجودة
                يساهم في تطوير شخصياتهم وخيالهم.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center md:text-right"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-accent2 to-secondary rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-changa font-bold text-primary mb-4">
                رؤيتنا
              </h3>
              <p className="font-tajawal text-gray-700 leading-relaxed">
                أن نكون المنصة الرائدة في العالم العربي لإنشاء قصص الأطفال
                المخصصة، ونساهم في بناء جيل محب للقراءة والتعلم، قادر على
                الإبداع والتفكير النقدي من خلال تجارب قراءة فريدة وممتعة.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction
        title="انضم إلى رحلتنا"
        subtitle="ابدأ في إنشاء قصص مخصصة لأطفالك اليوم وكن جزءًا من مجتمع الأهل الذين يؤمنون بقوة القراءة"
        primaryAction={{
          label: "أنشئ قصتك الأولى",
          page: "create",
        }}
        secondaryAction={{
          label: "تواصل معنا",
          page: "contact",
        }}
      />
    </PageContainer>
  );
};

export default AboutPage;
