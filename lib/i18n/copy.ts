export type Language = 'EN' | 'BM'

export interface CopyStructure {
  nav: {
    products: string
    applications: string
    about: string
    contact: string
    login: string
    register: string
    myAccount: string
    logout: string
    adminOrders: string
    adminAnalytics: string
    cart: string
    whyCoolman: string
    resources: string
    signIn: string
    signOut: string
    createAccount: string
    diamondTools: string
    shibuyaCoreDrills: string
    account: string
    switchToBM: string
    switchToEN: string
  }
  cart: {
    title: string
    empty: string
    removeLine: string
    lineTotal: string
    checkout: string
    added: string
  }
  hero: {
    headline: string
    subheadline: string
    cta: string
  }
  home: {
    solutionsEyebrow: string
    solutionsTitleLine1: string
    solutionsTitleLine2: string
    materialCuttingSuffix: string
    materialDescription: string
    bullets: {
      segmentSpacing: string
      bondHardness: string
      precisionBalanced: string
      extendedLife: string
    }
    viewBladesPrefix: string
    viewBladesSuffix: string
    whyEyebrow: string
    whyTitle: string
    productsEyebrow: string
    productsTitle: string
    viewAllProducts: string
    scroll: string
    placeholderProducts: {
      graniteName: string
      graniteDesc: string
      concreteName: string
      concreteDesc: string
      tileName: string
      tileDesc: string
      priceFrom: string
    }
  }
  filters: {
    title: string
    material: string
    application: string
    machinePower: string
    clearAll: string
    showingResults: string
    noResults: string
  }
  pages: {
    applications: {
      heroEyebrow: string
      fallbackHeroTitle: string
      fallbackHeroSubtitle: string
      viewBladesPrefix: string
      viewBladesSuffix: string
      ctaTitle: string
      ctaMessage: string
      contactSupport: string
    }
    whyCoolman: {
      heroEyebrow: string
      ctaTitle: string
      ctaMessage: string
      ctaButton: string
    }
    resources: {
      heroEyebrow: string
      fallbackHeroTitle: string
      fallbackHeroSubtitle: string
      emptyTitle: string
      emptyMessage: string
      emptyButton: string
      playVideo: string
      openPdf: string
      faqEyebrow: string
      faqHeading: string
      ctaTitle: string
      ctaMessage: string
      ctaButton: string
    }
    contact: {
      heroEyebrow: string
      fallbackHeroSubtitle: string
      formTitle: string
      formSubtitle: string
      formNameLabel: string
      formNamePlaceholder: string
      formCompanyLabel: string
      formCompanyPlaceholder: string
      formEmailLabel: string
      formEmailPlaceholder: string
      formPhoneLabel: string
      formPhonePlaceholder: string
      formMessageLabel: string
      formMessagePlaceholder: string
      formSubmit: string
      formSubmitting: string
      formSuccess: string
      formError: string
      networkError: string
      successTitle: string
      successMessage: string
      sendAnother: string
      infoHeading: string
      phoneTitle: string
      phoneSubtitle: string
      emailTitle: string
      emailSubtitle: string
      officeTitle: string
      responseTimeLabel: string
      responseTimeSubtitle: string
      liveChatLabel: string
      liveChatMessage: string
      openWhatsapp: string
    }
    shibuya: {
      heroEyebrow: string
      heroPrimaryLabel: string
      heroSecondaryLabel: string
      scroll: string
      sincePrefix: string
      modelsEyebrow: string
      modelsHeadline: string
      modelNamePrefix: string
      motorPowerLabel: string
      maxDiameterLabel: string
      weightLabel: string
      rpmRangeLabel: string
      keyFeaturesLabel: string
      startingFromLabel: string
      requestQuote: string
      inActionEyebrow: string
      inActionCtaLabel: string
      supportEyebrow: string
      ctaTitle: string
      ctaMessage: string
      ctaButton: string
    }
  }
  products: {
    heroEyebrow: string
    heroHeadlineLine1: string
    heroHeadlineLine2: string
    heroSubheadline: string
    statProducts: string
    statCategories: string
    statMaterials: string
    allProducts: string
    materialColon: string
    filtersHeader: string
    productSingular: string
    productPlural: string
    clear: string
    category: string
    all: string
    showFilters: string
    sidebar: {
      applicationHeading: string
      moreMaterialsHeading: string
      needHelpTitle: string
      needHelpDesc: string
      requestQuote: string
    }
    card: {
      openProduct: string
      noImage: string
      universal: string
      standardBond: string
      bondSuffix: string
    }
    pagination: {
      previous: string
      next: string
    }
    empty: {
      title: string
      message: string
      clearButton: string
    }
    bottomCta: {
      title: string
      message: string
      contactEngineering: string
      downloadCatalog: string
    }
    accountPending: {
      title: string
      message: string
    }
  }
  materials: {
    granite: string
    concrete: string
    tile: string
    brick: string
    marble: string
    homogeneousTile: string
    sandstone: string
    asphalt: string
  }
  applications: {
    floorCutting: string
    wallCutting: string
    coring: string
    grinding: string
  }
  machinePower: {
    low: string
    medium: string
    high: string
  }
  cta: {
    createAccount: string
    openAccount: string
    openProduct: string
    requestQuote: string
    seeApplications: string
    explore: string
  }
  product: {
    viewDetails: string
    addToOrder: string
    specifications: string
    diameter: string
    arborSize: string
    segmentHeight: string
    bondType: string
    recommendedMaterial: string
    recommendedMachine: string
    recommendedVolume: string
    relatedProducts: string
    suitedFor: string
    videoDemo: string
    priceList: string
    priceContract: string
    priceYourTier: string
    priceLogInForContract: string
    priceYouSave: string
    loginToOrder: string
    addToCart: string
  }
  order: {
    title: string
    selectedProduct: string
    quantity: string
    deliveryAddress: string
    notes: string
    notesPlaceholder: string
    pricing: string
    listPrice: string
    tierDiscount: string
    promoCode: string
    promoCodePlaceholder: string
    applyPromo: string
    promoApplied: string
    invalidPromo: string
    total: string
    submit: string
    submitting: string
    success: string
    successMessage: string
    loginRequired: string
    loginToOrder: string
  }
  account: {
    title: string
    myOrders: string
    orderHistory: string
    noOrders: string
    noOrdersMessage: string
    browseProducts: string
    orderId: string
    product: string
    quantity: string
    total: string
    status: string
    date: string
    viewDetails: string
    deliveryAddress: string
    saveAddress: string
    addressSaved: string
    addresses: {
      title: string
      addNew: string
      label: string
      labelPlaceholder: string
      addressPlaceholder: string
      defaultBadge: string
      setDefault: string
      edit: string
      delete: string
      save: string
      cancel: string
      atCap: string
      none: string
      confirmDelete: string
    }
  }
  status: {
    pending: string
    acknowledged: string
    fulfilled: string
    cancelled: string
  }
  admin: {
    orders: {
      title: string
      totalOrders: string
      pendingOrders: string
      avgResponseTime: string
      fulfilledToday: string
      searchPlaceholder: string
      filterByStatus: string
      allStatuses: string
      contractor: string
      product: string
      quantity: string
      total: string
      status: string
      responseTime: string
      actions: string
      acknowledge: string
      fulfil: string
      cancel: string
      noOrders: string
      urgentAlert: string
    }
    analytics: {
      title: string
      dateRange: string
      last7Days: string
      last30Days: string
      last90Days: string
      topMaterials: string
      topApplications: string
      viewsVsOrders: string
      views: string
      orders: string
      contractorActivity: string
      contractor: string
      company: string
      lastOrder: string
      totalOrders: string
      status: string
      export: string
    }
  }
  auth: {
    login: string
    register: string
    email: string
    password: string
    confirmPassword: string
    companyName: string
    phone: string
    address: string
    loginButton: string
    registerButton: string
    noAccount: string
    hasAccount: string
    forgotPassword: string
  }
  common: {
    loading: string
    error: string
    retry: string
    back: string
    save: string
    cancel: string
    confirm: string
    search: string
    currency: string
  }
  footer: {
    tagline: string
    quickLinks: string
    contact: string
    email: string
    phone: string
    address: string
    copyright: string
    brandStory: string
    diamondToolsHeading: string
    shibuyaHeading: string
    companyHeading: string
    openAccountHeading: string
    becomePartner: string
    joinBlurb: string
    privacyPolicy: string
    termsOfService: string
    bottomCopyright: string
    links: {
      allDiamondTools: string
      diamondBlades: string
      diamondCoreBits: string
      polishingPads: string
      shibuyaCoreDrills: string
      tsHandheld: string
      tsIndustrial: string
      spareParts: string
      whyCoolman: string
      applications: string
      resources: string
      contact: string
    }
  }
}

