/**
 * Bilingual Utilities for Design & More
 * Supports Arabic (ar) and English (en) dynamic translations and formatting.
 */

export const t = (obj, field, lang = 'en') => {
  if (!obj) return '';
  const suffix = lang === 'ar' ? 'Ar' : 'En';
  return obj[`${field}${suffix}`] || obj[`${field}En`] || obj[field] || '';
};

export const formatEGP = (amount, lang = 'en') => {
  if (amount === undefined || amount === null) return '';
  const num = Number(amount);
  if (isNaN(num)) return amount;

  if (lang === 'ar') {
    return `${num.toLocaleString('ar-EG')} ج.م`;
  }
  return `${num.toLocaleString('en-US')} EGP`;
};

export const ui = {
  en: {
    // Navigation
    home: 'Home',
    shop: 'Collections',
    customOrder: 'Custom Order',
    about: 'About Us',
    contact: 'Contact',
    cart: 'Cart',
    account: 'Account',
    login: 'Sign In',
    register: 'Create Account',
    logout: 'Sign Out',
    search: 'Search sheet metal decor, laser panels, clocks...',
    searchPlaceholder: 'Search by keyword (e.g. Gear Clock, Laser Screen, Metal Wall Art)...',
    hotline: 'Hotline',
    whatsAppConcierge: 'WhatsApp Concierge',

    // Hero & Common CTAs
    exploreCollection: 'Explore Collections',
    requestCustom: 'Request Custom Order',
    viewDetails: 'View Metal Decor Piece',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to Cart',
    inStock: 'In Stock — Ready for Dispatch',
    backorder: 'Custom Order (2-3 Weeks Fabrication)',
    specifications: 'Metal & Technical Specifications',
    materials: 'Curated Sheet Metals',
    dimensions: 'Dimensions & Joinery',
    weight: 'Weight',
    finish: 'Surface Finish',
    customerReviews: 'Client Reviews',
    writeReview: 'Write a Review',
    submitReview: 'Submit Review',
    allCategories: 'All Metal Collections',

    // Cart & Checkout
    shoppingBag: 'Shopping Bag',
    cartEmpty: 'Your collection bag is currently empty.',
    cartEmptyDesc: 'Discover our precision sheet metal decor and mechanical craftsmanship.',
    continueShopping: 'Explore Catalog',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    proceedToCheckout: 'Proceed to Secure Checkout',
    checkoutTitle: 'Metal Decor Order Checkout',
    recipientDetails: 'Client Information',
    fullName: 'Full Name',
    phoneNumber: 'Egyptian Mobile (01x)',
    whatsAppNumber: 'WhatsApp Number',
    governorate: 'Delivery Governorate',
    selectGovernorate: 'Select Egyptian Governorate',
    city: 'City / District',
    address: 'Street Address & Villa / Building No.',
    customerNotes: 'Delivery & Access Notes (Gate code, elevator, etc.)',
    paymentMethod: 'Payment Settlement',
    cod: 'Cash on Delivery (COD) / Bank Transfer upon delivery',
    codNotice: 'Inspected upon arrival by our logistics team.',
    placeOrder: 'Confirm & Place Order',
    placingOrder: 'Processing Commission...',
    orderSuccess: 'Order Confirmed',
    orderNumber: 'Order Reference',
    thankYou: 'Thank you for your acquisition.',
    orderNotice: 'Our team has received your order and will contact you via WhatsApp for delivery scheduling.',
    chatWhatsAppOrder: 'Coordinate via WhatsApp',

    // Custom Order Studio
    customStudioTitle: 'Custom Sheet Metal Decor & Laser Fabrication & More',
    customStudioSubtitle: 'Custom laser-cut screens, sheet metal wall art, mechanical gear clocks, and tailored metal fabrication & more.',
    projectType: 'Project Typology',
    projectTypeResidential: 'Private Residence / Luxury Villa',
    projectTypeCommercial: 'Hospitality / Commercial Space',
    projectTypeArchitect: 'Architectural / Design Studio Spec',
    materialPreference: 'Primary Materiality',
    specificationsDesc: 'Detailed Specifications, Dimensions & Scope',
    uploadDrawings: 'Upload CAD Drawings / Reference Sketches (Max 5MB)',
    submitCustomOrder: 'Submit Custom Order Enquiry',
    customSubmitted: 'Custom Order Received',
    customSubmittedMsg: 'Our engineering team is reviewing your technical requirements and will respond within 24 hours.',

    // About & Contact
    brandStoryTitle: 'The Tectonic Soul of Design & More',
    showrooms: 'Ateliers & Showrooms',
    workingHours: 'Visiting Hours',
    getDirections: 'Open in Google Maps',
    sendMessage: 'Send Message',
    subject: 'Subject',
    message: 'Your Message',
    sendSuccess: 'Message dispatched. Our client concierge will be in touch shortly.',
    
    // Account
    myOrders: 'Order History',
    myCustomOrders: 'Custom Orders',
    profileDetails: 'Client Profile',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    updatePassword: 'Update Password',
    orderDate: 'Date',
    status: 'Status',
    items: 'Items',
  },

  ar: {
    // Navigation
    home: 'الرئيسية',
    shop: 'المجموعات المعمارية',
    customOrder: 'طلب مخصص',
    about: 'عن الاستوديو',
    contact: 'تواصل معنا',
    cart: 'حقيبة التسوق',
    account: 'حسابي',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب جديد',
    logout: 'تسجيل الخروج',
    search: 'ابحث عن ديكورات صاج، قواطع ليزر، ساعات تروس...',
    searchPlaceholder: 'ابحث بكلمة مفتاحية (مثل: ساعة تروس، قاطع ليزر، ديكور معدني)...',
    hotline: 'الخط الساخن',
    whatsAppConcierge: 'خدمة العملاء عبر واتساب',

    // Hero & Common CTAs
    exploreCollection: 'استكشف المجموعات',
    requestCustom: 'طلب تصنيع صاج مخصص',
    viewDetails: 'عرض تفاصيل القطعة',
    addToCart: 'إضافة إلى الحقيبة',
    addedToCart: 'تمت الإضافة بنجاح',
    inStock: 'متوفر — جاهز للشحن الفوري',
    backorder: 'تصنيع مخصص (تنفيذ خلال ٢-٣ أسابيع)',
    specifications: 'المواصفات الفنية والمعدنية',
    materials: 'خامات الصاج والمعادن',
    dimensions: 'الأبعاد والتشطيب',
    weight: 'الوزن التقريبي',
    finish: 'نوع الطلاء والتشطيب',
    customerReviews: 'تقييمات العملاء والمهندسين',
    writeReview: 'أضف تقييمك',
    submitReview: 'إرسال التقييم',
    allCategories: 'جميع مجموعات المعادن والصاج',

    // Cart & Checkout
    shoppingBag: 'حقيبة المقتنيات',
    cartEmpty: 'حقيبة المقتنيات فارغة حالياً.',
    cartEmptyDesc: 'استكشف روائع ديكورات الصاج المقصوص بالليزر والتشكيلات الميكانيكية الراقية.',
    continueShopping: 'تصفح الكتالوج',
    subtotal: 'المجموع الفرعي',
    deliveryFee: 'رسوم الشحن والتوصيل',
    total: 'الإجمالي النهائي',
    proceedToCheckout: 'متابعة الدفع وتأكيد الطلب',
    checkoutTitle: 'إتمام الطلب وتحديد عنوان التوصيل',
    recipientDetails: 'بيانات العميل والتوصيل',
    fullName: 'الاسم بالكامل',
    phoneNumber: 'رقم الهاتف المصري (01x)',
    whatsAppNumber: 'رقم الواتساب للتنسيق',
    governorate: 'المحافظة',
    selectGovernorate: 'اختر المحافظة للتوصيل',
    city: 'المدينة / المنطقة',
    address: 'العنوان بالتفصيل (اسم الشارع، رقم الفيلا أو العمارة)',
    customerNotes: 'ملاحظات التوصيل (كود البوابة، تفاصيل المصعد، إلخ)',
    paymentMethod: 'طريقة السداد',
    cod: 'الدفع نقداً عند الاستلام أو التحويل البنكي',
    codNotice: 'معاينة القطع عند الوصول بمرافقة فريق التوصيل المتخصص لدينا.',
    placeOrder: 'تأكيد وإرسال الطلب',
    placingOrder: 'جاري تسجيل الطلب...',
    orderSuccess: 'تم تأكيد طلبك بنجاح',
    orderNumber: 'رقم المرجع للطلب',
    thankYou: 'شكراً لاختياركم ديزاين آند مور.',
    orderNotice: 'تلقى فريق العمل طلبك وسيتواصل معك مستشار التوصيل عبر واتساب لتحديد موعد التسليم.',
    chatWhatsAppOrder: 'متابعة تفاصيل الطلب عبر واتساب',

    // Custom Order Studio
    customStudioTitle: 'تصنيع ديكورات الصاج والقص بالليزر حسب الطلب وأكثر',
    customStudioSubtitle: 'أعمال الصاج المقصوص بالليزر، القواطع الجدارية، ساعات التروس، والتشكيلات المعدنية المخصصة وأكثر.',
    projectType: 'نوع المشروع',
    projectTypeResidential: 'فيلا خاصة / شقة سكنية فاخرة',
    projectTypeCommercial: 'مشروع فندقي / تجاري',
    projectTypeArchitect: 'استوديو هندسي / مكتب تصميم داخلي',
    materialPreference: 'الخامة الأساسية المفضلة',
    specificationsDesc: 'المواصفات المطلوبة، الأبعاد، وتفاصيل المشروع',
    uploadDrawings: 'رفع المخططات الهندسية أو الصور المرجعية (أقصى حد 5 ميجابايت)',
    submitCustomOrder: 'إرسال طلب التصميم المخصص',
    customSubmitted: 'تم استلام طلبك بنجاح',
    customSubmittedMsg: 'يقوم مهندسو التصميم بدراسة المتطلبات الفنية وسيتم الرد عليكم خلال ٢٤ ساعة.',

    // About & Contact
    brandStoryTitle: 'فلسفة تشكيل الصاج والمعادن في ديزاين آند مور',
    showrooms: 'معارضنا ومراكز التصنيع',
    workingHours: 'ساعات العمل والزيارة',
    getDirections: 'الاتجاهات عبر خرائط جوجل',
    sendMessage: 'إرسال رسالة',
    subject: 'موضوع الاستفسار',
    message: 'تفاصيل الرسالة',
    sendSuccess: 'تم إرسال رسالتكم بنجاح. سيتواصل معكم فريق خدمة العملاء قريباً.',
    
    // Account
    myOrders: 'سجل الطلبات',
    myCustomOrders: 'الطلبات المخصصة',
    profileDetails: 'بيانات العميل',
    changePassword: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    updatePassword: 'تحديث كلمة المرور',
    orderDate: 'التاريخ',
    status: 'الحالة',
    items: 'القطع',
  },
};
