import {
  Book,
  Theme,
  AgeGroup,
  ContactInfo,
  TeamMember,
  Achievement,
  Value,
} from "../types";
import {
  Heart,
  Users,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Clock,
  HeadphonesIcon,
  MessageCircle,
  CreditCard,
  Smartphone,
  Globe,
  Palette,
  BookOpen,
  Theater,
} from "lucide-react";

// Navigation Items
export const NAV_ITEMS = [
  { key: "home", label: "الرئيسية" },
  { key: "books", label: "الكتب" },
  { key: "create", label: "أنشئ قصتك" },
  { key: "library", label: "مكتبتي" },
  { key: "about", label: "من نحن" },
  { key: "contact", label: "اتصل بنا" },
];

// Book Categories
export const BOOK_CATEGORIES = [
  "الكل",
  "مغامرات",
  "علوم",
  "خيال",
  "طبيعة",
  "تعليمي",
];

// Sample Books Data
export const SAMPLE_BOOKS: Book[] = [
  {
    id: "1",
    title: "مغامرة في الغابة السحرية",
    description:
      "انطلق مع البطل في رحلة مثيرة عبر الغابة المليئة بالأسرار والمخلوقات الودودة",
    longDescription:
      "في هذه القصة الرائعة، سيصبح طفلك بطل المغامرة وهو يستكشف أسرار الغابة السحرية المليئة بالعجائب. سيتعلم كيف يتعامل مع التحديات، ويكون صداقات جديدة مع الحيوانات، ويحل الألغاز المثيرة. القصة مليئة بالرسوم الملونة والتفاعلية التي تجذب انتباه الأطفال وتجعلهم جزءًا من الحدث.",
    price: "29.99",
    rating: 4.8,
    reviewsCount: 156,
    color: "from-accent2 to-secondary",
    emoji: "🌳",
    category: "مغامرات",
    ageGroup: "3-7 سنوات",
    readingTime: "15-20 دقيقة",
    features: [
      "صور مخصصة للطفل",
      "رسوم تفاعلية ملونة",
      "قيم تربوية هادفة",
      "تسجيل صوتي للقصة",
      "أنشطة تفاعلية",
    ],
    samplePages: ["🌳🦋", "🐰🌺", "🦌✨"],
  },
  {
    id: "2",
    title: "رحلة إلى الفضاء",
    description: "اكتشف الكواكب والنجوم في مغامرة فضائية لا تُنسى",
    price: "34.99",
    rating: 4.9,
    color: "from-secondary to-primary",
    emoji: "🚀",
    category: "علوم",
  },
  {
    id: "3",
    title: "قصر الأميرة الصغيرة",
    description: "قصة رائعة عن الشجاعة والصداقة في مملكة بعيدة",
    price: "27.99",
    rating: 4.7,
    color: "from-primary to-accent1",
    emoji: "👸",
    category: "خيال",
  },
  {
    id: "4",
    title: "عالم البحار العجيب",
    description: "اغوص في أعماق البحار واكتشف الكنوز المخفية",
    price: "31.99",
    rating: 4.8,
    color: "from-accent1 to-accent2",
    emoji: "🐠",
    category: "طبيعة",
  },
  {
    id: "5",
    title: "مدرسة السحر الصغيرة",
    description: "تعلم السحر في أكاديمية الساحرات الصغار",
    price: "33.99",
    rating: 4.9,
    color: "from-primary via-secondary to-accent2",
    emoji: "🔮",
    category: "خيال",
  },
  {
    id: "6",
    title: "مزرعة الحيوانات المرحة",
    description: "تعرف على أصدقائك الجدد من الحيوانات الأليفة",
    price: "25.99",
    rating: 4.6,
    color: "from-accent2 via-accent1 to-primary",
    emoji: "🐷",
    category: "تعليمي",
  },
];

// Story Creation Themes
export const STORY_THEMES: Theme[] = [
  {
    id: "adventure",
    title: "مغامرة في الغابة",
    emoji: "🌳",
    color: "from-accent2 to-secondary",
  },
  {
    id: "space",
    title: "رحلة فضائية",
    emoji: "🚀",
    color: "from-secondary to-primary",
  },
  {
    id: "princess",
    title: "قصر الأميرة",
    emoji: "👸",
    color: "from-primary to-accent1",
  },
  {
    id: "ocean",
    title: "عالم البحار",
    emoji: "🐠",
    color: "from-accent1 to-accent2",
  },
  {
    id: "farm",
    title: "مزرعة الحيوانات",
    emoji: "🐷",
    color: "from-accent2 to-primary",
  },
  {
    id: "magic",
    title: "مدرسة السحر",
    emoji: "🔮",
    color: "from-primary to-secondary",
  },
];

