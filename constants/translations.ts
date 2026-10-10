import { LanguageCode } from '../types';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  studioName: string;
  newProject: string;
  savedProjects: string;
  aiGenerator: string;
  canvasEditor: string;
  exportDeliverable: string;
  masterExport: string;
  language: string;
  direction: 'ltr' | 'rtl';
  
  // Tabs & Views
  tabCreate: string;
  tabEditor: string;
  tabProjects: string;
  tabDeliverables: string;

  // AI Creation
  designBriefTitle: string;
  designBriefSubtitle: string;
  targetAudience: string;
  primaryHeadline: string;
  subHeadlineText: string;
  callToAction: string;
  brandColors: string;
  customPalette: string;
  primaryColor: string;
  secondaryColor: string;
  visualStyle: string;
  assetReference: string;
  dragOrUploadImage: string;
  generateConcepts: string;
  generating: string;
  generatingStep: string;
  outputGallery: string;
  openInEditor: string;
  regenerate: string;
  exportNow: string;

  // Editor
  tools: string;
  addText: string;
  addShape: string;
  addImage: string;
  setBackground: string;
  layers: string;
  properties: string;
  bringForward: string;
  sendBackward: string;
  duplicateLayer: string;
  deleteLayer: string;
  lockLayer: string;
  unlockLayer: string;
  hideLayer: string;
  showLayer: string;
  renameLayer: string;
  opacity: string;
  fontSize: string;
  fontFamily: string;
  textAlign: string;
  textColor: string;
  stroke: string;
  shadow: string;
  zoom: string;
  undo: string;
  redo: string;
  canvasDimensions: string;
  saveProject: string;
  savedSuccessfully: string;

  // PSD & Exports
  genuinePsd: string;
  psdDisclosure: string;
  pngLossless: string;
  jpgOptimized: string;
  svgVector: string;
  pdfPrint: string;
  zipBundle: string;
  downloading: string;
  exportSuccess: string;
  bleedOption: string;
  scaleFactor: string;
  clientDeliveryPackage: string;
  manifestInfo: string;
  
  // Multilingual glyph check
  glyphCheckPassed: string;
  glyphWarning: string;

  // Categories
  socialMedia: string;
  youtubeThumbnails: string;
  marketingAds: string;
  postersFlyers: string;
  businessCards: string;
  logosBrand: string;
  menusCatalogues: string;
  certificatesInvites: string;
  bookCovers: string;
  bannersSigns: string;
  productMockups: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    appTitle: "AI-Engine Graphic Studio",
    appSubtitle: "Professional Multilingual Graphic Platform for Urdu, Sindhi & English",
    studioName: "Studio Pro",
    newProject: "New Project",
    savedProjects: "Projects & Client Delivery",
    aiGenerator: "AI Creation Suite",
    canvasEditor: "Layer Canvas Editor",
    exportDeliverable: "Export Deliverables",
    masterExport: "Export Asset",
    language: "Language",
    direction: "ltr",

    tabCreate: "AI Studio",
    tabEditor: "Canvas Editor",
    tabProjects: "Client Delivery",
    tabDeliverables: "Master Export",

    designBriefTitle: "Design Brief & Specification",
    designBriefSubtitle: "Define target audience, typography, scripts, and visual aesthetics",
    targetAudience: "Target Audience",
    primaryHeadline: "Primary Headline / Text",
    subHeadlineText: "Sub-headline / Tagline (Optional)",
    callToAction: "Call to Action / Details",
    brandColors: "Brand Palette",
    customPalette: "Custom Colors",
    primaryColor: "Primary Color",
    secondaryColor: "Secondary Accent",
    visualStyle: "Visual Style",
    assetReference: "Reference / Logo Upload",
    dragOrUploadImage: "Upload PNG, JPG, or Logo",
    generateConcepts: "Generate 4 Design Concepts",
    generating: "Rendering Professional Graphics...",
    generatingStep: "Synthesizing Multilingual Typography & Layouts",
    outputGallery: "Generated Concepts Gallery",
    openInEditor: "Edit in Canvas Studio",
    regenerate: "Regenerate",
    exportNow: "Export Asset",

    tools: "Design Tools",
    addText: "Add Text",
    addShape: "Add Shape",
    addImage: "Add Image",
    setBackground: "Background",
    layers: "Layers Panel",
    properties: "Layer Properties",
    bringForward: "Bring Forward",
    sendBackward: "Send Backward",
    duplicateLayer: "Duplicate",
    deleteLayer: "Delete",
    lockLayer: "Lock",
    unlockLayer: "Unlock",
    hideLayer: "Hide",
    showLayer: "Show",
    renameLayer: "Rename",
    opacity: "Opacity",
    fontSize: "Font Size",
    fontFamily: "Typography Font",
    textAlign: "Alignment",
    textColor: "Text Color",
    stroke: "Border / Stroke",
    shadow: "Drop Shadow",
    zoom: "Zoom",
    undo: "Undo (Ctrl+Z)",
    redo: "Redo (Ctrl+Y)",
    canvasDimensions: "Canvas Size",
    saveProject: "Save Project",
    savedSuccessfully: "Project saved to local studio vault",

    genuinePsd: "Photoshop Layered PSD",
    psdDisclosure: "Genuine PSD file with individual raster/vector layers, transparency, and Photoshop records.",
    pngLossless: "Lossless PNG (Alpha Transparency)",
    jpgOptimized: "Optimized JPEG (Web & Social)",
    svgVector: "Scalable Vector SVG",
    pdfPrint: "Print-Ready PDF (CMYK/DPI)",
    zipBundle: "Complete Client Delivery ZIP Package",
    downloading: "Packaging Deliverable...",
    exportSuccess: "Asset exported successfully!",
    bleedOption: "Include 3mm Print Bleed Area",
    scaleFactor: "Resolution Scaling",
    clientDeliveryPackage: "Complete Delivery Package",
    manifestInfo: "Includes PSD, high-res PNG, vector SVG, print PDF, manifest & font licenses.",

    glyphCheckPassed: "Script shaping & glyph verification passed",
    glyphWarning: "Notice: Mixed script detected. Ensure correct font fallback is selected.",

    socialMedia: "Social Media Graphics",
    youtubeThumbnails: "YouTube Thumbnails",
    marketingAds: "Marketing Advertisements",
    postersFlyers: "Posters & Flyers",
    businessCards: "Business Cards & Stationery",
    logosBrand: "Logos & Brand Identity",
    menusCatalogues: "Menus & Catalogues",
    certificatesInvites: "Certificates & Invitations",
    bookCovers: "Book Covers & Education",
    bannersSigns: "Banners & Print Layouts",
    productMockups: "Product Mockups"
  },

  ur: {
    appTitle: "اے آئی انجن گرافک اسٹوڈیو",
    appSubtitle: "اردو، سنڌي ۽ انگریزی کے لیے جدید گرافک ڈیزائن پلیٹ فارم",
    studioName: "اسٹوڈیو پرو",
    newProject: "نیا پروجیکٹ",
    savedProjects: "پروجیکٹس اور کلائنٹ ڈیلیوری",
    aiGenerator: "اے آئی ڈیزائن تخلیق",
    canvasEditor: "پروفیشنل کینوس ایڈیٹر",
    exportDeliverable: "فائل ایکسپورٹ",
    masterExport: "ایکسپورٹ فائل",
    language: "زبان",
    direction: "rtl",

    tabCreate: "اے آئی اسٹوڈیو",
    tabEditor: "کینوس ایڈیٹر",
    tabProjects: "کلائنٹ ڈیلیوری",
    tabDeliverables: "ایکسپورٹ",

    designBriefTitle: "ڈیزائن کا مکمل خاکہ اور تفصیل",
    designBriefSubtitle: "مطلوبہ عنوان، نستعلیق خطاطی، تھیم اور رنگوں کا انتخاب کریں",
    targetAudience: "ہدف ناظرین و قارئین",
    primaryHeadline: "مرکزی عنوان / متن",
    subHeadlineText: "ذیلی عنوان / تفصیل (اختیاری)",
    callToAction: "رابطہ / پیشکش کی تفصیلات",
    brandColors: "برانڈ کے رنگ",
    customPalette: "پسندیدہ رنگ",
    primaryColor: "بنیادی رنگ",
    secondaryColor: "ثانوی چمکدار رنگ",
    visualStyle: "ڈیزائن کا انداز",
    assetReference: "لوگو یا نمونہ تصویر",
    dragOrUploadImage: "تصویر یا لوگو اپ لوڈ کریں",
    generateConcepts: "4 معیاری ڈیزائن تیار کریں",
    generating: "ڈیزائن پروسیس ہو رہا ہے...",
    generatingStep: "اردو نستعلیق خطاطی اور لے آؤٹ کی تشکیل",
    outputGallery: "تیار کردہ ڈیزائنز کی گیلری",
    openInEditor: "کینوس میں ترمیم کریں",
    regenerate: "دوبارہ بنائیں",
    exportNow: "ایکسپورٹ کریں",

    tools: "ڈیزائن ٹولز",
    addText: "متن شامل کریں",
    addShape: "شکل شامل کریں",
    addImage: "تصویر شامل کریں",
    setBackground: "پس منظر کا رنگ",
    layers: "پرتیں (لیئرز)",
    properties: "پرت کی خصوصیات",
    bringForward: "آگے لائیں",
    sendBackward: "پیچھے بھیجیں",
    duplicateLayer: "نقل بنائیں",
    deleteLayer: "حذف کریں",
    lockLayer: "لاک کریں",
    unlockLayer: "ان لاک کریں",
    hideLayer: "چھپائیں",
    showLayer: "دکھائیں",
    renameLayer: "نام تبدیل کریں",
    opacity: "شفافیت (اوپیسٹی)",
    fontSize: "فونٹ سائز",
    fontFamily: "فونٹ اسٹائل",
    textAlign: "سیدھ (الائنمنٹ)",
    textColor: "متن کا رنگ",
    stroke: "بارڈر / آؤٹ لائن",
    shadow: "سایہ (شیڈو)",
    zoom: "زوم",
    undo: "واپس (Ctrl+Z)",
    redo: "دوبارہ (Ctrl+Y)",
    canvasDimensions: "کینوس کا سائز",
    saveProject: "پروجیکٹ محفوظ کریں",
    savedSuccessfully: "پروجیکٹ کامیابی سے محفوظ ہو گیا ہے",

    genuinePsd: "فوٹوشاپ لیئرڈ پی ایس ڈی (PSD)",
    psdDisclosure: "اصلی فوٹوشاپ فائل الگ الگ لیئرز اور شفافیت کے ساتھ۔",
    pngLossless: "شفاف پی این جی (PNG)",
    jpgOptimized: "ہائی ریزولیوشن جے پی جی (JPG)",
    svgVector: "ویکٹر گرافک ایس وی جی (SVG)",
    pdfPrint: "پرنٹ ریڈی پی ڈی ایف (PDF)",
    zipBundle: "مکمل کلائنٹ ڈیلیوری زپ (ZIP)",
    downloading: "فائل تیار ہو رہی ہے...",
    exportSuccess: "فائل کامیابی سے ڈاؤن لوڈ ہو گئی!",
    bleedOption: "3 ملی میٹر پرنٹ مارجن شامل کریں",
    scaleFactor: "ریزولیوشن اسکیل",
    clientDeliveryPackage: "مکمل ڈیلیوری پیکیج",
    manifestInfo: "پی ایس ڈی، پی این جی، ایس وی جی، پی ڈی ایف اور فونٹ لائسنس شامل ہیں۔",

    glyphCheckPassed: "اردو نستعلیق رسم الخط کی تصدیق مکمل ہے",
    glyphWarning: "نوٹ: متن کی درست ادائیگی کے لیے اردو نستعلیق فونٹ منتخب ہے۔",

    socialMedia: "سوشل میڈیا پوسٹس",
    youtubeThumbnails: "یوٹیوب تھمب نیلز",
    marketingAds: "مارکیٹنگ اور تشہیری بینرز",
    postersFlyers: "پوسٹرز اور فلائیرز",
    businessCards: "وزٹنگ کارڈز اور اسٹیشنری",
    logosBrand: "لوگو اور برانڈ شناختی نشانات",
    menusCatalogues: "ریستوران مینو اور کیٹلاگ",
    certificatesInvites: "شادی کارڈز اور اسناد",
    bookCovers: "کتابوں کے سرورق اور میگزین",
    bannersSigns: "فلیکس بینرز اور شاپ بورڈز",
    productMockups: "پروڈکٹ ماک اپس"
  },

  sd: {
    appTitle: "اي آءِ انجڻ گرافڪ اسٽوڊيو",
    appSubtitle: "سنڌي، اردو ۽ انگريزي لاءِ جديد پروفيشنل گرافڪ ڊيزائن پليٽ فارم",
    studioName: "اسٽوڊيو پرو",
    newProject: "نئون پروجيڪٽ",
    savedProjects: "پروجيڪٽس ۽ ڪلائنٽ ڊليوري",
    aiGenerator: "اي آءِ ڊيزائن اسٽوڊيو",
    canvasEditor: "پروفيشنل ڪينوس ايڊيٽر",
    exportDeliverable: "فائل ايڪسپورٽ",
    masterExport: "ايڪسپورٽ فائل",
    language: "ٻولي",
    direction: "rtl",

    tabCreate: "اي آءِ اسٽوڊيو",
    tabEditor: "ڪينوس ايڊيٽر",
    tabProjects: "ڪلائنٽ ڊليوري",
    tabDeliverables: "ايڪسپورٽ",

    designBriefTitle: "ڊيزائن جو مڪمل تفصيل ۽ خاڪو",
    designBriefSubtitle: "سنڌي نسخ خطاطي، ثقافتي رنگ ۽ مخصوص موضوع چونڊيو",
    targetAudience: "مخصوص ناظرين ۽ پڙهندڙ",
    primaryHeadline: "مکيه عنوان / متن",
    subHeadlineText: "ٻيو عنوان / تفصيل (اختياري)",
    callToAction: "رابطو / تفصيل",
    brandColors: "برانڊ جا رنگ",
    customPalette: "پسنديده رنگ",
    primaryColor: "مکيه رنگ",
    secondaryColor: "ثانوي چمڪندڙ رنگ",
    visualStyle: "ڊيزائن جو انداز",
    assetReference: "لوگو يا تصوير",
    dragOrUploadImage: "تصوير يا لوگو اپلوڊ ڪريو",
    generateConcepts: "4 بهترين ڊيزائن تيار ڪريو",
    generating: "ڊيزائن ٺهي رهي آهي...",
    generatingStep: "سنڌي خطاطي، اجرڪ ۽ جوميٽرڪ نمونن جي تياري",
    outputGallery: "تيار ڪيل ڊيزائنن جي گيلري",
    openInEditor: "ڪينوس ۾ تبديلي ڪريو",
    regenerate: "ٻيهر ٺاهيو",
    exportNow: "ايڪسپورٽ ڪريو",

    tools: "ڊيزائن ٽولز",
    addText: "اکر لکو (متن)",
    addShape: "شڪل ٺاهيو",
    addImage: "تصوير رکو",
    setBackground: "پس منظر جو رنگ",
    layers: "ليئرس پينل",
    properties: "ليئر جون خاصيتون",
    bringForward: "اڳيان آڻيو",
    sendBackward: "پوئتي موڪليو",
    duplicateLayer: "نقل ٺاهيو",
    deleteLayer: "ختم ڪريو",
    lockLayer: "لاڪ ڪريو",
    unlockLayer: "ان لاڪ ڪريو",
    hideLayer: "لڪايو",
    showLayer: "ڏيکاريو",
    renameLayer: "نالو تبديل ڪريو",
    opacity: "شفافيت (اوپيسٽي)",
    fontSize: "اکرن جي سائيز",
    fontFamily: "فونٽ اسٽائيل",
    textAlign: "سڌائي (الائنمينٽ)",
    textColor: "اکرن جو رنگ",
    stroke: "ڪناري (بارڊر)",
    shadow: "پاڇو (شيڊو)",
    zoom: "زوم",
    undo: "واپس (Ctrl+Z)",
    redo: "اڳتي (Ctrl+Y)",
    canvasDimensions: "ڪينوس سائيز",
    saveProject: "پروجيڪٽ محفوظ ڪريو",
    savedSuccessfully: "پروجيڪٽ ڪاميابي سان محفوظ ٿي ويو",

    genuinePsd: "فوٽوشاپ ليئرڊ پي ايس ڊي (PSD)",
    psdDisclosure: "اصل فوٽوشاپ فائل مڪمل ليئرس ۽ شفافيت سان گڏ۔",
    pngLossless: "صاف پي اين جي (PNG)",
    jpgOptimized: "هاءِ ڪوالٽي جے پي جي (JPG)",
    svgVector: "ويڪٽر ايس وي جي (SVG)",
    pdfPrint: "پرنٽ ريڊي پي ڊي ايف (PDF)",
    zipBundle: "مڪمل ڪلائنٽ ڊليوري زپ (ZIP)",
    downloading: "فائل تيار ٿي رهي آهي...",
    exportSuccess: "فائل ڪاميابي سان ڊائونلوڊ ٿي وئي!",
    bleedOption: "3 ملي ميٽر پرنٽ مارجن شامل ڪريو",
    scaleFactor: "ريزوليوشن اسڪيل",
    clientDeliveryPackage: "مڪمل ڊليوري پيڪيج",
    manifestInfo: "پي ايس ڊي، پي اين جي، ايس وي جي، پي ڊي ايف ۽ فونٽ لائسنس شامل آهن۔",

    glyphCheckPassed: "سنڌي اکرن ۽ اعرابن جي درستگي جي تصديق ٿيل آهي",
    glyphWarning: "نوٽ: سنڌي اکرن (ڳ، ڄ، ڊ، ڻ وغيره) لاءِ سنڌي نسخ فونٽ فعال آهي۔",

    socialMedia: "سوشل ميڊيا پوسٽون",
    youtubeThumbnails: "يوٽيوب ٿمب نيلز",
    marketingAds: "مارڪيٽنگ ۽ اشتهاري بئنر",
    postersFlyers: "پوسٽر ۽ فلائرس",
    businessCards: "بزنس ڪارڊ ۽ ليٽر هيڊ",
    logosBrand: "لوگو ۽ ثقافتي سڃاڻپ",
    menusCatalogues: "ريستوران مينيو ۽ فهرست",
    certificatesInvites: "شادي ڪارڊ ۽ سرٽيفڪيٽ",
    bookCovers: "ڪتابن جا سرورق ۽ رسالا",
    bannersSigns: "فلڪس بئنر ۽ دڪان جا بورڊ",
    productMockups: "پراڊڪٽ ماڪ اپ"
  }
};
