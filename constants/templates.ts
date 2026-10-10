import { DesignCategory, CanvasDimensions } from '../types';

export const CANVAS_PRESETS: CanvasDimensions[] = [
  { id: 'insta_square', name: 'Instagram Square (1080×1080)', nameUr: 'انسٹاگرام اسکوائر (1080×1080)', nameSd: 'انسٽاگرام اسڪوائر (1080×1080)', width: 1080, height: 1080, aspectRatio: '1:1' },
  { id: 'insta_story', name: 'Story / Reel (1080×1920)', nameUr: 'اسٹوری / ریل (1080×1920)', nameSd: 'اسٽوري / ريل (1080×1920)', width: 1080, height: 1920, aspectRatio: '9:16' },
  { id: 'yt_thumb', name: 'YouTube Thumbnail (1280×720)', nameUr: 'یوٹیوب تھمب نیل (1280×720)', nameSd: 'يوٽيوب ٿمب نيل (1280×720)', width: 1280, height: 720, aspectRatio: '16:9' },
  { id: 'poster_portrait', name: 'Poster Portrait (1080×1350)', nameUr: 'پوسٹر پورٹریٹ (1080×1350)', nameSd: 'پوسٽر پورٽريٽ (1080×1350)', width: 1080, height: 1350, aspectRatio: '4:5' },
  { id: 'fb_post', name: 'Facebook Banner (1200×630)', nameUr: 'فیس بک بینر (1200×630)', nameSd: 'فيس بوڪ بئنر (1200×630)', width: 1200, height: 630, aspectRatio: '1.91:1' },
  { id: 'biz_card', name: 'Business Card (1050×600)', nameUr: 'بزنس کارڈ (1050×600)', nameSd: 'بزنس ڪارڊ (1050×600)', width: 1050, height: 600, aspectRatio: '7:4' },
  { id: 'flyer_print', name: 'A4 Flyer Print (1240×1754)', nameUr: 'اے فور فلائر (1240×1754)', nameSd: 'اي فور فلائر (1240×1754)', width: 1240, height: 1754, aspectRatio: '1:1.41' },
  { id: 'banner_hero', name: 'Web Hero Banner (1920×600)', nameUr: 'ویب ہیرو بینر (1920×600)', nameSd: 'ويب هيرو بئنر (1920×600)', width: 1920, height: 600, aspectRatio: '16:5' }
];