export const COPY: Record<Language, CopyStructure> = {
  EN: {
    nav: {
      products: 'Products',
      applications: 'Applications',
      about: 'About',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      myAccount: 'My Account',
      logout: 'Logout',
      adminOrders: 'Orders',
      adminAnalytics: 'Analytics',
      cart: 'Cart',
      whyCoolman: 'Why Coolman',
      resources: 'Resources',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      createAccount: 'Create account',
      diamondTools: 'Diamond Tools',
      shibuyaCoreDrills: 'Shibuya Core Drills',
      account: 'Account',
      switchToBM: 'Switch to Bahasa Malaysia',
      switchToEN: 'Switch to English',
    },
    cart: {
      title: 'Your Cart',
      empty: 'Your cart is empty.',
      removeLine: 'Remove',
      lineTotal: 'Line total',
      checkout: 'Submit Order',
      added: 'Added',
    },
    hero: {
      headline: 'The Right Blade for Every Cut',
      subheadline: 'Premium diamond cutting tools engineered for Malaysian contractors. Quality you can trust.',
      cta: 'Browse Products',
    },
    home: {
      solutionsEyebrow: 'Solutions',
      solutionsTitleLine1: 'Cutting Solutions for',
      solutionsTitleLine2: 'Every Material',
      materialCuttingSuffix: 'Cutting',
      materialDescription: 'Our {material} cutting blades feature specialised diamond segment configuration and bond formulations engineered for maximum efficiency and extended operational life.',
      bullets: {
        segmentSpacing: 'Optimised segment spacing for material',
        bondHardness: 'Application-specific bond hardness',
        precisionBalanced: 'Precision balanced for smooth cuts',
        extendedLife: 'Extended 3× operational life',
      },
      viewBladesPrefix: 'View',
      viewBladesSuffix: 'Blades',
      whyEyebrow: 'Why Coolman',
      whyTitle: 'The Coolman Advantage',
      productsEyebrow: 'Our Products',
      productsTitle: 'Diamond Blades',
      viewAllProducts: 'View All Products',
      scroll: 'Scroll',
      placeholderProducts: {
        graniteName: 'Granite Blade',
        graniteDesc: 'For natural stone cutting',
        concreteName: 'Concrete Blade',
        concreteDesc: 'Heavy-duty construction',
        tileName: 'Tile Blade',
        tileDesc: 'Precision ceramic cutting',
        priceFrom: 'From RM',
      },
    },
    filters: {
      title: 'Filter Products',
      material: 'Material',
      application: 'Application',
      machinePower: 'Machine Power',
      clearAll: 'Clear All',
      showingResults: 'Showing {count} products',
      noResults: 'No products match your filters',
    },
    pages: {
      applications: {
        heroEyebrow: 'Applications',
        fallbackHeroTitle: 'Solutions for Every Material',
        fallbackHeroSubtitle: 'Our comprehensive range of diamond cutting tools is engineered to deliver optimal performance across all common construction materials.',
        viewBladesPrefix: 'View',
        viewBladesSuffix: 'Blades',
        ctaTitle: 'Need Help Selecting the Right Blade?',
        ctaMessage: 'Our technical team can help you choose the optimal blade for your specific application and cutting conditions.',
        contactSupport: 'Contact Technical Support',
      },
      whyCoolman: {
        heroEyebrow: 'Why Coolman',
        ctaTitle: 'Ready to Experience the Coolman Difference?',
        ctaMessage: 'Join the contractors who trust Coolman for performance, reliability and support.',
        ctaButton: 'Get in Touch',
      },
      resources: {
        heroEyebrow: 'Resources',
        fallbackHeroTitle: 'Technical Resources & Downloads',
        fallbackHeroSubtitle: 'Access product catalogs, technical guides, and educational content to help you get the most from your diamond cutting tools.',
        emptyTitle: 'Catalogue arriving soon',
        emptyMessage: "We're finalising the latest PDFs and video guides. In the meantime, ask our team for the file you need.",
        emptyButton: 'Request a copy',
        playVideo: 'Play video',
        openPdf: 'Open PDF',
        faqEyebrow: 'FAQ',
        faqHeading: 'Frequently Asked Questions',
        ctaTitle: 'Need Technical Assistance?',
        ctaMessage: 'Our engineering team is ready to help with blade selection, technical questions, and application support.',
        ctaButton: 'Contact Technical Support',
      },
      contact: {
        heroEyebrow: 'Get in touch',
        fallbackHeroSubtitle: 'Have questions about our products or need a custom quote? Our team is ready to help you find the perfect solution.',
        formTitle: 'Send us a message',
        formSubtitle: "Fill out the form below and we'll respond within 24 hours.",
        formNameLabel: 'Name *',
        formNamePlaceholder: 'Your name',
        formCompanyLabel: 'Company',
        formCompanyPlaceholder: 'Company name',
        formEmailLabel: 'Email *',
        formEmailPlaceholder: 'name@company.com',
        formPhoneLabel: 'Phone',
        formPhonePlaceholder: '+60 12-345 6789',
        formMessageLabel: 'Message *',
        formMessagePlaceholder: 'Tell us about your requirements...',
        formSubmit: 'Send Message',
        formSubmitting: 'Sending...',
        formSuccess: 'Thanks — we will be in touch shortly.',
        formError: 'Something went wrong. Please try again.',
        networkError: 'Network error. Please check your connection and try again.',
        successTitle: 'Message Sent!',
        successMessage: "Thank you for reaching out. We'll get back to you within 24 hours.",
        sendAnother: 'Send another message',
        infoHeading: 'Get in touch',
        phoneTitle: 'Phone',
        phoneSubtitle: 'Mon-Fri 9am-6pm MYT',
        emailTitle: 'Email',
        emailSubtitle: 'We reply within 24 hours',
        officeTitle: 'Office',
        responseTimeLabel: 'Average Response Time',
        responseTimeSubtitle: 'During business hours',
        liveChatLabel: 'Prefer live chat?',
        liveChatMessage: 'Chat with our support team in real-time via WhatsApp.',
        openWhatsapp: 'Open WhatsApp',
      },
      shibuya: {
        heroEyebrow: 'Shibuya',
        heroPrimaryLabel: 'Explore Models',
        heroSecondaryLabel: 'Watch Film',
        scroll: 'SCROLL',
        sincePrefix: 'SINCE',
        modelsEyebrow: 'THE RANGE',
        modelsHeadline: 'Choose Your Machine',
        modelNamePrefix: 'Shibuya',
        motorPowerLabel: 'Motor Power',
        maxDiameterLabel: 'Max Diameter',
        weightLabel: 'Weight',
        rpmRangeLabel: 'RPM Range',
        keyFeaturesLabel: 'KEY FEATURES',
        startingFromLabel: 'Starting from',
        requestQuote: 'Request Quote',
        inActionEyebrow: 'IN THE FIELD',
        inActionCtaLabel: 'View Applications',
        supportEyebrow: 'SUPPORT',
        ctaTitle: 'Want a Shibuya Demo?',
        ctaMessage: 'Speak to our team for a live walkthrough and pricing.',
        ctaButton: 'Request a Demo',
      },
    },
    products: {
      heroEyebrow: 'Diamond Tools',
      heroHeadlineLine1: 'Industrial Diamond',
      heroHeadlineLine2: 'Cutting Tools',
      heroSubheadline: 'Industrial-grade blades engineered for precision cutting across granite, concrete, tile, and more. Built for professionals who demand performance.',
      statProducts: 'Products',
      statCategories: 'Categories',
      statMaterials: 'Materials',
      allProducts: 'All Products',
      materialColon: 'Material:',
      filtersHeader: 'Filters',
      productSingular: 'product',
      productPlural: 'products',
      clear: 'Clear',
      category: 'Category',
      all: 'All',
      showFilters: 'Show filters',
      sidebar: {
        applicationHeading: 'Application',
        moreMaterialsHeading: 'More Materials',
        needHelpTitle: 'Need Help?',
        needHelpDesc: 'Our engineers can help you select the right tool for your project.',
        requestQuote: 'Request a quote',
      },
      card: {
        openProduct: 'Open product',
        noImage: 'No image',
        universal: 'Universal',
        standardBond: 'Standard',
        bondSuffix: 'Bond',
      },
      pagination: {
        previous: 'Previous',
        next: 'Next',
      },
      empty: {
        title: 'No Products Found',
        message: 'Try adjusting your filters',
        clearButton: 'Clear Filters',
      },
      bottomCta: {
        title: "Can't Find What You Need?",
        message: 'We offer custom blade configurations for specialised applications. Contact our engineering team.',
        contactEngineering: 'Contact Engineering',
        downloadCatalog: 'Download Catalog',
      },
      accountPending: {
        title: 'Account pending verification',
        message: 'Once Coolman verifies your account, your contract pricing will show here.',
      },
    },
    materials: {
      granite: 'Granite',
      concrete: 'Concrete',
      tile: 'Tile',
      brick: 'Brick',
      marble: 'Marble',
      homogeneousTile: 'Homogeneous Tile',
      sandstone: 'Sandstone',
      asphalt: 'Asphalt',
    },
    applications: {
      floorCutting: 'Floor Cutting',
      wallCutting: 'Wall Cutting',
      coring: 'Coring',
      grinding: 'Grinding',
    },
    machinePower: {
      low: 'Low (< 2kW)',
      medium: 'Medium (2-4kW)',
      high: 'High (> 4kW)',
    },
    cta: {
      createAccount: 'Create account',
      openAccount: 'Open account',
      openProduct: 'Open product',
      requestQuote: 'Request a quote',
      seeApplications: 'See applications',
      explore: 'Explore',
    },
    product: {
      viewDetails: 'Open product',
      addToOrder: 'Add to Order Request',
      specifications: 'Specifications',
      diameter: 'Diameter',
      arborSize: 'Arbor Size',
      segmentHeight: 'Segment Height',
      bondType: 'Bond Type',
      recommendedMaterial: 'Recommended Material',
      recommendedMachine: 'Recommended Machine Power',
      recommendedVolume: 'Recommended Cutting Volume',
      relatedProducts: 'Related Products',
      suitedFor: 'Suited For',
      videoDemo: 'Video Demonstration',
      priceList: 'List Price',
      priceContract: 'Your Contract Price',
      priceYourTier: 'Your tier discount',
      priceLogInForContract: 'Log in to see your contract price',
      priceYouSave: 'You save',
      loginToOrder: 'Log in to place order',
      addToCart: 'Add to Cart',
    },
    order: {
      title: 'Order Request',
      selectedProduct: 'Selected Product',
      quantity: 'Quantity',
      deliveryAddress: 'Delivery Address',
      notes: 'Notes',
      notesPlaceholder: 'Any special instructions or requirements...',
      pricing: 'Pricing',
      listPrice: 'List Price',
      tierDiscount: 'Tier Discount',
      promoCode: 'Promo Code',
      promoCodePlaceholder: 'Enter code',
      applyPromo: 'Apply',
      promoApplied: 'Promo applied!',
      invalidPromo: 'Invalid promo code',
      total: 'Total',
      submit: 'Submit Order Request',
      submitting: 'Submitting...',
      success: 'Order Submitted!',
      successMessage: 'Your order request has been submitted. We will contact you shortly.',
      loginRequired: 'Login Required',
      loginToOrder: 'Please login to submit an order request.',
    },
    account: {
      title: 'My Account',
      myOrders: 'My Orders',
      orderHistory: 'Order History',
      noOrders: 'No Orders Yet',
      noOrdersMessage: 'You haven\'t placed any orders yet. Browse our products to get started.',
      browseProducts: 'Browse Products',
      orderId: 'Order ID',
      product: 'Product',
      quantity: 'Qty',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      viewDetails: 'View',
      deliveryAddress: 'Delivery Address',
      saveAddress: 'Save address',
      addressSaved: 'Saved.',
      addresses: {
        title: 'Saved Addresses',
        addNew: 'Add new address',
        label: 'Label',
        labelPlaceholder: 'e.g. Main warehouse',
        addressPlaceholder: 'Full delivery address (max 500 chars)',
        defaultBadge: 'Default',
        setDefault: 'Set as default',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        atCap: 'You can save up to 5 addresses. Delete one before adding another.',
        none: 'No saved addresses yet. Add one to place an order.',
        confirmDelete: 'Delete this address?',
      },
    },
    status: {
      pending: 'Pending',
      acknowledged: 'Acknowledged',
      fulfilled: 'Fulfilled',
      cancelled: 'Cancelled',
    },
    admin: {
      orders: {
        title: 'Orders Dashboard',
        totalOrders: 'Total Orders',
        pendingOrders: 'Pending',
        avgResponseTime: 'Avg Response Time',
        fulfilledToday: 'Fulfilled Today',
        searchPlaceholder: 'Search orders...',
        filterByStatus: 'Filter by Status',
        allStatuses: 'All Statuses',
        contractor: 'Contractor',
        product: 'Product',
        quantity: 'Qty',
        total: 'Total',
        status: 'Status',
        responseTime: 'Response Time',
        actions: 'Actions',
        acknowledge: 'Acknowledge',
        fulfil: 'Fulfil',
        cancel: 'Cancel',
        noOrders: 'No orders found',
        urgentAlert: 'Urgent: Response time exceeds 24 hours',
      },
      analytics: {
        title: 'Analytics Dashboard',
        dateRange: 'Date Range',
        last7Days: 'Last 7 Days',
        last30Days: 'Last 30 Days',
        last90Days: 'Last 90 Days',
        topMaterials: 'Top Materials Searched',
        topApplications: 'Top Applications Searched',
        viewsVsOrders: 'Product Views vs Orders',
        views: 'Views',
        orders: 'Orders',
        contractorActivity: 'Contractor Activity',
        contractor: 'Contractor',
        company: 'Company',
        lastOrder: 'Last Order',
        totalOrders: 'Total Orders',
        status: 'Status',
        export: 'Export',
      },
    },
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      companyName: 'Company Name',
      phone: 'Phone Number',
      address: 'Delivery Address',
      loginButton: 'Sign In',
      registerButton: 'Create Account',
      noAccount: 'Don\'t have an account?',
      hasAccount: 'Already have an account?',
      forgotPassword: 'Forgot password?',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      search: 'Search',
      currency: 'RM',
    },
    footer: {
      tagline: 'Premium diamond tools for professionals',
      quickLinks: 'Quick Links',
      contact: 'Contact Us',
      email: 'sales@coolman.com.my',
      phone: '+60 3-1234 5678',
      address: 'Kuala Lumpur, Malaysia',
      copyright: '© 2024 Coolman. All rights reserved.',
      brandStory: 'Industrial-grade diamond cutting tools engineered for precision and durability. Trusted by professional contractors across Malaysia since 1998.',
      diamondToolsHeading: 'Diamond Tools',
      shibuyaHeading: 'Shibuya',
      companyHeading: 'Company',
      openAccountHeading: 'Open an account',
      becomePartner: 'Become a Partner',
      joinBlurb: 'Join 500+ contractors and access exclusive B2B pricing.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      bottomCopyright: 'Coolman Sdn Bhd. All rights reserved.',
      links: {
        allDiamondTools: 'All Diamond Tools',
        diamondBlades: 'Diamond Blades',
        diamondCoreBits: 'Diamond Core Bits',
        polishingPads: 'Polishing Pads',
        shibuyaCoreDrills: 'Shibuya Core Drills',
        tsHandheld: 'TS-132 Handheld',
        tsIndustrial: 'TS-252 Industrial',
        spareParts: 'Spare Parts',
        whyCoolman: 'Why Coolman',
        applications: 'Applications',
        resources: 'Resources',
        contact: 'Contact',
      },
    },
  },
  BM: {
    nav: {
      products: 'Produk',
      applications: 'Aplikasi',
      about: 'Tentang Kami',
      contact: 'Hubungi',
      login: 'Log Masuk',
      register: 'Daftar',
      myAccount: 'Akaun Saya',
      logout: 'Log Keluar',
      adminOrders: 'Pesanan',
      adminAnalytics: 'Analitik',
      cart: 'Troli',
      whyCoolman: 'Kenapa Coolman',
      resources: 'Sumber',
      signIn: 'Log Masuk',
      signOut: 'Log Keluar',
      createAccount: 'Buka akaun',
      diamondTools: 'Alat Berlian',
      shibuyaCoreDrills: 'Penggerudi Teras Shibuya',
      account: 'Akaun',
      switchToBM: 'Tukar ke Bahasa Malaysia',
      switchToEN: 'Tukar ke Bahasa Inggeris',
    },
    cart: {
      title: 'Troli Anda',
      empty: 'Troli anda kosong.',
      removeLine: 'Buang',
      lineTotal: 'Jumlah baris',
      checkout: 'Hantar Pesanan',
      added: 'Ditambah',
    },
    hero: {
      headline: 'Bilah Tepat untuk Setiap Potongan',
      subheadline: 'Alat pemotong berlian premium direka untuk kontraktor Malaysia. Kualiti yang boleh dipercayai.',
      cta: 'Lihat Produk',
    },
    home: {
      solutionsEyebrow: 'Penyelesaian',
      solutionsTitleLine1: 'Penyelesaian Pemotongan untuk',
      solutionsTitleLine2: 'Setiap Bahan',
      materialCuttingSuffix: 'Pemotongan',
      materialDescription: 'Bilah pemotong {material} kami menampilkan konfigurasi segmen berlian khusus dan formulasi ikatan yang direka untuk kecekapan maksimum dan jangka hayat operasi yang panjang.',
      bullets: {
        segmentSpacing: 'Jarak segmen dioptimumkan untuk bahan',
        bondHardness: 'Kekerasan ikatan khusus aplikasi',
        precisionBalanced: 'Diseimbangkan dengan tepat untuk potongan licin',
        extendedLife: 'Jangka hayat operasi 3× lebih panjang',
      },
      viewBladesPrefix: 'Lihat Bilah',
      viewBladesSuffix: '',
      whyEyebrow: 'Kenapa Coolman',
      whyTitle: 'Kelebihan Coolman',
      productsEyebrow: 'Produk Kami',
      productsTitle: 'Bilah Berlian',
      viewAllProducts: 'Lihat Semua Produk',
      scroll: 'Skrol',
      placeholderProducts: {
        graniteName: 'Bilah Granit',
        graniteDesc: 'Untuk pemotongan batu asli',
        concreteName: 'Bilah Konkrit',
        concreteDesc: 'Pembinaan tugas berat',
        tileName: 'Bilah Jubin',
        tileDesc: 'Pemotongan seramik tepat',
        priceFrom: 'Dari RM',
      },
    },
    filters: {
      title: 'Tapis Produk',
      material: 'Bahan',
      application: 'Aplikasi',
      machinePower: 'Kuasa Mesin',
      clearAll: 'Kosongkan Semua',
      showingResults: 'Menunjukkan {count} produk',
      noResults: 'Tiada produk sepadan dengan tapisan anda',
    },
    pages: {
      applications: {
        heroEyebrow: 'Aplikasi',
        fallbackHeroTitle: 'Penyelesaian untuk Setiap Bahan',
        fallbackHeroSubtitle: 'Rangkaian alat pemotong berlian kami direka untuk memberikan prestasi optimum merentas semua bahan binaan biasa.',
        viewBladesPrefix: 'Lihat Bilah',
        viewBladesSuffix: '',
        ctaTitle: 'Perlukan Bantuan Memilih Bilah Yang Tepat?',
        ctaMessage: 'Pasukan teknikal kami boleh membantu anda memilih bilah optimum untuk aplikasi dan keadaan pemotongan anda.',
        contactSupport: 'Hubungi Sokongan Teknikal',
      },
      whyCoolman: {
        heroEyebrow: 'Kenapa Coolman',
        ctaTitle: 'Sedia Untuk Merasai Perbezaan Coolman?',
        ctaMessage: 'Sertai kontraktor yang mempercayai Coolman untuk prestasi, kebolehpercayaan dan sokongan.',
        ctaButton: 'Hubungi Kami',
      },
      resources: {
        heroEyebrow: 'Sumber',
        fallbackHeroTitle: 'Sumber Teknikal & Muat Turun',
        fallbackHeroSubtitle: 'Akses katalog produk, panduan teknikal dan kandungan pendidikan untuk memanfaatkan sepenuhnya alat pemotong berlian anda.',
        emptyTitle: 'Katalog akan tiba tidak lama lagi',
        emptyMessage: 'Kami sedang memuktamadkan PDF dan panduan video terkini. Sementara itu, hubungi pasukan kami untuk fail yang anda perlukan.',
        emptyButton: 'Minta salinan',
        playVideo: 'Mainkan video',
        openPdf: 'Buka PDF',
        faqEyebrow: 'Soalan Lazim',
        faqHeading: 'Soalan Yang Kerap Ditanya',
        ctaTitle: 'Perlukan Bantuan Teknikal?',
        ctaMessage: 'Pasukan kejuruteraan kami sedia membantu dengan pemilihan bilah, soalan teknikal dan sokongan aplikasi.',
        ctaButton: 'Hubungi Sokongan Teknikal',
      },
      contact: {
        heroEyebrow: 'Hubungi kami',
        fallbackHeroSubtitle: 'Ada soalan tentang produk kami atau perlukan sebut harga tersuai? Pasukan kami sedia membantu anda mencari penyelesaian yang sesuai.',
        formTitle: 'Hantar mesej kepada kami',
        formSubtitle: 'Isi borang di bawah dan kami akan membalas dalam masa 24 jam.',
        formNameLabel: 'Nama *',
        formNamePlaceholder: 'Nama anda',
        formCompanyLabel: 'Syarikat',
        formCompanyPlaceholder: 'Nama syarikat',
        formEmailLabel: 'Emel *',
        formEmailPlaceholder: 'nama@syarikat.com',
        formPhoneLabel: 'Telefon',
        formPhonePlaceholder: '+60 12-345 6789',
        formMessageLabel: 'Mesej *',
        formMessagePlaceholder: 'Beritahu kami tentang keperluan anda...',
        formSubmit: 'Hantar Mesej',
        formSubmitting: 'Menghantar...',
        formSuccess: 'Terima kasih — kami akan menghubungi anda tidak lama lagi.',
        formError: 'Terdapat ralat. Sila cuba lagi.',
        networkError: 'Ralat rangkaian. Sila semak sambungan anda dan cuba lagi.',
        successTitle: 'Mesej Dihantar!',
        successMessage: 'Terima kasih kerana menghubungi kami. Kami akan membalas dalam masa 24 jam.',
        sendAnother: 'Hantar mesej lain',
        infoHeading: 'Hubungi kami',
        phoneTitle: 'Telefon',
        phoneSubtitle: 'Isnin-Jumaat 9 pagi-6 petang MYT',
        emailTitle: 'Emel',
        emailSubtitle: 'Kami membalas dalam masa 24 jam',
        officeTitle: 'Pejabat',
        responseTimeLabel: 'Masa Respons Purata',
        responseTimeSubtitle: 'Semasa waktu perniagaan',
        liveChatLabel: 'Mahu sembang langsung?',
        liveChatMessage: 'Sembang dengan pasukan sokongan kami secara langsung melalui WhatsApp.',
        openWhatsapp: 'Buka WhatsApp',
      },
      shibuya: {
        heroEyebrow: 'Shibuya',
        heroPrimaryLabel: 'Terokai Model',
        heroSecondaryLabel: 'Tonton Filem',
        scroll: 'SKROL',
        sincePrefix: 'SEJAK',
        modelsEyebrow: 'RANGKAIAN',
        modelsHeadline: 'Pilih Mesin Anda',
        modelNamePrefix: 'Shibuya',
        motorPowerLabel: 'Kuasa Motor',
        maxDiameterLabel: 'Diameter Maksimum',
        weightLabel: 'Berat',
        rpmRangeLabel: 'Julat RPM',
        keyFeaturesLabel: 'CIRI UTAMA',
        startingFromLabel: 'Bermula dari',
        requestQuote: 'Minta Sebut Harga',
        inActionEyebrow: 'DI LAPANGAN',
        inActionCtaLabel: 'Lihat Aplikasi',
        supportEyebrow: 'SOKONGAN',
        ctaTitle: 'Mahukan Demo Shibuya?',
        ctaMessage: 'Bercakap dengan pasukan kami untuk tunjuk cara langsung dan harga.',
        ctaButton: 'Minta Demo',
      },
    },
    products: {
      heroEyebrow: 'Alat Berlian',
      heroHeadlineLine1: 'Alat Pemotong',
      heroHeadlineLine2: 'Berlian Industri',
      heroSubheadline: 'Bilah gred industri direka untuk pemotongan tepat pada granit, konkrit, jubin dan banyak lagi. Dibina untuk profesional yang menuntut prestasi.',
      statProducts: 'Produk',
      statCategories: 'Kategori',
      statMaterials: 'Bahan',
      allProducts: 'Semua Produk',
      materialColon: 'Bahan:',
      filtersHeader: 'Tapisan',
      productSingular: 'produk',
      productPlural: 'produk',
      clear: 'Kosongkan',
      category: 'Kategori',
      all: 'Semua',
      showFilters: 'Tunjuk tapisan',
      sidebar: {
        applicationHeading: 'Aplikasi',
        moreMaterialsHeading: 'Bahan Lain',
        needHelpTitle: 'Perlukan Bantuan?',
        needHelpDesc: 'Jurutera kami boleh membantu anda memilih alat yang sesuai untuk projek anda.',
        requestQuote: 'Minta sebut harga',
      },
      card: {
        openProduct: 'Buka produk',
        noImage: 'Tiada gambar',
        universal: 'Universal',
        standardBond: 'Standard',
        bondSuffix: 'Ikatan',
      },
      pagination: {
        previous: 'Sebelumnya',
        next: 'Seterusnya',
      },
      empty: {
        title: 'Tiada Produk Ditemui',
        message: 'Cuba laraskan tapisan anda',
        clearButton: 'Kosongkan Tapisan',
      },
      bottomCta: {
        title: 'Tidak Jumpa Yang Anda Cari?',
        message: 'Kami menawarkan konfigurasi bilah tersuai untuk aplikasi khusus. Hubungi pasukan kejuruteraan kami.',
        contactEngineering: 'Hubungi Kejuruteraan',
        downloadCatalog: 'Muat Turun Katalog',
      },
      accountPending: {
        title: 'Akaun menunggu pengesahan',
        message: 'Setelah Coolman mengesahkan akaun anda, harga kontrak anda akan muncul di sini.',
      },
    },
    materials: {
      granite: 'Granit',
      concrete: 'Konkrit',
      tile: 'Jubin',
      brick: 'Bata',
      marble: 'Marmar',
      homogeneousTile: 'Jubin Homogen',
      sandstone: 'Batu Pasir',
      asphalt: 'Asfalt',
    },
    applications: {
      floorCutting: 'Pemotongan Lantai',
      wallCutting: 'Pemotongan Dinding',
      coring: 'Tebuk Teras',
      grinding: 'Mengisar',
    },
    machinePower: {
      low: 'Rendah (< 2kW)',
      medium: 'Sederhana (2-4kW)',
      high: 'Tinggi (> 4kW)',
    },
    cta: {
      createAccount: 'Buka akaun',
      openAccount: 'Buka akaun',
      openProduct: 'Buka produk',
      requestQuote: 'Minta sebut harga',
      seeApplications: 'Lihat aplikasi',
      explore: 'Terokai',
    },
    product: {
      viewDetails: 'Buka produk',
      addToOrder: 'Tambah ke Pesanan',
      specifications: 'Spesifikasi',
      diameter: 'Diameter',
      arborSize: 'Saiz Arbor',
      segmentHeight: 'Ketinggian Segmen',
      bondType: 'Jenis Ikatan',
      recommendedMaterial: 'Bahan Disyorkan',
      recommendedMachine: 'Kuasa Mesin Disyorkan',
      recommendedVolume: 'Isipadu Pemotongan Disyorkan',
      relatedProducts: 'Produk Berkaitan',
      suitedFor: 'Sesuai Untuk',
      videoDemo: 'Demonstrasi Video',
      priceList: 'Harga Senarai',
      priceContract: 'Harga Kontrak Anda',
      priceYourTier: 'Diskaun tahap anda',
      priceLogInForContract: 'Log masuk untuk lihat harga kontrak anda',
      priceYouSave: 'Anda jimat',
      loginToOrder: 'Log masuk untuk membuat pesanan',
      addToCart: 'Tambah ke Troli',
    },
    order: {
      title: 'Permintaan Pesanan',
      selectedProduct: 'Produk Dipilih',
      quantity: 'Kuantiti',
      deliveryAddress: 'Alamat Penghantaran',
      notes: 'Nota',
      notesPlaceholder: 'Sebarang arahan atau keperluan khas...',
      pricing: 'Harga',
      listPrice: 'Harga Senarai',
      tierDiscount: 'Diskaun Tier',
      promoCode: 'Kod Promo',
      promoCodePlaceholder: 'Masukkan kod',
      applyPromo: 'Guna',
      promoApplied: 'Promo digunakan!',
      invalidPromo: 'Kod promo tidak sah',
      total: 'Jumlah',
      submit: 'Hantar Permintaan Pesanan',
      submitting: 'Menghantar...',
      success: 'Pesanan Dihantar!',
      successMessage: 'Permintaan pesanan anda telah dihantar. Kami akan menghubungi anda tidak lama lagi.',
      loginRequired: 'Log Masuk Diperlukan',
      loginToOrder: 'Sila log masuk untuk menghantar permintaan pesanan.',
    },
    account: {
      title: 'Akaun Saya',
      myOrders: 'Pesanan Saya',
      orderHistory: 'Sejarah Pesanan',
      noOrders: 'Tiada Pesanan Lagi',
      noOrdersMessage: 'Anda belum membuat sebarang pesanan. Lihat produk kami untuk bermula.',
      browseProducts: 'Lihat Produk',
      orderId: 'ID Pesanan',
      product: 'Produk',
      quantity: 'Kuantiti',
      total: 'Jumlah',
      status: 'Status',
      date: 'Tarikh',
      viewDetails: 'Lihat',
      deliveryAddress: 'Alamat Penghantaran',
      saveAddress: 'Simpan alamat',
      addressSaved: 'Disimpan.',
      addresses: {
        title: 'Alamat Tersimpan',
        addNew: 'Tambah alamat baharu',
        label: 'Label',
        labelPlaceholder: 'cth. Gudang utama',
        addressPlaceholder: 'Alamat penghantaran penuh (maks 500 aksara)',
        defaultBadge: 'Lalai',
        setDefault: 'Tetapkan sebagai lalai',
        edit: 'Sunting',
        delete: 'Padam',
        save: 'Simpan',
        cancel: 'Batal',
        atCap: 'Anda boleh simpan sehingga 5 alamat. Padam satu sebelum menambah yang baharu.',
        none: 'Tiada alamat disimpan. Tambah satu untuk membuat pesanan.',
        confirmDelete: 'Padam alamat ini?',
      },
    },
    status: {
      pending: 'Menunggu',
      acknowledged: 'Diakui',
      fulfilled: 'Dipenuhi',
      cancelled: 'Dibatalkan',
    },
    admin: {
      orders: {
        title: 'Papan Pemuka Pesanan',
        totalOrders: 'Jumlah Pesanan',
        pendingOrders: 'Menunggu',
        avgResponseTime: 'Masa Respons Purata',
        fulfilledToday: 'Dipenuhi Hari Ini',
        searchPlaceholder: 'Cari pesanan...',
        filterByStatus: 'Tapis mengikut Status',
        allStatuses: 'Semua Status',
        contractor: 'Kontraktor',
        product: 'Produk',
        quantity: 'Kuantiti',
        total: 'Jumlah',
        status: 'Status',
        responseTime: 'Masa Respons',
        actions: 'Tindakan',
        acknowledge: 'Akui',
        fulfil: 'Penuhi',
        cancel: 'Batal',
        noOrders: 'Tiada pesanan ditemui',
        urgentAlert: 'Segera: Masa respons melebihi 24 jam',
      },
      analytics: {
        title: 'Papan Pemuka Analitik',
        dateRange: 'Julat Tarikh',
        last7Days: '7 Hari Lepas',
        last30Days: '30 Hari Lepas',
        last90Days: '90 Hari Lepas',
        topMaterials: 'Bahan Paling Dicari',
        topApplications: 'Aplikasi Paling Dicari',
        viewsVsOrders: 'Paparan Produk vs Pesanan',
        views: 'Paparan',
        orders: 'Pesanan',
        contractorActivity: 'Aktiviti Kontraktor',
        contractor: 'Kontraktor',
        company: 'Syarikat',
        lastOrder: 'Pesanan Terakhir',
        totalOrders: 'Jumlah Pesanan',
        status: 'Status',
        export: 'Eksport',
      },
    },
    auth: {
      login: 'Log Masuk',
      register: 'Daftar',
      email: 'Emel',
      password: 'Kata Laluan',
      confirmPassword: 'Sahkan Kata Laluan',
      companyName: 'Nama Syarikat',
      phone: 'Nombor Telefon',
      address: 'Alamat Penghantaran',
      loginButton: 'Log Masuk',
      registerButton: 'Cipta Akaun',
      noAccount: 'Tiada akaun?',
      hasAccount: 'Sudah ada akaun?',
      forgotPassword: 'Lupa kata laluan?',
    },
    common: {
      loading: 'Memuatkan...',
      error: 'Ralat berlaku',
      retry: 'Cuba Lagi',
      back: 'Kembali',
      save: 'Simpan',
      cancel: 'Batal',
      confirm: 'Sahkan',
      search: 'Cari',
      currency: 'RM',
    },
    footer: {
      tagline: 'Alat berlian premium untuk profesional',
      quickLinks: 'Pautan Pantas',
      contact: 'Hubungi Kami',
      email: 'sales@coolman.com.my',
      phone: '+60 3-1234 5678',
      address: 'Kuala Lumpur, Malaysia',
      copyright: '© 2024 Coolman. Hak cipta terpelihara.',
      brandStory: 'Alat pemotong berlian gred industri direka untuk ketepatan dan ketahanan. Dipercayai oleh kontraktor profesional di seluruh Malaysia sejak 1998.',
      diamondToolsHeading: 'Alat Berlian',
      shibuyaHeading: 'Shibuya',
      companyHeading: 'Syarikat',
      openAccountHeading: 'Buka akaun',
      becomePartner: 'Jadi Rakan Kongsi',
      joinBlurb: 'Sertai 500+ kontraktor dan dapatkan harga B2B eksklusif.',
      privacyPolicy: 'Dasar Privasi',
      termsOfService: 'Terma Perkhidmatan',
      bottomCopyright: 'Coolman Sdn Bhd. Hak cipta terpelihara.',
      links: {
        allDiamondTools: 'Semua Alat Berlian',
        diamondBlades: 'Bilah Berlian',
        diamondCoreBits: 'Mata Teras Berlian',
        polishingPads: 'Pad Penggilap',
        shibuyaCoreDrills: 'Penggerudi Teras Shibuya',
        tsHandheld: 'TS-132 Pegang Tangan',
        tsIndustrial: 'TS-252 Industri',
        spareParts: 'Alat Ganti',
        whyCoolman: 'Kenapa Coolman',
        applications: 'Aplikasi',
        resources: 'Sumber',
        contact: 'Hubungi',
      },
    },
  },
}