// Age Groups
export const AGE_GROUPS: AgeGroup[] = [
  { value: "2-3", label: "2-3 سنوات" },
  { value: "4-5", label: "4-5 سنوات" },
  { value: "6-7", label: "6-7 سنوات" },
];

// Contact Information
export const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    value: "info@koko-land.com",
    description: "راسلنا في أي وقت",
    color: "from-primary to-accent1",
  },
  {
    icon: Phone,
    title: "الهاتف",
    value: "+966 50 123 4567",
    description: "متاح من 9 صباحاً - 6 مساءً",
    color: "from-secondary to-accent2",
  },
  {
    icon: MapPin,
    title: "العنوان",
    value: "الرياض، المملكة العربية السعودية",
    description: "يمكنك زيارتنا بموعد مسبق",
    color: "from-accent2 to-primary",
  },
  {
    icon: Clock,
    title: "ساعات العمل",
    value: "الأحد - الخميس",
    description: "9:00 ص - 6:00 م",
    color: "from-accent1 to-secondary",
  },
];

// Team Members
export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "سارة أحمد",
    role: "مؤسسة ومديرة إبداعية",
    emoji: "👩‍💼",
    description: "خبيرة في أدب الأطفال مع أكثر من 10 سنوات من الخبرة",
  },
  {
    name: "محمد علي",
    role: "مطور التقنية",
    emoji: "👨‍💻",
    description: "متخصص في تطوير المنصات التفاعلية والذكاء الاصطناعي",
  },
  {
    name: "فاطمة حسن",
    role: "مصممة الرسوم",
    emoji: "👩‍🎨",
    description: "فنانة موهوبة متخصصة في رسوم الأطفال والقصص المصورة",
  },
];

// Values
export const VALUES: Value[] = [
  {
    icon: Heart,
    title: "حب التعلم",
    description: "نؤمن بأن القراءة والقصص هي أساس تنمية حب التعلم لدى الأطفال",
    color: "from-primary to-accent1",
  },
  {
    icon: Sparkles,
    title: "الإبداع والخيال",
    description: "نسعى لتنمية خيال الأطفال وإبداعهم من خلال قصص تفاعلية مميزة",
    color: "from-secondary to-accent2",
  },
  {
    icon: Users,
    title: "الأسرة أولاً",
    description: "نركز على تقوية الروابط الأسرية من خلال تجارب قراءة مشتركة",
    color: "from-accent2 to-primary",
  },
];

// Achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    number: "10,000+",
    label: "قصة مخصصة تم إنشاؤها",
    icon: "📚",
  },
  {
    number: "5,000+",
    label: "عائلة سعيدة",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    number: "50+",
    label: "قصة أصلية",
    icon: "✨",
  },
  {
    number: "4.9/5",
    label: "تقييم المستخدمين",
    icon: "⭐",
  },
];

// Contact Form Subjects
export const CONTACT_SUBJECTS = [
  "استفسار عام",
  "مشكلة تقنية",
  "طلب مساعدة",
  "تحسين الخدمة",
  "شكوى",
  "اقتراح",
  "طلب شراكة",
];

// Payment Methods
export const PAYMENT_METHODS = [
  { id: "card", label: "بطاقة ائتمانية", icon: CreditCard },
  { id: "apple", label: "Apple Pay", icon: Smartphone },
  { id: "google", label: "Google Pay", icon: Globe },
];

// Support Options
export const SUPPORT_OPTIONS = [
  {
    icon: HeadphonesIcon,
    title: "الدعم الفني",
    description: "مساعدة في استخدام المنصة",
    action: "تواصل الآن",
  },
  {
    icon: MessageCircle,
    title: "استفسارات عامة",
    description: "أسئلة حول الخدمات والأسعار",
    action: "اسأل سؤالك",
  },
  {
    icon: Mail,
    title: "اقتراحات وتطوير",
    description: "شاركنا أفكارك لتحسين الخدمة",
    action: "شارك فكرتك",
  },
];