export const DESIGN_CATEGORIES: DesignCategory[] = [
  {
    id: 'social',
    name: 'Social Media Graphics',
    nameUr: 'سوشل میڈیا پوسٹس',
    nameSd: 'سوشل ميڊيا پوسٽون',
    icon: '📱',
    subCategories: [
      { id: 'insta_post', name: 'Instagram Post', nameUr: 'انسٹاگرام پوسٹ', nameSd: 'انسٽاگرام پوسٽ', defaultWidth: 1080, defaultHeight: 1080 },
      { id: 'insta_story', name: 'Instagram Story / Reel', nameUr: 'انسٹاگرام اسٹوری', nameSd: 'انسٽاگرام اسٽوري', defaultWidth: 1080, defaultHeight: 1920 },
      { id: 'fb_feed', name: 'Facebook Feed Post', nameUr: 'فیس بک فیڈ پوسٹ', nameSd: 'فيس بوڪ پوسٽ', defaultWidth: 1200, defaultHeight: 630 },
      { id: 'carousel_slide', name: 'Carousel Slide', nameUr: 'کیروسل سلائیڈ', nameSd: 'ڪيروسل سلائيڊ', defaultWidth: 1080, defaultHeight: 1080 },
      { id: 'quote_creative', name: 'Motivational / Poetry Quote', nameUr: 'اقوال زریں و شاعری', nameSd: 'شاعري ۽ قول پوسٽ', defaultWidth: 1080, defaultHeight: 1080 }
    ]
  },
  {
    id: 'thumbnails',
    name: 'YouTube Thumbnails',
    nameUr: 'یوٹیوب تھمب نیلز',
    nameSd: 'يوٽيوب ٿمب نيلز',
    icon: '📺',
    subCategories: [
      { id: 'yt_gaming', name: 'Gaming Thumbnail', nameUr: 'گیمنگ تھمب نیل', nameSd: 'گيمنگ ٿمب نيل', defaultWidth: 1280, defaultHeight: 720 },
      { id: 'yt_vlog', name: 'Vlog & Lifestyle', nameUr: 'بلاگ اور سفر', nameSd: 'ولاگ ۽ طرز زندگي', defaultWidth: 1280, defaultHeight: 720 },
      { id: 'yt_islamic', name: 'Islamic / Bayan Thumbnail', nameUr: 'اسلامی بیان و درس', nameSd: 'اسلامي بيان ٿمب نيل', defaultWidth: 1280, defaultHeight: 720 },
      { id: 'yt_news', name: 'News & Current Affairs', nameUr: 'خبریں اور تجزیہ', nameSd: 'خبرون ۽ تجزيو', defaultWidth: 1280, defaultHeight: 720 },
      { id: 'yt_tech', name: 'Tech & Tutorial', nameUr: 'ٹیکنالوجی گائیڈ', nameSd: 'ٽيڪنالاجي رهنمائي', defaultWidth: 1280, defaultHeight: 720 }
    ]
  },
  {
    id: 'ads',
    name: 'Marketing Advertisements',
    nameUr: 'مارکیٹنگ اور تشہیری بینرز',
    nameSd: 'مارڪيٽنگ ۽ اشتهاري بئنر',
    icon: '🚀',
    subCategories: [
      { id: 'ad_sale', name: 'Flash Sale & Mega Discount', nameUr: 'بڑی رعایت اور سیل', nameSd: 'وڏي رعايت ۽ سيل', defaultWidth: 1080, defaultHeight: 1080 },
      { id: 'ad_launch', name: 'Product Launch Creative', nameUr: 'نئی پروڈکٹ لانچ', nameSd: 'نئين پراڊڪٽ لانچ', defaultWidth: 1080, defaultHeight: 1080 },
      { id: 'ad_fashion', name: 'Apparel & Fashion Ad', nameUr: 'ملبوسات اور فیشن', nameSd: 'ڪپڙا ۽ فيشن اشتهار', defaultWidth: 1080, defaultHeight: 1350 },
      { id: 'ad_food', name: 'Restaurant Food Promo', nameUr: 'کھانوں کی خصوصی ڈیل', nameSd: 'کاڌن جي خاص آڇ', defaultWidth: 1080, defaultHeight: 1080 }
    ]
  },
  {
    id: 'posters',
    name: 'Posters, Flyers & Brochures',
    nameUr: 'پوسٹرز اور فلائیرز',
    nameSd: 'پوسٽر ۽ فلائرس',
    icon: '🖼️',
    subCategories: [
      { id: 'poster_event', name: 'Conference & Event Poster', nameUr: 'تقریب و سیمینار پوسٹر', nameSd: 'تقريب ۽ سيمينار پوسٽر', defaultWidth: 1080, defaultHeight: 1350 },
      { id: 'poster_mushaira', name: 'Mehfil / Mushaira Poster', nameUr: 'محفل نعت و مشاعرہ', nameSd: 'محفل نعت ۽ مشاعرو', defaultWidth: 1080, defaultHeight: 1350 },
      { id: 'poster_edu', name: 'Educational Admission Poster', nameUr: 'تعلیمی داخلہ پوسٹر', nameSd: 'تعليمي داخلا پوسٽر', defaultWidth: 1240, defaultHeight: 1754 },
      { id: 'poster_realestate', name: 'Real Estate Property Flyer', nameUr: 'رئیل اسٹیٹ پراپرٹی فلائر', nameSd: 'ريئل اسٽيٽ پراپرٽي فلائر', defaultWidth: 1080, defaultHeight: 1350 }
    ]
  },
  {
    id: 'cards',
    name: 'Business Cards & Stationery',
    nameUr: 'وزٹنگ کارڈز اور اسٹیشنری',
    nameSd: 'بزنس ڪارڊ ۽ اسٽيشنري',
    icon: '📇',
    subCategories: [
      { id: 'card_luxury', name: 'Luxury Gold Foil Card', nameUr: 'پریمیم گولڈ کارڈ', nameSd: 'پريميم گولڊ ڪارڊ', defaultWidth: 1050, defaultHeight: 600 },
      { id: 'card_minimal', name: 'Corporate Minimalist Card', nameUr: 'کارپوریٹ وزٹنگ کارڈ', nameSd: 'ڪارپوريٽ وزٽنگ ڪارڊ', defaultWidth: 1050, defaultHeight: 600 },
      { id: 'card_vertical', name: 'Modern Vertical Card', nameUr: 'عمودی وزٹنگ کارڈ', nameSd: 'عمودي وزٽنگ ڪارڊ', defaultWidth: 600, defaultHeight: 1050 }
    ]
  },
  {
    id: 'logos',
    name: 'Logos & Brand Identity',
    nameUr: 'لوگو اور برانڈ شناختی نشانات',
    nameSd: 'لوگو ۽ ثقافتي سڃاڻپ',
    icon: '💎',
    subCategories: [
      { id: 'logo_calligraphy', name: 'Urdu / Arabic Calligraphy Emblem', nameUr: 'خطاطی مونوگرام', nameSd: 'خطاطي لوگو', defaultWidth: 1080, defaultHeight: 1080 },
      { id: 'logo_sindhi', name: 'Sindhi Heritage Motif Logo', nameUr: 'سنڌي ثقافتی نشان', nameSd: 'سنڌي ثقافتي سڃاڻپ', defaultWidth: 1080, defaultHeight: 1080 },
      { id: 'logo_modern', name: 'Modern Geometric Vector Logo', nameUr: 'جدید جیومیٹرک لوگو', nameSd: 'جديد جاميٽري لوگو', defaultWidth: 1080, defaultHeight: 1080 }
    ]
  },
  {
    id: 'menus',
    name: 'Menus & Catalogues',
    nameUr: 'ریستوران مینو اور کیٹلاگ',
    nameSd: 'ريستوران مينيو ۽ فهرست',
    icon: '📋',
    subCategories: [
      { id: 'menu_dine', name: 'Dine-In Restaurant Menu', nameUr: 'کھانوں کا تفصیلی مینو', nameSd: 'کاڌي جو تفصيلي مينيو', defaultWidth: 1080, defaultHeight: 1520 },
      { id: 'menu_cafe', name: 'Chai & Cafe Price Board', nameUr: 'چائے خانہ مینو بورڈ', nameSd: 'چانهه ۽ ڪيفي مينيو', defaultWidth: 1080, defaultHeight: 1520 }
    ]
  },
  {
    id: 'certificates',
    name: 'Certificates & Invitations',
    nameUr: 'شادی کارڈز اور اسناد',
    nameSd: 'شادي ڪارڊ ۽ سرٽيفڪيٽ',
    icon: '✉️',
    subCategories: [
      { id: 'inv_nikkah', name: 'Nikkah & Walima Invitation', nameUr: 'دعوت نامہ نکاح و ولیمہ', nameSd: 'دعوت نامو نڪاح ۽ وليمو', defaultWidth: 1080, defaultHeight: 1520 },
      { id: 'inv_mehndi', name: 'Mehndi Celebrations Card', nameUr: 'دعوت نامہ رسم حنا', nameSd: 'دعوت نامو رسم حنا', defaultWidth: 1080, defaultHeight: 1520 },
      { id: 'cert_achievement', name: 'Honor & Achievement Certificate', nameUr: 'سند امتیاز و تعریفی سرٹیفکیٹ', nameSd: 'تعريفي سند ۽ سرٽيفڪيٽ', defaultWidth: 1520, defaultHeight: 1080 }
    ]
  },
  {
    id: 'books',
    name: 'Book Covers & Education',
    nameUr: 'کتابوں کے سرورق اور میگزین',
    nameSd: 'ڪتابن جا سرورق ۽ رسالا',
    icon: '📚',
    subCategories: [
      { id: 'book_urdu', name: 'Urdu Novel / Poetry Cover', nameUr: 'اردو شاعری و ناول سرورق', nameSd: 'اردو شاعري ۽ ناول سرورق', defaultWidth: 1080, defaultHeight: 1620 },
      { id: 'book_sindhi', name: 'Sindhi Adab / Shah Jo Risalo', nameUr: 'سنڌي ادب سرورق', nameSd: 'سنڌي ادب سرورق', defaultWidth: 1080, defaultHeight: 1620 }
    ]
  },
  {
    id: 'banners',
    name: 'Banners, Signs & Print Layouts',
    nameUr: 'فلیکس بینرز اور شاپ بورڈز',
    nameSd: 'فلڪس بئنر ۽ دڪان جا بورڊ',
    icon: '🏁',
    subCategories: [
      { id: 'banner_web', name: 'Website Hero Billboard', nameUr: 'ویب سائٹ بینر', nameSd: 'ويب سائيٽ بئنر', defaultWidth: 1920, defaultHeight: 600 },
      { id: 'banner_shop', name: 'Commercial Shop Flex Board', nameUr: 'دکان و شوروم فلیکس بورڈ', nameSd: 'دڪان ۽ شو روم فلڪس بورڊ', defaultWidth: 1920, defaultHeight: 800 }
    ]
  },
  {
    id: 'mockups',
    name: 'Product Mockups & Presentations',
    nameUr: 'پروڈکٹ ماک اپس',
    nameSd: 'پراڊڪٽ ماڪ اپ',
    icon: '📦',
    subCategories: [
      { id: 'mockup_box', name: 'Packaging Box & Label Showcase', nameUr: 'پیکیجنگ باکس اور لیبل', nameSd: 'پيڪيجنگ باڪس ۽ ليبل', defaultWidth: 1080, defaultHeight: 1080 },
      { id: 'mockup_app', name: 'Mobile App Device Mockup', nameUr: 'موبائل ایپ پریزنٹیشن', nameSd: 'موبائل ايپ پيشڪش', defaultWidth: 1080, defaultHeight: 1080 }
    ]
  }
];

export const FONT_OPTIONS = [
  { name: 'Noto Nastaliq Urdu (نستعلیق)', value: "'Noto Nastaliq Urdu', serif", script: 'ur', style: 'Traditional Calligraphic' },
  { name: 'Noto Sans Sindhi (سنڌي نسخ)', value: "'Noto Sans Sindhi', serif", script: 'sd', style: 'Sindhi Naskh Clean' },
  { name: 'Amiri Arabic Calligraphy (أميري)', value: "'Amiri', serif", script: 'ar', style: 'Royal Arabic Serif' },
  { name: 'Inter Modern Sans', value: "'Inter', sans-serif", script: 'en', style: 'Crisp Geometric Sans' },
  { name: 'Playfair Display Serif', value: "'Playfair Display', serif", script: 'en', style: 'High-end Editorial' },
  { name: 'Bebas Neue Headline', value: "'Bebas Neue', cursive", script: 'en', style: 'Punchy Tall Display' }
];

export const COLOR_PRESETS = [
  { name: 'Studio Indigo & Slate', primary: '#4f46e5', secondary: '#0f172a', bg: '#f8fafc' },
  { name: 'Royal Emerald & Gold', primary: '#047857', secondary: '#d97706', bg: '#f0fdf4' },
  { name: 'Sindhi Ajrak Maroon & Royal Blue', primary: '#881337', secondary: '#1e3a8a', bg: '#fff1f2' },
  { name: 'Deep Sapphire & Amber', primary: '#1e40af', secondary: '#f59e0b', bg: '#eff6ff' },
  { name: 'Midnight Violet & Fuchsia', primary: '#581c87', secondary: '#c026d3', bg: '#faf5ff' },
  { name: 'Monochrome Editorial Noir', primary: '#18181b', secondary: '#71717a', bg: '#ffffff' }
];

export const LOADING_MESSAGES = [
  "Analyzing design brief & multilingual typography...",
  "Applying Noto Nastaliq & Sindhi Naskh character shaping...",
  "Synthesizing geometric composition & optical balance...",
  "Generating layered visual structure & color palettes...",
  "Finalizing Ultra-HD master graphics & assets...",
  "Verifying glyph integrity and Photoshop-ready layers..."
];
