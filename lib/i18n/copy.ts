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
    fieldNotes: string
    signIn: string
    signOut: string
    createAccount: string
    diamondTools: string
    shibuyaCoreDrills: string
    account: string
    switchToBM: string
    switchToEN: string
    heritage: string
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
    fallback: {
      hero: {
        badge: string
        line1: string
        line2: string
        line3: string
        subheadline: string
        primaryCtaLabel: string
        secondaryCtaLabel: string
        imageAlt: string
      }
      applicationList: Array<{ id: string; label: string; image: string }>
      stats: Array<{ value: string; label: string }>
      features: Array<{ title: string; description: string; stat: string; statLabel: string }>
      ctaSection: {
        headline: string
        subheadline: string
        primaryCtaLabel: string
        secondaryCtaLabel: string
      }
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
      defaultSections: Array<{
        id: string
        title: string
        description: string
        features: string[]
      }>
    }
    whyCoolman: {
      hero: { eyebrow: string; title: string; titleEmphasis: string; lede: string }
      folio01: {
        folioLabel: string
        category: string
        title: string
        titleEmphasis: string
        summary: string
        metaAuthor: string
        metaSubject: string
        metaRead: string
        paragraphs: string[]
        pullquote: string
      }
      folio02: {
        folioLabel: string
        category: string
        title: string
        titleEmphasis: string
        summary: string
        metaAuthor: string
        metaSubject: string
        metaRead: string
        paragraphs: string[]
        pullquote: string
      }
      folio03: {
        folioLabel: string
        category: string
        title: string
        titleEmphasis: string
        summary: string
        metaAuthor: string
        metaSubject: string
        metaRead: string
        paragraphs: string[]
        pullquote: string
      }
      closingCta: {
        eyebrow: string
        title: string
        titleEmphasis: string
        body: string
        whatsappCtaLabel: string
        fieldNotesCtaLabel: string
      }
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
      guidesEyebrow: string
      guidesHeading: string
      guidesSubheading: string
      guidesEmpty: string
      readMore: string
      publishedOn: string
      backToResources: string
    }
    contact: {
      heroEyebrow: string
      fallbackHeroSubtitle: string
      heroTitle: string
      heroTitleEmphasis: string
      heroLede: string
      channelsEyebrow: string
      channelsHeadline: string
      channelsLede: string
      channel1Badge: string
      channel1Title: string
      channel1Body: string
      channel1HoursLabel: string
      channel1ResponseLabel: string
      channel1LanguagesLabel: string
      channel1NumberLabel: string
      channel1Hours: string
      channel1Response: string
      channel1Languages: string
      channel1Cta: string
      channel2Badge: string
      channel2Title: string
      channel2Body: string
      channel2NumberLabel: string
      channel2HoursLabel: string
      channel2ResponseLabel: string
      channel2Hours: string
      channel2Response: string
      channel2Cta: string
      channel3Badge: string
      channel3Title: string
      channel3Body: string
      channel3FormatLabel: string
      channel3ResponseLabel: string
      channel3OutputLabel: string
      channel3Format: string
      channel3Response: string
      channel3Output: string
      channel3Cta: string
      locationEyebrow: string
      locationHeadline: string
      locationLede: string
      locationAddressFallback: string
      locationAddressNote: string
      locationLabelMonFri: string
      locationLabelSat: string
      locationLabelSun: string
      locationRegPrefix: string
      locationDispatchLabel: string
      locationDispatchSuffix: string
      locationOpenInMaps: string
      locationMapWorkshop: string
      locationMapSince: string
      locationMapCity: string
      locationMapCoords: string
      locationOverlayBrand: string
      directLinesEyebrow: string
      directLinesHeadline: string
      directLinesLede: string
      directLineSalesLabel: string
      directLineSalesNote: string
      directLinePartsLabel: string
      directLinePartsNote: string
      directLineTrainingLabel: string
      directLineTrainingNote: string
      directLineCareersLabel: string
      directLineCareersNote: string
      formEyebrow: string
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
      whatsappPrefillText: string
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
      anchorLabel: string
      rpmRangeLabel: string
      voltageLabel: string
      maxDepthLabel: string
      feedSystemLabel: string
      holeRunoutLabel: string
      bitPairingLabel: string
      keyFeaturesLabel: string
      startingFromLabel: string
      requestQuote: string
      downloadSpecSheet: string
      inActionEyebrow: string
      inActionCtaLabel: string
      supportEyebrow: string
      ctaTitle: string
      ctaMessage: string
      ctaButton: string
      ctaWhatsApp: string
      ctaAllChannels: string
      emptyStateHeadline: string
      emptyStateBody: string
      demoFormTitle: string
      demoFormName: string
      demoFormCompany: string
      demoFormPhone: string
      demoFormModel: string
      demoFormModelPlaceholder: string
      demoFormProject: string
      demoFormNotes: string
      demoFormSubmit: string
      demoFormSuccessTitle: string
      demoFormSuccessBody: string
      demoFormError: string
    }
    productDetail: {
      breadcrumbProducts: string
      productTypeFallback: string
      machinePowerLabel: string
      quantityLabel: string
      recommendedMaterialsHeading: string
      materialBadgeFallback: string
      noImageUploaded: string
      noImage: string
      sectionLabels: {
        related: string
        relatedHeading: string
        viewAll: string
        openProduct: string
        universal: string
      }
      specs: {
        diameter: string
        arborSize: string
        segmentHeight: string
        bondType: string
        maxRPM: string
        maxRPMFallback: string
        machineTier: string
      }
      tabs: {
        specifications: string
        applications: string
        usageGuide: string
        parameters: string
        documents: string
      }
      usageGuide: {
        steps: Array<{ title: string; body: string; bodyWithMaxRPM?: string }>
      }
      orderForm: {
        title: string
        blurb: string
        lineTotal: string
        submitLabel: string
        whatsappLabel: string
        orLabel: string
        footNote: string
      }
      priceCard: {
        footNote: string
      }
      documentsEmpty: string
      ctaStrip: {
        heading: string
        body: string
        primaryLabel: string
        secondaryLabel: string
      }
      requestQuote: string
      skuLabel: string
      bondLabel: string
      whatsappEnquiry: string
      documentDownload: string
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
    searchPlaceholder: string
    searchLabel: string
    searchClear: string
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
    // Session 4 Part 3 — three-column footer + base bar. Minimalist; the
    // footer is functional, not decorative.
    columns: {
      reachCoolman: {
        heading: string
        items: Array<{ primary: string; secondary: string; href: string }>
      }
      readAndLearn: {
        heading: string
        items: Array<{ primary: string; secondary: string; href: string }>
      }
      catalogueAndTrade: {
        heading: string
        items: Array<{ primary: string; secondary: string; href: string }>
      }
    }
    baseBar: {
      manufacturedIn: string
      distributorLineTemplate: string
      legalLinks: {
        privacy: string
        terms: string
        returns: string
        cookies: string
      }
    }
    rightsReservedSuffix: string
  }
  manifesto: {
    line1: string
    line2: string
    line3: string
  }
  homeNarrative: {
    opening: {
      eyebrow: string
      headlinePrefix: string
      headlineEmphasis: string
      lede: string
      ctaPrimary: string
      ctaSecondary: string
    }
    heroCard: {
      corner: string
      eyebrow: string
      title: string
      rows: Array<{ key: string; value: string }>
      readLabel: string
    }
    fearGrid: {
      eyebrow: string
      headline: string
      cards: Array<{
        key: 'delay' | 'equipment' | 'inconsistency' | 'alone'
        title: string
        body: string
      }>
    }
    threeMythsIntro: {
      eyebrow: string
      headline: string
      lede: string
      ctaLabel: string
    }
    brotherhoodIntro: {
      eyebrow: string
      headline: string
      lede: string
      ctaLabel: string
    }
    fieldNotesPreview: {
      eyebrow: string
      headline: string
      lede: string
      cards: Array<{ title: string; meta: string; readingTime: string }>
      ctaLabel: string
    }
    engineering: {
      eyebrow: string
      pullPrefix: string
      pullEmphasis: string
      pullSuffix: string
      body: string[]
      callouts: Array<{ num: string; sup: string; label: string }>
      blueprint: {
        drawingNumber: string
        scaleNote: string
        caption: string
      }
      workshopPhoto: {
        heading: string
        body: string
      }
    }
    alansLetter: {
      eyebrow: string
      paragraphs: string[]
      signature: string
      signatureLine2: string
    }
    quietDoor: {
      eyebrow: string
      headline: string
      lede: string
      stats: Array<{
        key: 'sku' | 'diameter' | 'onTimePct' | 'dispatchCutoff'
        value: string
        label: string
      }>
      ctaPrimary: string
      ctaSecondary: string
    }
    conversation: {
      eyebrow: string
      headline: string
      lede: string
      channels: Array<{ tag: string; title: string; body: string; ctaLabel: string }>
    }
  }
  heritage: {
    hero: {
      eyebrow: string
      headline: string
      lede: string
    }
    pj2007: {
      eyebrow: string
      headline: string
      body: string[]
    }
    founding: {
      eyebrow: string
      headline: string
      body: string[]
    }
    workshopDay: {
      eyebrow: string
      headline: string
      note?: string
      body: string[]
    }
    shibuyaYears: {
      eyebrow: string
      headline: string
      body: string[]
    }
    hardestYear: {
      eyebrow: string
      headline: string
      body: string[]
    }
    twentyYears: {
      eyebrow: string
      headline: string
      body: string[]
    }
    timeline: {
      eyebrow: string
      headline: string
      events: Array<{ year: string; title: string; body: string; note?: string }>
    }
  }
  fieldNotes: {
    indexHero: {
      eyebrow: string
      headline: string
      lede: string
    }
    // Keys used by the dynamic Payload-backed index + article pages. These
    // are separate from the three hardcoded prototype articles below
    // (pileCutting / midnightRoad / productRecall) which remain as preview
    // fixtures and will be removed once enough real Payload posts exist.
    index: {
      eyebrowPrefix: string
      eyebrowSincePrefix: string
      eyebrowPublishedSuffix: string
      filterAll: string
      filterAllShort: string
      sortLabel: string
      sortRecent: string
      sortOldest: string
      archiveHeading: string
      archiveHeadingNote: string
      featuredBadge: string
      readMore: string
      emptyHeadline: string
      emptyBody: string
    }
    article: {
      back: string
      breadcrumbHome: string
      breadcrumbFieldNotes: string
      filedUnderLabel: string
      bylineLabel: string
      publishedLabel: string
      readTimeUnit: string
      relatedHeading: string
      relatedLede: string
      sharePrefix: string
      missingTitle: string
      missingBody: string
    }
    byline: string
    filedUnder: string
    pileCutting: {
      title: string
      meta: string
      readingTime: string
      pullQuote: string
      sections: Array<{ heading: string; paragraphs: string[] }>
    }
    midnightRoad: {
      title: string
      meta: string
      readingTime: string
      pullQuote: string
      sections: Array<{ heading: string; paragraphs: string[] }>
    }
    productRecall: {
      title: string
      meta: string
      readingTime: string
      pullQuote: string
      sections: Array<{ heading: string; paragraphs: string[] }>
    }
  }
  engineeringFolio: {
    indexHero: {
      eyebrow: string
      headline: string
      lede: string
    }
    threeMyths: {
      title: string
      readingTime: string
      pullQuote: string
      sections: Array<{ heading: string; paragraphs: string[] }>
    }
    malaysianAggregate: {
      title: string
      readingTime: string
      pullQuote: string
      sections: Array<{ heading: string; paragraphs: string[] }>
    }
    brotherhood: {
      title: string
      readingTime: string
      pullQuote: string
      sections: Array<{ heading: string; paragraphs: string[] }>
    }
  }
  catalogueIntro: {
    eyebrow: string
    headline: string
    lede: string
    tradeNote: string
    filters: {
      materialLabel: string
      applicationLabel: string
      diameterLabel: string
      diameterUnit: string
    }
  }
  priceGate: {
    signInToSeePricing: string
    verificationPending: string
    contractPricingHint: string
    resendVerification: string
    listPrice: string
    yourTierDiscount: string
    promo: string
    yourPrice: string
  }
  productPageTemplate: {
    categoryEyebrow: string
    tagline: string
    heroSpecBlock: {
      diameterLabel: string
      bondLabel: string
      segmentLabel: string
      flangeLabel: string
    }
    whatItsFor: {
      heading: string
      body: string
    }
    whenToChoose: {
      heading: string
      body: string
    }
    specsTable: {
      heading: string
      rows: Array<{ key: string; value: string }>
    }
    unusualCuts: {
      heading: string
      body: string
      ctaLabel: string
    }
  }
  tradePage: {
    hero: {
      eyebrow: string
      headline: string
      lede: string
    }
    tiers: {
      buyer: { title: string; body: string; bullets: string[] }
      dealer: { title: string; body: string; bullets: string[] }
    }
    application: {
      eyebrow: string
      headline: string
      steps: Array<{ title: string; body: string }>
      ctaLabel: string
    }
  }
  contactPage: {
    hero: {
      eyebrow: string
      headline: string
      lede: string
    }
    channels: Array<{ tag: string; title: string; body: string; ctaLabel: string }>
    hours: {
      heading: string
      line1: string
      line2: string
    }
  }
  aboutPage: {
    hero: {
      eyebrow: string
      headline: string
      lede: string
    }
    founded: { value: string; label: string }
    builtIn: { value: string; label: string }
    accounts: { value: string; label: string }
  }
  legal: {
    draftBadge: string
    privacy: { title: string; lede: string }
    terms: { title: string; lede: string }
    returns: { title: string; lede: string }
    cookies: { title: string; lede: string }
  }
  seo: {
    home: { title: string; description: string }
    heritage: { title: string; description: string }
    whyCoolman: { title: string; description: string }
    fieldNotes: { title: string; description: string }
    catalogue: { title: string; description: string }
    productTemplate: { title: string; description: string }
    trade: { title: string; description: string }
    contact: { title: string; description: string }
    about: { title: string; description: string }
    shibuya: { title: string; description: string }
    privacy: { title: string; description: string }
    terms: { title: string; description: string }
    returns: { title: string; description: string }
    cookies: { title: string; description: string }
    folioThreeMyths: { title: string; description: string }
    brotherhood: { title: string; description: string }
  }
  brotherhoodDirectory: {
    hero: {
      eyebrow: string
      headline: string
      lede: string
    }
    filter: {
      allLabel: string
      label: string
    }
    emptyState: {
      headline: string
      body: string
      ctaLabel: string
    }
  }
  killSwitch: {
    message: string
    ctaLabel: string
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
      fieldNotes: 'Field Notes',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      createAccount: 'Create account',
      diamondTools: 'Diamond Tools',
      shibuyaCoreDrills: 'Shibuya Core Drills',
      account: 'Account',
      switchToBM: 'Switch to Bahasa Malaysia',
      switchToEN: 'Switch to English',
      heritage: 'Heritage',
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
      fallback: {
        hero: {
          badge: 'Trusted by 500+ Malaysian Contractors',
          line1: 'Industrial',
          line2: 'Diamond Tools',
          line3: 'Built for Performance',
          subheadline: 'Industrial-grade cutting solutions engineered for concrete, granite, marble, and more. Built to meet the demanding standards of professional contractors.',
          primaryCtaLabel: 'Explore Products',
          secondaryCtaLabel: 'See applications',
          imageAlt: 'Diamond blade cutting',
        },
        applicationList: [
          { id: 'concrete', label: 'Concrete', image: '/images/blade-concrete.jpg' },
          { id: 'granite', label: 'Granite', image: '/images/blade-granite.jpg' },
          { id: 'marble', label: 'Marble', image: '/images/blade-granite.jpg' },
          { id: 'tile', label: 'Tile & Ceramic', image: '/images/blade-tile.jpg' },
        ],
        stats: [
          { value: '25+', label: 'Years' },
          { value: '500+', label: 'Contractors' },
          { value: '50K+', label: 'Projects' },
          { value: '99%', label: 'On-Time' },
        ],
        features: [
          { title: 'Superior Cutting Speed', description: '40% faster cutting compared to standard blades.', stat: '40%', statLabel: 'Faster' },
          { title: 'Extended Blade Life', description: 'Proprietary bonding technology ensures longer life.', stat: '3×', statLabel: 'Longer' },
          { title: 'Rapid Fulfillment', description: 'Same-day dispatch for orders placed before 2pm.', stat: '24h', statLabel: 'Delivery' },
          { title: 'Technical Support', description: 'Dedicated team to help optimise your operations.', stat: '24/7', statLabel: 'Support' },
        ],
        ctaSection: {
          headline: 'Ready to Elevate\nYour Operations?',
          subheadline: 'Join 500+ professional contractors who trust Coolman for their diamond cutting needs.',
          primaryCtaLabel: 'Request Consultation',
          secondaryCtaLabel: 'Download Catalog',
        },
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
        defaultSections: [
          { id: 'concrete', title: 'Concrete Cutting', description: 'Heavy-duty diamond blades engineered for reinforced concrete, cured slabs, and structural elements.', features: ['Reinforced concrete', 'Cured concrete slabs', 'Concrete blocks', 'Precast elements'] },
          { id: 'granite', title: 'Granite & Natural Stone', description: 'Precision blades for cutting granite countertops, natural stone, and hard rock materials.', features: ['Granite slabs', 'Natural stone', 'Hard rock', 'Quartz surfaces'] },
          { id: 'marble', title: 'Marble & Soft Stone', description: 'Specialized segments for clean, chip-free cuts in marble, limestone, and soft stone.', features: ['Marble slabs', 'Limestone', 'Travertine', 'Soft stone'] },
          { id: 'tile', title: 'Tile & Ceramics', description: 'Fine-grit diamond blades for precise cuts in porcelain, ceramic tiles, and glass.', features: ['Porcelain tiles', 'Ceramic tiles', 'Glass tiles', 'Mosaic work'] },
          { id: 'asphalt', title: 'Asphalt Cutting', description: 'Durable blades designed for roadwork, asphalt overlays, and pavement cutting.', features: ['Road repairs', 'Pavement cutting', 'Asphalt overlays', 'Utility trenching'] },
          { id: 'brick', title: 'Brick & Masonry', description: 'All-purpose blades for cutting brick, block, and general masonry materials.', features: ['Clay brick', 'Concrete blocks', 'Pavers', 'Masonry walls'] },
        ],
      },
      whyCoolman: {
        hero: {
          eyebrow: 'Engineering Folio',
          title: 'Three arguments.',
          titleEmphasis: 'One trade.',
          lede: 'Three arguments that establish where Coolman stands on the cutting trade. The myths the industry still teaches. The case for matching bonds to Malaysian aggregate. The Brotherhood philosophy.',
        },
        folio01: {
          folioLabel: 'Engineering Folio №01',
          category: 'Industry position',
          title: 'Three things the cutting trade keeps',
          titleEmphasis: 'getting wrong.',
          summary: 'After nearly thirty years in the Malaysian diamond tools industry, three beliefs are repeated so often they sound like wisdom. They are not.',
          metaAuthor: 'Coolman Engineering',
          metaSubject: 'Industry positioning',
          metaRead: '1 min read',
          paragraphs: [
            'Three beliefs dominate sales conversations in the Malaysian cutting trade. Customers only care about price. More dealers means more growth. Made in Japan beats Made in China. Each one is repeated so often it sounds like wisdom. Each one is wrong.',
            'A blade is RM300. A day’s delay on a Klang Valley piling project can cost RM10,000 in penalties before you count idle workers. When a contractor pushes on price, they’re asking whether they can trust the supplier — not whether the blade is cheap. On dealers: by year five of aggressive expansion, margins compress, service hollows out, and the brand is worth less than when it started. On country of origin: the variance inside any country’s production is now larger than the average gap between countries.',
            'The myths survive because they let suppliers avoid harder conversations. The contractors who stay profitable longest have already stopped believing them.',
          ],
          pullquote: 'The conversation was never about the blade.',
        },
        folio02: {
          folioLabel: 'Engineering Folio №02',
          category: 'Technical',
          title: 'Malaysian aggregate breaks',
          titleEmphasis: 'European blades.',
          summary: 'A technical argument about why blades bonded for European concrete underperform on Malaysian sites, and what to do about it.',
          metaAuthor: 'Coolman Engineering',
          metaSubject: 'Bond design · Aggregate composition',
          metaRead: '1 min read',
          paragraphs: [
            'A diamond blade doesn’t cut — it abrades. Diamonds in the segment scrape away the material; as they dull, the bond around them wears to expose fresh diamonds underneath. Everything depends on matching the bond hardness to how abrasive the material is.',
            'Malaysian concrete is granite-dominant. Granite has high silica content — noticeably more abrasive than the limestone aggregate that calibrates most European blades. A bond formulation correct for European concrete is, on Malaysian granite, too soft. It wears faster than designed. Segments deteriorate early. Contractors blame the operator or the machine. The actual problem is upstream: the bond was never matched to the material.',
            'Coolman’s CM-X line uses a three-layer cobalt construction — each layer at a different diamond concentration. As the outer layer wears faster than European-bond designs expected, the inner layers keep exposing fresh diamonds. The blade is engineered for the aggregate it will actually cut, not the aggregate on a European spec sheet.',
          ],
          pullquote: 'The blade does not care what the spec sheet says. It cares what the rock does.',
        },
        folio03: {
          folioLabel: 'Engineering Folio №03',
          category: 'Brand philosophy',
          title: 'The Brotherhood',
          titleEmphasis: 'System.',
          summary: 'Every diamond tools brand in Malaysia has a dealer network. Most are functionally broken by year five. This is the operating philosophy that has kept ours profitable for nearly two decades.',
          metaAuthor: 'Coolman Engineering',
          metaSubject: 'Distribution philosophy',
          metaRead: '1 min read',
          paragraphs: [
            'Every diamond tools brand in Malaysia has a dealer network. Most are functionally broken by year five. The pattern: aggressive recruitment, maximum discounts, no territorial protection. Dealers compete against each other for the same contractors. Margins compress. Some fold. The survivors cut service to stay alive.',
            'The Brotherhood runs the opposite way. Fewer dealers per region than the industry standard. Each protected from direct competition by other Coolman dealers in their territory. Margins maintained at a level that makes technical investment rational. No direct-sales operation that undercuts our own dealer base.',
            'The cost is real in the short term: foregone volume, foregone margin, the discipline to say no every quarter. The return is a dealer base that has, in most cases, carried Coolman for years. That experience compounds into something a competitor cannot easily copy.',
          ],
          pullquote: 'The most stable dealer network wins. Not the largest.',
        },
        closingCta: {
          eyebrow: 'A conversation',
          title: 'Got a cut that the spec',
          titleEmphasis: 'sheet cannot answer?',
          body: 'Send a photo of the job, the aggregate, and the existing blade. The engineering desk replies the same working day. If you want to read more in the same voice, three Field Notes cover specific jobs that taught us what the folio above argues.',
          whatsappCtaLabel: 'Open the engineering desk on WhatsApp',
          fieldNotesCtaLabel: 'Read the Field Notes',
        },
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
        guidesEyebrow: 'Technical Guides',
        guidesHeading: 'Field-tested guides from our workshop',
        guidesSubheading: 'Practical articles on blade selection, core drilling, and choosing the right cutting tool for the job.',
        guidesEmpty: 'New guides are being prepared. Check back soon.',
        readMore: 'Read article',
        publishedOn: 'Published',
        backToResources: 'Back to Resources',
      },
      contact: {
        heroEyebrow: 'Contact · Engineering desk',
        fallbackHeroSubtitle: 'The fastest way to reach Coolman is the engineering desk on WhatsApp. For general enquiries, the office line works. For site visits, the form helps us prepare.',
        heroTitle: 'Most cuts begin with',
        heroTitleEmphasis: 'a phone call.',
        heroLede: 'The fastest way to reach Coolman is the engineering desk on WhatsApp. For general enquiries, the office line works. For site visits, the form helps us prepare.',
        channelsEyebrow: 'Three channels · pick what fits',
        channelsHeadline: 'Each channel maps to a kind of conversation.',
        channelsLede: 'WhatsApp for fast technical answers and photos. The office line for general enquiries and trade accounts. The site visit form when you need an engineer on site.',
        channel1Badge: 'Channel 01 · WhatsApp',
        channel1Title: 'The engineering desk.',
        channel1Body: 'Send a photo of the job, the aggregate, the existing blade. Alan or the technical team replies the same working day. The fastest path from question to bond recommendation.',
        channel1HoursLabel: 'Hours',
        channel1ResponseLabel: 'Response',
        channel1LanguagesLabel: 'Language',
        channel1NumberLabel: 'Number',
        channel1Hours: 'Mon to Fri, 9:00am to 6:00pm · Saturday 9:00am to 1:00pm',
        channel1Response: 'Usually within an hour',
        channel1Languages: 'EN · BM',
        channel1Cta: 'Open WhatsApp',
        channel2Badge: 'Channel 02 · Office line',
        channel2Title: 'Call the office.',
        channel2Body: 'For general enquiries, account questions, and trade applications. Monday to Saturday, office hours. Picks up at the front desk and routes you to the right person.',
        channel2NumberLabel: 'Number',
        channel2HoursLabel: 'Hours',
        channel2ResponseLabel: 'Routes to',
        channel2Hours: 'Mon to Fri, 9:00am to 6:00pm · Saturday 9:00am to 1:00pm',
        channel2Response: 'Sales, accounts, or trade',
        channel2Cta: 'Call the office',
        channel3Badge: 'Channel 03 · Site visit',
        channel3Title: 'Request a site visit.',
        channel3Body: 'For project-specific consultations. Tell us about your project, your site conditions, and your timeline. An engineer responds with a proposed visit slot.',
        channel3FormatLabel: 'Best for',
        channel3ResponseLabel: 'Reply',
        channel3OutputLabel: 'Output',
        channel3Format: 'New projects, unusual aggregate, tender prep',
        channel3Response: 'Within 2 working days',
        channel3Output: 'Proposed visit slot · engineer assigned',
        channel3Cta: 'Request a visit',
        locationEyebrow: 'The workshop · Selangor',
        locationHeadline: 'The press, the kiln, the laser-weld.',
        locationLede: 'Visitors welcome by appointment. The technical team can walk you through the press, the segment kiln, and the laser-weld station. The three machines every blade we ship passes through.',
        locationAddressFallback: 'Selangor · Malaysia',
        locationAddressNote: 'Full address available on request.',
        locationLabelMonFri: 'Mon to Fri',
        locationLabelSat: 'Saturday',
        locationLabelSun: 'Sunday',
        locationRegPrefix: 'Reg.',
        locationDispatchLabel: 'Site dispatch cut-off',
        locationDispatchSuffix: 'for same-day dispatch from PJ stock',
        locationOpenInMaps: 'Open in maps',
        locationMapWorkshop: 'COOLMAN',
        locationMapSince: 'NO. 14 · SINCE 2007',
        locationMapCity: 'Selangor',
        locationMapCoords: '3.0840° N · 101.6336° E',
        locationOverlayBrand: 'Coolman',
        directLinesEyebrow: 'Direct lines',
        directLinesHeadline: 'If you already know who you need.',
        directLinesLede: 'Direct contact points for the four most common reasons people reach the company. Each one goes to a named team, not a queue.',
        directLineSalesLabel: 'Sales',
        directLineSalesNote: 'Quotes, account questions, general enquiries.',
        directLinePartsLabel: 'Parts and orders',
        directLinePartsNote: 'Re-orders, dispatch, invoices for trade accounts.',
        directLineTrainingLabel: 'Training and service',
        directLineTrainingNote: 'Operator training, certifications, Shibuya service.',
        directLineCareersLabel: 'Careers',
        directLineCareersNote: 'Job applications. Goes direct to Alan.',
        formEyebrow: 'Site visit form',
        formTitle: 'Tell us about the project.',
        formSubtitle: 'Project type, site conditions, timeline. An engineer responds with a proposed visit slot.',
        formNameLabel: 'Name *',
        formNamePlaceholder: 'Your name',
        formCompanyLabel: 'Company',
        formCompanyPlaceholder: 'Company name',
        formEmailLabel: 'Email *',
        formEmailPlaceholder: 'name@company.com',
        formPhoneLabel: 'Phone',
        formPhonePlaceholder: '+60 12-345 6789',
        formMessageLabel: 'Project details *',
        formMessagePlaceholder: 'Project type, site conditions, aggregate if known, target timeline.',
        formSubmit: 'Request a visit',
        formSubmitting: 'Sending...',
        formSuccess: 'Thanks. We will be in touch shortly.',
        formError: 'Something went wrong. Please try again.',
        networkError: 'Network error. Please check your connection and try again.',
        successTitle: 'Request received.',
        successMessage: 'An engineer will respond with a proposed visit slot within two working days.',
        sendAnother: 'Send another request',
        infoHeading: 'Get in touch',
        phoneTitle: 'Phone',
        phoneSubtitle: 'Mon to Sat office hours',
        emailTitle: 'Email',
        emailSubtitle: 'We reply within 24 hours',
        officeTitle: 'Office',
        responseTimeLabel: 'Average response time',
        responseTimeSubtitle: 'During business hours',
        liveChatLabel: 'Prefer WhatsApp?',
        liveChatMessage: 'Reach the engineering desk on WhatsApp for fast technical answers.',
        openWhatsapp: 'Open WhatsApp',
        whatsappPrefillText: 'Hi, I have a question about your blades.',
      },
      shibuya: {
        heroEyebrow: 'Shibuya',
        heroPrimaryLabel: 'Explore Models',
        heroSecondaryLabel: 'See the machine',
        scroll: 'SCROLL',
        sincePrefix: 'SINCE',
        modelsEyebrow: 'THE RANGE',
        modelsHeadline: 'Choose Your Machine',
        modelNamePrefix: 'Shibuya',
        motorPowerLabel: 'Motor Power',
        maxDiameterLabel: 'Max Diameter',
        weightLabel: 'Weight',
        anchorLabel: 'Anchor',
        rpmRangeLabel: 'RPM Range',
        voltageLabel: 'Voltage',
        maxDepthLabel: 'Max Drilling Depth',
        feedSystemLabel: 'Feed System',
        holeRunoutLabel: 'Hole Runout',
        bitPairingLabel: 'Coolman Bit Pairing',
        keyFeaturesLabel: 'KEY FEATURES',
        startingFromLabel: 'Starting from',
        requestQuote: 'Request Quote',
        downloadSpecSheet: 'Download Spec Sheet',
        inActionEyebrow: 'IN THE FIELD',
        inActionCtaLabel: 'View Applications',
        supportEyebrow: 'SUPPORT',
        ctaTitle: 'Want a Shibuya Demo?',
        ctaMessage: 'Speak to our team for a live walkthrough and pricing.',
        ctaButton: 'Request a Demo',
        ctaWhatsApp: 'WhatsApp Us Now',
        ctaAllChannels: 'All Contact Channels',
        emptyStateHeadline: 'Roster coming soon',
        emptyStateBody: 'The Shibuya range is being prepared. Speak to our team for a live walkthrough.',
        demoFormTitle: 'Request a Shibuya Demo',
        demoFormName: 'Your Name',
        demoFormCompany: 'Company',
        demoFormPhone: 'Phone Number',
        demoFormModel: 'Machine Model of Interest',
        demoFormModelPlaceholder: 'Select a model…',
        demoFormProject: 'Project / Application',
        demoFormNotes: 'Additional Notes',
        demoFormSubmit: 'Send Request',
        demoFormSuccessTitle: 'Request received',
        demoFormSuccessBody: 'Our team will contact you within one business day to arrange the demo.',
        demoFormError: 'Something went wrong. Please try again or contact us via WhatsApp.',
      },
      productDetail: {
        breadcrumbProducts: 'Products',
        productTypeFallback: 'Diamond Blade',
        machinePowerLabel: 'Machine power',
        quantityLabel: 'Quantity',
        recommendedMaterialsHeading: 'Recommended Materials',
        materialBadgeFallback: 'Stocked',
        noImageUploaded: 'No image uploaded',
        noImage: 'No image',
        sectionLabels: {
          related: 'Related',
          relatedHeading: 'You Might Also Need',
          viewAll: 'View All',
          openProduct: 'Open product',
          universal: 'Universal',
        },
        specs: {
          diameter: 'Diameter',
          arborSize: 'Arbor Size',
          segmentHeight: 'Segment Height',
          bondType: 'Bond Type',
          maxRPM: 'Max RPM',
          maxRPMFallback: 'See manual',
          machineTier: 'Machine Tier',
        },
        tabs: {
          specifications: 'Full Specification',
          applications: 'Application Notes',
          usageGuide: 'Usage Guide',
          parameters: 'Cutting Parameters',
          documents: 'Documents',
        },
        usageGuide: {
          steps: [
            {
              title: 'Inspect Before Use',
              body: 'Check for cracks, warping, or damage before mounting. Never use a damaged blade.',
            },
            {
              title: 'Correct Mounting',
              body: 'Ensure the arbor size matches your machine. Tighten securely with the correct flange.',
            },
            {
              title: 'Set Correct RPM',
              body: 'Do not exceed the rated RPM. Over-speeding causes premature failure.',
              bodyWithMaxRPM: 'Do not exceed {maxRPM} RPM. Over-speeding causes premature failure.',
            },
            {
              title: 'Use Water Cooling',
              body: 'Wet cutting extends blade life significantly. Dry cutting is only recommended for short bursts.',
            },
          ],
        },
        orderForm: {
          title: 'Place an order request',
          blurb: 'No payment now. Alan acknowledges within 24 h with final price, lead time, and delivery option.',
          lineTotal: 'Line total',
          submitLabel: 'Submit order request →',
          whatsappLabel: 'WhatsApp engineering desk',
          orLabel: 'or',
          footNote: 'By submitting, you agree we may contact you about this request. Dispatch within 2 business days · ex-PJ warehouse.',
        },
        priceCard: {
          footNote: 'Per unit · excl. SST · ex-warehouse Selangor',
        },
        documentsEmpty: 'No documents have been uploaded for this product yet.',
        ctaStrip: {
          heading: 'Ready to order or need technical advice?',
          body: 'Our engineers are available to help you choose the right blade.',
          primaryLabel: 'Talk to an Engineer',
          secondaryLabel: 'Request a quote',
        },
        requestQuote: 'Request a quote',
        skuLabel: 'SKU',
        bondLabel: 'Bond',
        whatsappEnquiry: 'Hi, I\'d like to enquire about {name} (SKU: {sku})',
        documentDownload: 'Download',
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
      searchPlaceholder: 'Search by product name or code…',
      searchLabel: 'Search products',
      searchClear: 'Clear search',
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
      columns: {
        reachCoolman: {
          heading: 'Reach Coolman',
          items: [
            { primary: 'Engineering desk', secondary: 'WhatsApp', href: '/contact' },
            { primary: 'Office', secondary: 'Monday to Saturday', href: '/contact' },
            { primary: 'Site visit', secondary: 'Request a visit', href: '/contact' },
            { primary: 'Selangor', secondary: 'Selangor', href: '/contact' },
          ],
        },
        readAndLearn: {
          heading: 'Read and learn',
          items: [
            { primary: 'Heritage', secondary: 'The story since 2007', href: '/heritage' },
            { primary: 'Engineering Folio', secondary: 'Our point of view', href: '/why-coolman' },
            { primary: 'Field Notes', secondary: "Cuts we've made", href: '/field-notes' },
            { primary: 'The Brotherhood', secondary: 'Dealer philosophy', href: '/brotherhood' },
          ],
        },
        catalogueAndTrade: {
          heading: 'Catalogue and trade',
          items: [
            { primary: 'Browse the catalogue', secondary: '247 SKUs', href: '/products' },
            { primary: 'Blade finder', secondary: 'By material', href: '/products' },
            { primary: 'Trade account', secondary: 'Sign in', href: '/auth/login' },
            { primary: 'Apply to carry Coolman', secondary: 'Dealer enquiry', href: '/trade' },
          ],
        },
      },
      baseBar: {
        manufacturedIn: 'Manufactured in Selangor, Malaysia',
        distributorLineTemplate: '{legalEntity} is the sole Malaysian distributor for Shibuya KK, Hiroshima.',
        legalLinks: {
          privacy: 'Privacy',
          terms: 'Terms of sale',
          returns: 'Returns and warranty',
          cookies: 'Cookies',
        },
      },
      rightsReservedSuffix: 'All rights reserved.',
    },
    manifesto: {
      line1: "A blade is the answer to a question the contractor hasn't fully asked yet.",
      line2: "Don't just sell the product. Solve the problem.",
      line3: 'The worksite tells the truth.',
    },
    homeNarrative: {
      opening: {
        eyebrow: 'Coolman · Manufacturer of cutting tools · Selangor, 2007',
        headlinePrefix: 'Right Job ',
        headlineEmphasis: 'Matched with the Right Blade.',
        lede: 'Coolman has built diamond blades, core bits and cutting systems in Malaysia since 2007. Our founder, Alan, has been in the cutting trade since 1998. Every blade we make is engineered for the rock, the rebar and the schedule Malaysian contractors face.',
        ctaPrimary: 'Speak to engineering',
        ctaSecondary: 'Browse the tools',
      },
      heroCard: {
        corner: 'FIELD NOTE № 014',
        eyebrow: 'Cover story · October 2025',
        title: 'Cutting the Merdeka 118 podium slab without losing a segment.',
        rows: [
          { key: 'Site', value: 'Merdeka 118 podium, KL' },
          { key: 'Problem', value: 'European 600 mm wall saw blade glazing on G60 high-silica aggregate after 4 m of cut.' },
          { key: 'Outcome', value: 'Coolman C-Series cobalt sandwich, 12 mm segment, ran 38 m before re-dressing.' },
        ],
        readLabel: 'Read the field note →',
      },
      fearGrid: {
        eyebrow: 'What contractors live with',
        headline: "Four things keep the boss up at night. We've watched all four on site.",
        cards: [
          { key: 'delay', title: 'A delay you cannot explain to the developer', body: 'The blade is slow. The schedule delays. The customer is already calling. We have watched this happen more times than we wish.' },
          { key: 'equipment', title: 'Equipment that fails at 11pm on a road closure', body: "When the cut has to be done tonight and the blade gives out at the wrong moment, the cost isn't the blade. It's the closure, the police, the developer phoning at 6am." },
          { key: 'inconsistency', title: 'Inconsistency between blades that should be identical', body: 'One blade cuts. The next one of the same SKU lasts half as long. The crew loses faith. The supplier loses the account.' },
          { key: 'alone', title: 'Being left alone with a cut nobody else has seen', body: 'A new aggregate. An unusual depth. A spec the supplier has never tested. The crew gets it. The supplier ducks the call.' },
        ],
      },
      threeMythsIntro: {
        eyebrow: 'Three myths',
        headline: 'Three things the cutting trade keeps getting wrong.',
        lede: "The cheap blade costs more by the end of the job. The dealer who's never been on site can't tell you why your blade glazed. And 'Made in Japan' doesn't mean it was made for cutting Malaysian concrete.",
        ctaLabel: 'Read the folio',
      },
      brotherhoodIntro: {
        eyebrow: 'The Brotherhood System',
        headline: 'How we work with the people who buy from us.',
        lede: 'Dealers and contractors who work with Coolman get direct access to engineering, not a points system. If you carry our blades, we treat you like a partner — not a customer number.',
        ctaLabel: 'See the five principles',
      },
      fieldNotesPreview: {
        eyebrow: 'Field Notes',
        headline: 'Three jobs that taught us how to make a better blade.',
        lede: 'These are not case studies. They are the conversations we had on site, the cuts that went wrong, the lessons that ended up engineered into the next batch.',
        cards: [
          { title: 'When the contractor stopped trying, and just called', meta: 'Reinforced concrete · piling · Klang Valley', readingTime: '9 min read' },
          { title: "'If I don't finish tonight, I'm done.'", meta: 'Road cutting · utility cable', readingTime: '7 min read' },
          { title: 'We trusted the factory spec. We should not have.', meta: 'Product recall', readingTime: '6 min read' },
        ],
        ctaLabel: 'Read all Field Notes',
      },
      engineering: {
        eyebrow: 'Engineering',
        pullPrefix: 'Malaysian aggregate is not European aggregate. It ',
        pullEmphasis: 'breaks blades',
        pullSuffix: ' built for Europe.',
        body: [
          'The diamond segment is a wear part. It is engineered to erode at a specific rate so that fresh diamond is continuously exposed to the cut. The matrix — the cobalt-bronze alloy holding the diamond — must wear at the same rate as the work the blade is doing. When the matrix is too hard, the diamond glazes over and the blade stops cutting. When it is too soft, the diamond falls out before it has done its work.',
          'The matrix that works in Europe is calibrated for European aggregate: limestone-based, low-silica, predictable mineralogy. Malaysian aggregate is the opposite. KL crushed granite runs above 60% silica content. The fines are sharper, the inclusion of quartz is higher, and the compressive strength does not predict the cutting behaviour the way a European spec sheet implies it should.',
          "Coolman's response is a cobalt sandwich segment. Three matrix layers of graded hardness, laser-welded to a tensioned high-carbon steel core. The outer layers carry the cutting load. The middle layer is softer cobalt — it releases the diamond before the matrix glazes. The result is a segment that wears at the rate the work demands, not the rate the bond was originally calibrated for.",
          'The argument is unremarkable inside a tool manufacturer. It is rare in this market because most blades sold in Malaysia are imported finished and not re-formulated for what the ground here actually does.',
        ],
        callouts: [
          { num: '62', sup: '%', label: 'Silica content. Malaysian crushed granite, KL aggregate sample, Q2 2024.' },
          { num: '3.1', sup: '×', label: 'Faster matrix wear. European cobalt-bond blades on Malaysian aggregate vs. their home market.' },
          { num: '12', sup: 'mm', label: 'Segment height. Coolman C-Series sandwich cobalt segment, current generation.' },
          { num: '38', sup: 'm', label: 'Cut length before re-dressing on a Merdeka 118 G60 slab. European baseline: 4 m.' },
        ],
        blueprint: {
          drawingNumber: 'DWG · CL-SS-012 · SANDWICH COBALT SEGMENT · CROSS-SECTION',
          scaleNote: 'SCALE 4:1 · ALL DIM. IN MM · REV. C · 2026-04',
          caption: "Sandwich cobalt segment, current generation. Three matrix layers of graded hardness laser-welded to a tensioned high-carbon steel core. The soft centre cobalt releases diamond before the outer matrix glazes — the wear rate matches the work, not the bond's original calibration.",
        },
        workshopPhoto: {
          heading: 'The workshop the bond is built in.',
          body: 'Selangor, Section 14. Every segment we ship is pressed, sintered, and laser-welded in this single building. Every blade returned at end-of-life is sectioned here. The kilns are the same ones Coolman started with — the bond formulations are not.',
        },
      },
      alansLetter: {
        eyebrow: 'A letter from Alan',
        paragraphs: [
          'When I started in the cutting trade in 1998, I thought I knew what a good blade was. Nine years later, when I founded Coolman in 2007, I knew I had been wrong. A good blade is not the one with the best segment formulation on paper. It is the one that finishes the cut on the night the contractor cannot afford to fail.',
          'Coolman is built around that single sentence. Every blade we ship is engineered for the kind of cut that breaks weaker blades: Malaysian aggregate, hard rebar, long pours, monsoon damp, a foreman with three jobs running and no time to nurse a slow tool.',
          'I started Coolman because I had watched too many contractors get sold a blade by someone who had never been on site at 2am. That has not happened to a Coolman customer in 19 years and it never will. If your cut goes wrong, you call me. Not a hotline. Me.',
          'The next pages are not marketing. They are how we work, what we have learned, and the jobs that taught us. If you read them and we still feel right for your worksite, we should talk.',
        ],
        signature: 'Alan',
        signatureLine2: 'Founder, Coolman',
      },
      quietDoor: {
        eyebrow: 'The quiet door',
        headline: 'The full range, in stock and ready to ship from Selangor.',
        lede: 'No catalogue front. No PDF download chase. Just the inventory, the spec, and a phone call away if the blade you need is not the one we list.',
        stats: [
          { key: 'sku', value: '247', label: 'SKUs in stock' },
          { key: 'diameter', value: '100 to 900 mm', label: 'Diameter range' },
          { key: 'onTimePct', value: '~500', label: 'Active accounts' },
          { key: 'dispatchCutoff', value: '2 days', label: 'Dispatch from Selangor' },
        ],
        ctaPrimary: 'Open the catalogue',
        ctaSecondary: 'Speak to engineering',
      },
      conversation: {
        eyebrow: 'How to start the conversation',
        headline: 'Three ways in. WhatsApp is the fastest.',
        lede: "Most cuts begin with a phone call. We don't hide ours.",
        channels: [
          { tag: 'Primary', title: 'Engineering desk on WhatsApp', body: 'Send a photo of the cut, the aggregate, the blade. We will tell you what we think before we tell you what we sell.', ctaLabel: 'Open WhatsApp' },
          { tag: 'Office', title: 'Selangor office line', body: 'Speak to the team about an order, a dispatch, a returns question. Mon to Fri 9:00am–6:00pm · Saturday 9:00am–1:00pm.', ctaLabel: 'Call the office' },
          { tag: 'On site', title: 'Site visit form', body: "If the cut is unusual, we'd rather come and see it than guess. Tell us where and when.", ctaLabel: 'Request a site visit' },
        ],
      },
    },
    heritage: {
      hero: {
        eyebrow: 'Heritage',
        headline: 'Coolman, since 2007. Nineteen years of cuts that taught us how to build the blade.',
        lede: 'A short history of a Malaysian diamond tools company. Founded in Selangor by a tradesman who had been in the cutting trade since 1998.',
      },
      pj2007: {
        eyebrow: 'PJ, 2007',
        headline: 'A workshop on a side road in Selangor.',
        body: [
          'Coolman started in a single rented unit in Selangor in 2007. Two segment presses, a bench, and a phone that rang too often. Alan, the founder, had spent nine years in the cutting trade and had finally heard one complaint too many about blades that did not fit the rock.',
          'The first year was quiet. The second was not. By the end of 2008, the workshop was running two shifts.',
        ],
      },
      founding: {
        eyebrow: 'The founding decision',
        headline: 'After nine years in the trade, a tradesman started his own.',
        body: [
          'Alan had been selling other companies\' blades since 1998. He had watched the same three things go wrong on site, again and again. Price as the proxy for value. Dealers who had never held a blade. Imported blades that performed in Japan and failed in Selangor.',
          'In 2007, he stopped explaining other people\'s blades and started making his own. Coolman is the result.',
        ],
      },
      workshopDay: {
        eyebrow: 'The day it stopped being a workshop',
        headline: 'A piling job that ended in a redesign.',
        note: 'Year TBC. Alan to supply.',
        body: [
          "A contractor in Shah Alam called at 11pm. The blade we'd sold him that morning had not made it through the second pile. Alan drove out. He watched the cut. The aggregate was sharper than the spec had predicted. The bond was wrong.",
          'The blade was redesigned over the next four weeks. The new formulation, sandwich cobalt, became what the CM-X line is built on today. The workshop became a manufacturer the day Alan accepted that the contractor was right and the spec sheet was wrong. (Year TBC. Alan to supply.)',
        ],
      },
      shibuyaYears: {
        eyebrow: 'Twelve years with Shibuya',
        headline: 'Signed 2014. Renewed every year since.',
        body: [
          'In 2014 Coolman signed the exclusive Malaysian distribution agreement for Shibuya core drills. Twelve years on, it has been renewed every year. The same machines built in Japan since 1923, supported by a Malaysian engineering team that has seen the cuts they actually do.',
          'Shibuya makes the drill. Coolman makes sure the drill is the right answer to the cut in front of you.',
        ],
      },
      hardestYear: {
        eyebrow: 'The hardest year',
        headline: 'The product recall, and what came after.',
        body: [
          'In one production batch, the wrong bonding agent was used. The blades passed factory test. They failed on site. We recalled every unit, replaced every one, and wrote off the cost.',
          "What we kept was the customer base. Not one Brotherhood dealer left. The contractors who got the failed blade got the replacement, the apology, and a free second blade. Most of them are still with us. Business isn't a race for who can grow fastest. It's a question of who can endure longest.",
        ],
      },
      twentyYears: {
        eyebrow: 'Twenty years from now',
        headline: "What we want Coolman to be when Alan's children run it.",
        body: [
          'The same company. Larger inventory. More Field Notes in the archive. The same direct line to engineering. The same answer when a contractor calls at 11pm.',
          'Coolman is built to outlast its founder. That is the only metric of success we trust.',
        ],
      },
      timeline: {
        eyebrow: 'The timeline',
        headline: 'Nineteen years on one page.',
        events: [
          { year: '1998', title: 'Alan enters the cutting trade', body: 'Nine years of selling other companies\' blades begins.' },
          { year: '2007', title: 'Coolman founded in Selangor', body: 'Two segment presses, a bench, a phone.' },
          { year: 'TBC', title: 'Sandwich cobalt formulation developed', body: 'After a piling job in Shah Alam taught us the spec sheet was wrong.', note: 'Alan to supply year' },
          { year: '2014', title: 'Shibuya exclusive distribution signed', body: 'Renewed every year since.' },
          { year: 'TBC', title: 'SIRIM certification awarded', body: 'Independent verification of the bonding spec.', note: 'Alan to supply year' },
          { year: '2026', title: '247 SKUs in stock, ~500 active accounts', body: 'Dispatched from Selangor within 2 business days.' },
        ],
      },
    },
    fieldNotes: {
      indexHero: {
        eyebrow: 'Field Notes',
        headline: 'Three jobs that taught us how to make a better blade.',
        lede: 'Written by Coolman Engineering. Filed as they happened. Nothing in these notes is hypothetical.',
      },
      index: {
        eyebrowPrefix: 'Field Notes',
        eyebrowSincePrefix: 'Since',
        eyebrowPublishedSuffix: 'published',
        filterAll: 'All notes',
        filterAllShort: 'All',
        sortLabel: 'Sort',
        sortRecent: 'Most recent',
        sortOldest: 'Oldest first',
        archiveHeading: 'Archive',
        archiveHeadingNote: 'Earlier notes, by year.',
        featuredBadge: 'Latest note',
        readMore: 'Read the note',
        emptyHeadline: 'No Field Notes yet.',
        emptyBody: 'New notes are filed when a job teaches us something worth writing down. Check back soon.',
      },
      article: {
        back: 'Back to Field Notes',
        breadcrumbHome: 'Coolman',
        breadcrumbFieldNotes: 'Field Notes',
        filedUnderLabel: 'Filed under',
        bylineLabel: 'Written by',
        publishedLabel: 'Published',
        readTimeUnit: 'min read',
        relatedHeading: 'Mentioned in this Field Note',
        relatedLede: 'The products the engineer specified on this job.',
        sharePrefix: 'Share this note',
        missingTitle: 'Note not available',
        missingBody: 'This Field Note is not currently available. It may be in draft, or the link is stale.',
      },
      byline: 'Coolman Engineering',
      filedUnder: 'Filed under Coolman Malaysia Sdn Bhd · Selangor · Manufactured in Malaysia',
      pileCutting: {
        title: 'When the contractor stopped trying, and just called',
        meta: 'Reinforced concrete · piling · Klang Valley',
        readingTime: '9 min read',
        pullQuote: "Many times, contractors think it's a product problem. In fact, it's a system problem.",
        sections: [
          { heading: 'The call', paragraphs: [
            "The foreman called the engineering desk at 4:48pm. He had been cutting reinforced concrete piles for a Klang Valley development since the morning. The blade he was using, not ours, had stopped advancing. He was on the third blade of the day.",
            "He did not ask for a quote. He asked if we could come and look.",
          ] },
          { heading: 'What we did before quoting', paragraphs: [
            "An engineer drove out the same evening. He looked at the aggregate, the rebar density, the saw, the cooling, and the way the blade had glazed. He took two photos and sent them back to the workshop.",
            "We did not quote that night. We told the foreman what we thought was wrong and that we would call him in the morning.",
          ] },
          { heading: 'What the worksite told us', paragraphs: [
            "The aggregate was harder than the spec had said. The blade he had been using was bonded for general concrete. The bond had glazed because the diamond was not exposing fast enough on this rock.",
            "The problem was not the contractor. The problem was that the supplier had sold him a blade for a job they had not seen.",
          ] },
          { heading: 'What changed', paragraphs: [
            "We delivered a CM-X Pro 350 Hard-Bond the next morning. The foreman cut the remaining piles in two days, on time, on budget.",
            "We did not charge for the engineer\'s visit. The contractor became a Brotherhood account three weeks later.",
          ] },
          { heading: 'The lesson', paragraphs: [
            "We engineered a sharper bond profile into the next batch of CM-X Pro 350 Hard-Bond, on the strength of what we saw on that pile.",
            "A blade is the answer to a question the contractor has not fully asked yet. Our job is to ask it for him.",
          ] },
        ],
      },
      midnightRoad: {
        title: "'If I don't finish tonight, I'm done.'",
        meta: 'Road cutting · utility cable',
        readingTime: '7 min read',
        pullQuote: "Contractors don't always need a supplier. Sometimes they need someone willing to stand with them when the job goes hard.",
        sections: [
          { heading: 'The call', paragraphs: [
            "10:42pm. A road closure permit that expired at 6am. A utility cable that had to be exposed before then. The blade the crew was using had snapped on the second cut.",
            "The foreman was not panicking on the phone. He was past panicking. He was calm in a way that told us he was about to lose the job.",
          ] },
          { heading: 'What we did', paragraphs: [
            "We dispatched a CM-X Road 450 from the Selangor warehouse. An engineer met the crew on site at 12:10am. He inspected the saw, set the blade, watched the first cut.",
            "He stayed on site until 4am.",
          ] },
          { heading: 'What happened', paragraphs: [
            "The crew finished at 5:36am. The road reopened on time. The developer never knew.",
            "The foreman called Alan at 9am the next morning. He did not want to thank him. He wanted to know what it would take to buy his blades for every job from now on.",
          ] },
          { heading: 'The lesson', paragraphs: [
            "A blade is a product. A delivered cut at 4am is something else. Coolman is built around the second one.",
          ] },
        ],
      },
      productRecall: {
        title: 'We trusted the factory spec. We should not have.',
        meta: 'Product recall',
        readingTime: '6 min read',
        pullQuote: "What destroys a brand isn't a single loss. It's the moment a customer stops believing you.",
        sections: [
          { heading: 'What went wrong', paragraphs: [
            "One batch. One bonding agent that had been substituted at the supplier without our knowledge. The blades passed our standard factory test. They failed on site within the first 20% of the rated cut life.",
            "We had shipped 312 units.",
          ] },
          { heading: 'What we did', paragraphs: [
            "We called every customer who had taken a blade from that batch. Not emailed. Called.",
            "We replaced every blade. We added a second blade, free, to every account. We absorbed the freight, the inspection, and the engineer time.",
          ] },
          { heading: 'What it cost', paragraphs: [
            "More than the year\'s profit on the line.",
            "Not one Brotherhood dealer left. Three new dealers signed up in the next six months because they had heard how we handled it.",
          ] },
          { heading: 'The lesson', paragraphs: [
            "We changed the supplier qualification process. Every bonding agent change at any tier now triggers a full re-test before it can enter the manufacturing line.",
            "A brand is what you do when no one would have known if you had stayed quiet.",
          ] },
        ],
      },
    },
    engineeringFolio: {
      indexHero: {
        eyebrow: 'Engineering folio',
        headline: 'Why we make the blade the way we make it.',
        lede: 'Three pieces written by Coolman Engineering. The thinking behind the product, the manufacturing, and the way we work with our customers.',
      },
      threeMyths: {
        title: 'Three things the cutting trade keeps getting wrong',
        readingTime: '14 min read',
        pullQuote: 'The choice, in the end, is between buying the myth and buying the cut.',
        sections: [
          { heading: 'A word on the people who repeat them', paragraphs: [
            'Every trade has its received wisdom. Diamond cutting has three pieces of it that have been repeated so often they sound true. They are not.',
            'We have spent 19 years watching these three ideas cost contractors money, time, and reputation. This folio is our attempt to lay them out plainly.',
          ] },
          { heading: 'Myth 1: Price tells you what the blade is worth.', paragraphs: [
            'The cheapest blade on a hard cut becomes the most expensive blade by lunchtime. The crew is paid. The site is on a schedule. The replacement is shipped twice. Price per blade is the wrong metric. Cost per cut is the only metric that matters.',
            "We price our blades to last. The contractor who works that out becomes a Brotherhood customer for life.",
          ] },
          { heading: 'Myth 2: The dealer with the loudest catalogue is the partner.', paragraphs: [
            "A dealer who sells eight brands is not a partner. A dealer who has cut concrete is. The Brotherhood System exists because we believe the relationship between the dealer and the engineer matters more than the relationship between the dealer and the catalogue.",
            "Half our dealers have been on site with us inside the last 12 months. That is the number we measure.",
          ] },
          { heading: 'Myth 3: Made in Japan means right for Malaysia.', paragraphs: [
            "Japanese diamond technology is excellent. The aggregate it was developed for is not the aggregate Malaysian sites cut. Our CM-X line is engineered for Malaysian rock: higher silica, harder rebar, longer pours.",
            "We carry Shibuya machines because Shibuya makes the best drill in the trade. We make our own blades because no one else was making the blade Malaysian aggregate needed.",
          ] },
          { heading: 'What this means for the way we sell', paragraphs: [
            "We do not lead with price. We lead with the cut. If the cut is right, the price is right. If the cut is wrong, the cheap blade becomes the most expensive one on the job.",
          ] },
          { heading: 'Why this matters', paragraphs: [
            "A blade is bought once. A relationship with the people who make it is bought every year. The choice, in the end, is between buying the myth and buying the cut.",
          ] },
        ],
      },
      malaysianAggregate: {
        title: 'Malaysian aggregate breaks European blades',
        readingTime: '13 min read',
        pullQuote: "The blade doesn't care what the spec sheet says. It cares what the rock does.",
        sections: [
          { heading: 'The rock under our feet', paragraphs: [
            "Malaysian crushed aggregate runs higher in silica than the European reference rock most diamond blades are engineered for. The figure we work to is around 60 to 65% silica content, to verify against the latest quarry data.",
            "Higher silica is harder on the diamond. It glazes weaker bonds. It exposes the diamond too slowly. The blade does not cut. It rubs.",
          ] },
          { heading: 'What that does to a blade', paragraphs: [
            "A blade engineered for the European spec arrives in Selangor and runs hot. The bond glazes. The diamond stops exposing. The crew complains about a slow blade. The supplier blames the saw, the operator, or the water.",
            "The real answer is the rock. It is harder than the bond was designed for.",
          ] },
          { heading: 'Sandwich cobalt: the answer we built', paragraphs: [
            "The CM-X line is built on a sandwich cobalt construction. A harder cobalt core, softer cobalt outer layers. The diamond exposes at the rate the aggregate needs. The blade self-sharpens through the cut.",
            "It is more expensive to manufacture. It is the only honest answer to the rock Malaysian contractors actually cut.",
          ] },
          { heading: 'What the spec sheet does not say', paragraphs: [
            "We have stopped trying to match European spec on paper. We match the cut on site. Every CM-X SKU is tested against Malaysian aggregate before it ships.",
            "The blade does not care what the spec sheet says. It cares what the rock does.",
          ] },
        ],
      },
      brotherhood: {
        title: 'The Brotherhood System',
        readingTime: '11 min read',
        pullQuote: "We don't grow by signing dealers. We grow by keeping the ones who have stood with us on bad days.",
        sections: [
          { heading: 'What it is, and what it is not', paragraphs: [
            "The Brotherhood System is the working agreement between Coolman and the people who carry our blade to the worksite. Dealers, foremen, and the operators who actually mount the blade and start the cut.",
            "It is not a loyalty programme. It is not a discount tier. It is the principle that the relationship between us and the people who use our blades is more important than the volume on the invoice.",
          ] },
          { heading: 'Principle 1: We do not sell what we have not cut.', paragraphs: [
            "Every CM-X SKU has been cut by a Coolman engineer on Malaysian aggregate before it enters the catalogue. We do not sell blades from a brochure.",
          ] },
          { heading: 'Principle 2: We answer the call.', paragraphs: [
            "Our engineering desk is on WhatsApp. The reply time is measured in minutes, not hours. If the foreman has a photo of a cut that is not working, we want to see it.",
          ] },
          { heading: 'Principle 3: We stand the cost when we are wrong.', paragraphs: [
            "If a Coolman blade fails before its rated life on a cut we approved, we replace it. The contractor does not eat the cost of our mistake.",
          ] },
          { heading: 'Principle 4: We share what we learn.', paragraphs: [
            "Field Notes is not marketing. It is the lessons from the jobs that taught us. We publish them so the next contractor does not have to learn the same lesson the hard way.",
          ] },
          { heading: 'Principle 5: We grow slowly, on purpose.', paragraphs: [
            "We are not building the biggest diamond tools company in Malaysia. We are building the one that is still here in 20 years, with the same direct line between the foreman and the engineer.",
          ] },
        ],
      },
    },
    catalogueIntro: {
      eyebrow: 'Catalogue',
      headline: 'The full range, in stock and ready to ship from Selangor.',
      lede: "247 SKUs across diamond blades, core drills, and segment systems. Use the filters to narrow by material, application, or diameter. If the cut you're planning isn't obvious from the range, the engineering desk is faster than the form.",
      tradeNote: 'Trade accounts get tier pricing and reorder history. Apply through the Trade page.',
      filters: {
        materialLabel: 'Material',
        applicationLabel: 'Application',
        diameterLabel: 'Diameter',
        diameterUnit: ' mm',
      },
    },
    priceGate: {
      signInToSeePricing: 'Sign in to see pricing',
      verificationPending: 'Verification pending',
      contractPricingHint: 'Contract pricing will appear once your email is verified.',
      resendVerification: 'Resend verification email',
      listPrice: 'List price',
      yourTierDiscount: 'Your tier discount',
      promo: 'Promo',
      yourPrice: 'Your price',
    },
    productPageTemplate: {
      categoryEyebrow: 'Diamond blade',
      tagline: 'For hard reinforced concrete on long Malaysian pours.',
      heroSpecBlock: {
        diameterLabel: 'Diameter',
        bondLabel: 'Bond',
        segmentLabel: 'Segment height',
        flangeLabel: 'Flange',
      },
      whatItsFor: {
        heading: 'What this blade is for',
        body: 'Reinforced concrete with high silica aggregate. Piling, slab cutting, hard precast. Engineered for Malaysian rock and the long pours that come with monsoon damp.',
      },
      whenToChoose: {
        heading: 'When to choose this over alternatives',
        body: 'Choose CM-X Pro 350 Hard-Bond when the cut is slow on a general-purpose blade and the aggregate is sharper than the spec predicted. If the cut runs softer, see CM-X Pro 350 Medium-Bond.',
      },
      specsTable: {
        heading: 'Specifications',
        rows: [
          { key: 'Diameter', value: '350 mm' },
          { key: 'Bond', value: 'Hard, sandwich cobalt' },
          { key: 'Segment height', value: '10 mm' },
          { key: 'Flange', value: '25.4 mm' },
          { key: 'Rated cut life', value: 'Up to 240 m on reinforced concrete' },
          { key: 'Manufactured in', value: 'Selangor, Malaysia' },
        ],
      },
      unusualCuts: {
        heading: 'For unusual cuts',
        body: 'If your cut is unusual, send us a photo. Engineering will tell you what they think before they tell you what we sell.',
        ctaLabel: 'Send a photo on WhatsApp',
      },
    },
    tradePage: {
      hero: {
        eyebrow: 'Trade',
        headline: 'For dealers and trade buyers. The relationship matters more than the order.',
        lede: 'Two ways to work with Coolman. The right one depends on whether you want a supplier or a partner.',
      },
      tiers: {
        buyer: {
          title: 'Trade buyer',
          body: 'Access to the full Coolman catalogue at trade pricing. Same-day dispatch from Selangor before 2pm.',
          bullets: ['Full catalogue access', 'Trade pricing', 'Same-day dispatch'],
        },
        dealer: {
          title: 'Brotherhood dealer',
          body: 'Everything the trade buyer gets, plus joint site visits, exclusive territory in agreed regions, and a direct line to engineering for your customers.',
          bullets: ['Trade pricing + Brotherhood tier', 'Joint site visits with engineering', 'Direct line for your customers', 'Exclusive territory by agreement'],
        },
      },
      application: {
        eyebrow: 'How to apply',
        headline: 'Four steps. We will be honest about whether the fit is right.',
        steps: [
          { title: '1. Send your business profile', body: 'Tell us who you are, where you operate, and what you cut. A short message is enough to start.' },
          { title: '2. We come and see you', body: 'For Brotherhood applications, we visit your premises or a site you are working on.' },
          { title: '3. We agree the terms', body: 'Pricing, territory, support. Nothing complicated, all in writing.' },
          { title: '4. We start working', body: 'A first order, an engineering introduction to your customers, and a working relationship.' },
        ],
        ctaLabel: 'Start the conversation',
      },
    },
    contactPage: {
      hero: {
        eyebrow: 'Contact',
        headline: 'Most cuts begin with a phone call. We do not hide ours.',
        lede: 'Three ways to reach Coolman. The engineering desk on WhatsApp is the fastest.',
      },
      channels: [
        { tag: 'Primary', title: 'Engineering desk on WhatsApp', body: 'Photos welcome. Replies in minutes during office hours.', ctaLabel: 'Open WhatsApp' },
        { tag: 'Office', title: 'Selangor office line', body: 'For orders, dispatch and returns questions.', ctaLabel: 'Call the office' },
        { tag: 'Site', title: 'Site visit request', body: 'If the cut is unusual, an engineer will come and see it.', ctaLabel: 'Request a site visit' },
      ],
      hours: {
        heading: 'Office hours',
        line1: 'Mon to Fri, 9:00am to 6:00pm · Saturday 9:00am to 1:00pm',
        line2: 'Same-day dispatch cut-off at 2:00pm',
      },
    },
    aboutPage: {
      hero: {
        eyebrow: 'About',
        headline: 'Diamond cutting tools. Designed in Malaysia, for Malaysia.',
        lede: 'Coolman has been built in Selangor since 2007. We make diamond blades, core bits and segment systems for Malaysian contractors. Around 500 active accounts. Same range, same direct line to engineering, for 19 years.',
      },
      founded: { value: '2007', label: 'Founded in Selangor' },
      builtIn: { value: 'Selangor', label: 'Where the blade is made' },
      accounts: { value: '~500', label: 'Active accounts' },
    },
    legal: {
      draftBadge: 'Draft',
      privacy: { title: 'Privacy', lede: 'How Coolman handles the personal information of contractors, dealers and site visitors. Plain English. No surprises.' },
      terms: { title: 'Terms of sale', lede: 'The terms under which Coolman Malaysia Sdn Bhd sells diamond cutting tools to trade and Brotherhood customers in Malaysia.' },
      returns: { title: 'Returns and warranty', lede: 'How to return a Coolman blade, what the warranty covers, and what to do if a blade fails before its rated life.' },
      cookies: { title: 'Cookie notice', lede: 'The cookies our site uses, what they do, and how to switch them off if you prefer.' },
    },
    seo: {
      home: { title: 'Diamond Cutting Blades & Core Bits Malaysia · Coolman Selangor', description: 'Diamond blades, core bits and segment systems for concrete, granite and tile. 247 in stock, dispatched from Selangor (Klang Valley) within 2 business days.' },
      heritage: { title: 'Heritage · Diamond tool makers in Selangor since 2007 · Coolman', description: 'How Coolman has built diamond cutting blades in Selangor since 2007, founded by a tradesman in the cutting trade since 1998.' },
      whyCoolman: { title: 'Why Coolman · Diamond blades built for Malaysian concrete', description: 'Why our blades outlast imported ones on Malaysian aggregate. Three myths about price, dealers, and Made in Japan, answered straight.' },
      fieldNotes: { title: 'Field Notes · Diamond blade case studies from Malaysian sites', description: 'Real cutting jobs: reinforced concrete piling, road cutting at night, and a blade that glazed. What each one taught us about the blade.' },
      catalogue: { title: 'Diamond Blades & Core Bits Malaysia · 247 in stock · Coolman', description: 'Browse 247 diamond blades, core bits and segment systems for concrete, granite, tile and asphalt. Filter by material, application or diameter.' },
      productTemplate: { title: 'Diamond blade specs & application · Coolman Malaysia', description: 'Specification, material match and engineering notes for Coolman diamond blades and core bits. Dispatched from Selangor within 2 business days.' },
      trade: { title: 'Trade & dealer pricing · Coolman diamond blades Malaysia', description: 'Trade-buyer and Brotherhood dealer programmes: tier pricing, reorder terms and territory. Apply in four steps.' },
      contact: { title: 'Contact Coolman · WhatsApp the engineering desk, Selangor', description: 'Reach Coolman in Selangor: WhatsApp the engineering desk, call the office, or request a site visit. Most cuts begin with a phone call.' },
      about: { title: 'About Coolman · Diamond tools made in Selangor since 2007', description: 'Coolman makes diamond cutting blades, core bits and segment systems in Selangor. Around 500 active trade accounts since 2007.' },
      shibuya: { title: 'Shibuya Core Drill Machines Malaysia · Concrete Coring · Coolman', description: 'Shibuya core drill machines for concrete coring, from Coolman, exclusive Malaysian distributor since 2014. Specs, models and demo requests.' },
      privacy: { title: 'Privacy · Coolman', description: 'How Coolman handles your personal information.' },
      terms: { title: 'Terms of sale · Coolman', description: 'The terms under which Coolman Malaysia Sdn Bhd sells in Malaysia.' },
      returns: { title: 'Returns and warranty · Coolman diamond blades', description: 'Returning a Coolman blade, the warranty cover, and what to do if a blade fails before its rated life.' },
      cookies: { title: 'Cookie notice · Coolman', description: 'The cookies our site uses and how to switch them off.' },
      folioThreeMyths: { title: 'Three things the cutting trade keeps getting wrong', description: 'A Coolman Engineering folio on price, dealers, and the Made in Japan myth.' },
      brotherhood: { title: 'Coolman dealers near you · Diamond blade stockists in Malaysia', description: 'Find your nearest authorised Coolman dealer. Filter by area, message on WhatsApp, or open the address in Maps.' },
    },
    brotherhoodDirectory: {
      hero: {
        eyebrow: 'The Brotherhood directory',
        headline: 'Authorised Coolman dealers across Malaysia.',
        lede: 'The people who carry our blade to the worksite. Filter by area, message on WhatsApp, or open the address in Maps.',
      },
      filter: {
        allLabel: 'All areas',
        label: 'Filter by area',
      },
      emptyState: {
        headline: 'Brotherhood directory launching soon.',
        body: 'Call sales for your nearest authorised dealer while we onboard the first cohort.',
        ctaLabel: 'Message sales on WhatsApp',
      },
    },
    killSwitch: {
      message: 'Orders are paused right now. Reach us on WhatsApp to place a request.',
      ctaLabel: 'Message us on WhatsApp',
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
      fieldNotes: 'Catatan Lapangan',
      signIn: 'Log Masuk',
      signOut: 'Log Keluar',
      createAccount: 'Buka akaun',
      diamondTools: 'Alat Berlian',
      shibuyaCoreDrills: 'Penggerudi Teras Shibuya',
      account: 'Akaun',
      switchToBM: 'Tukar ke Bahasa Malaysia',
      switchToEN: 'Tukar ke Bahasa Inggeris',
      heritage: 'Warisan',
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
      viewBladesPrefix: 'Lihat',
      viewBladesSuffix: 'Bilah',
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
      fallback: {
        hero: {
          badge: 'Dipercayai oleh 500+ Kontraktor Malaysia',
          line1: 'Alat Berlian',
          line2: 'Industri',
          line3: 'Dibina untuk Prestasi',
          subheadline: 'Penyelesaian pemotongan gred industri direka untuk konkrit, granit, marmar dan banyak lagi. Dibina untuk memenuhi standard kontraktor profesional yang menuntut.',
          primaryCtaLabel: 'Terokai Produk',
          secondaryCtaLabel: 'Lihat aplikasi',
          imageAlt: 'Pemotongan bilah berlian',
        },
        applicationList: [
          { id: 'concrete', label: 'Konkrit', image: '/images/blade-concrete.jpg' },
          { id: 'granite', label: 'Granit', image: '/images/blade-granite.jpg' },
          { id: 'marble', label: 'Marmar', image: '/images/blade-granite.jpg' },
          { id: 'tile', label: 'Jubin & Seramik', image: '/images/blade-tile.jpg' },
        ],
        stats: [
          { value: '25+', label: 'Tahun' },
          { value: '500+', label: 'Kontraktor' },
          { value: '50K+', label: 'Projek' },
          { value: '99%', label: 'Tepat Masa' },
        ],
        features: [
          { title: 'Kelajuan Pemotongan Unggul', description: 'Pemotongan 40% lebih pantas berbanding bilah standard.', stat: '40%', statLabel: 'Lebih Pantas' },
          { title: 'Hayat Bilah Panjang', description: 'Teknologi pengikatan proprietari memastikan hayat lebih panjang.', stat: '3×', statLabel: 'Lebih Lama' },
          { title: 'Penghantaran Pantas', description: 'Penghantaran hari yang sama untuk pesanan sebelum 2 petang.', stat: '24j', statLabel: 'Penghantaran' },
          { title: 'Sokongan Teknikal', description: 'Pasukan khusus untuk membantu mengoptimumkan operasi anda.', stat: '24/7', statLabel: 'Sokongan' },
        ],
        ctaSection: {
          headline: 'Sedia Untuk Meningkatkan\nOperasi Anda?',
          subheadline: 'Sertai 500+ kontraktor profesional yang mempercayai Coolman untuk keperluan pemotongan berlian mereka.',
          primaryCtaLabel: 'Minta Perundingan',
          secondaryCtaLabel: 'Muat Turun Katalog',
        },
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
        viewBladesPrefix: 'Lihat',
        viewBladesSuffix: 'Bilah',
        ctaTitle: 'Perlukan Bantuan Memilih Bilah Yang Tepat?',
        ctaMessage: 'Pasukan teknikal kami boleh membantu anda memilih bilah optimum untuk aplikasi dan keadaan pemotongan anda.',
        contactSupport: 'Hubungi Sokongan Teknikal',
        defaultSections: [
          { id: 'concrete', title: 'Pemotongan Konkrit', description: 'Bilah berlian tugas berat yang direka untuk konkrit bertetulang, papak terawat dan elemen struktur.', features: ['Konkrit bertetulang', 'Papak konkrit terawat', 'Blok konkrit', 'Elemen pratuang'] },
          { id: 'granite', title: 'Granit & Batu Asli', description: 'Bilah ketepatan untuk memotong meja granit, batu asli dan bahan batu keras.', features: ['Papak granit', 'Batu asli', 'Batu keras', 'Permukaan kuarza'] },
          { id: 'marble', title: 'Marmar & Batu Lembut', description: 'Segmen khusus untuk pemotongan bersih dan bebas serpihan pada marmar, batu kapur dan batu lembut.', features: ['Papak marmar', 'Batu kapur', 'Travertin', 'Batu lembut'] },
          { id: 'tile', title: 'Jubin & Seramik', description: 'Bilah berlian halus untuk pemotongan tepat pada porselin, jubin seramik dan kaca.', features: ['Jubin porselin', 'Jubin seramik', 'Jubin kaca', 'Kerja mozek'] },
          { id: 'asphalt', title: 'Pemotongan Asfalt', description: 'Bilah tahan lasak yang direka untuk kerja jalan, lapisan asfalt dan pemotongan turapan.', features: ['Pembaikan jalan', 'Pemotongan turapan', 'Lapisan asfalt', 'Parit utiliti'] },
          { id: 'brick', title: 'Bata & Tembok', description: 'Bilah serba guna untuk memotong bata, blok dan bahan tembok am.', features: ['Bata tanah liat', 'Blok konkrit', 'Penurap', 'Dinding tembok'] },
        ],
      },
      whyCoolman: {
        hero: {
          eyebrow: 'Folio Kejuruteraan',
          title: 'Tiga hujah.',
          titleEmphasis: 'Satu industri.',
          lede: 'Tiga hujah yang menetapkan pendirian Coolman dalam industri pemotongan. Mitos yang masih diajar industri. Hujah untuk memadankan ikatan dengan agregat Malaysia. Falsafah Brotherhood.',
        },
        folio01: {
          folioLabel: 'Folio Kejuruteraan №01',
          category: 'Pendirian industri',
          title: 'Tiga perkara yang industri pemotongan terus',
          titleEmphasis: 'tersalah.',
          summary: 'Selepas hampir tiga puluh tahun dalam industri alat berlian Malaysia, tiga kepercayaan diulang begitu kerap hingga kedengaran seperti kebijaksanaan. Ia tidak.',
          metaAuthor: 'Coolman Engineering',
          metaSubject: 'Pendirian industri',
          metaRead: 'Bacaan 1 minit',
          paragraphs: [
            'Tiga kepercayaan menguasai perbualan jualan dalam industri pemotongan Malaysia. Pelanggan hanya peduli harga. Lebih banyak pengedar bermakna lebih banyak pertumbuhan. Buatan Jepun mengalahkan Buatan China. Setiap satu diulang begitu kerap hingga kedengaran seperti kebijaksanaan. Setiap satu salah.',
            'Bilah berharga RM300. Sehari kelewatan pada projek cerucuk Lembah Klang boleh kos RM10,000 dalam penalti sebelum mengira pekerja yang terbiar. Apabila kontraktor tolak pada harga, mereka bertanya sama ada boleh percaya pembekal — bukan sama ada bilah murah. Tentang pengedar: menjelang tahun lima pengembangan agresif, margin mampat, perkhidmatan merosot, dan jenama bernilai kurang daripada semasa ia bermula. Tentang negara asal: variasi dalam pengeluaran sesebuah negara kini lebih besar daripada jurang purata antara negara.',
            'Mitos-mitos ini bertahan kerana ia membolehkan pembekal elak perbualan yang lebih sukar. Kontraktor yang kekal menguntungkan paling lama sudah berhenti mempercayainya.',
          ],
          pullquote: 'Perbualan itu tidak pernah tentang bilah.',
        },
        folio02: {
          folioLabel: 'Folio Kejuruteraan №02',
          category: 'Teknikal',
          title: 'Agregat Malaysia memecahkan',
          titleEmphasis: 'bilah Eropah.',
          summary: 'Hujah teknikal tentang kenapa bilah yang direka untuk konkrit Eropah berprestasi rendah di tapak Malaysia, dan apa yang perlu dilakukan.',
          metaAuthor: 'Coolman Engineering',
          metaSubject: 'Reka bentuk ikatan · Komposisi agregat',
          metaRead: 'Bacaan 1 minit',
          paragraphs: [
            'Bilah berlian tidak memotong — ia menggosok. Berlian dalam segmen mengikis bahan; apabila ia tumpul, ikatan di sekelilingnya haus untuk mendedahkan berlian segar di bawah. Segalanya bergantung pada memadankan kekerasan ikatan dengan betapa keras bahan yang dipotong.',
            'Konkrit Malaysia didominasi granit. Granit mempunyai kandungan silika tinggi — lebih menggosok daripada agregat batu kapur yang mengkalibrasi kebanyakan bilah Eropah. Formulasi ikatan yang betul untuk konkrit Eropah adalah, pada granit Malaysia, terlalu lembut. Ia haus lebih cepat daripada reka bentuk. Segmen merosot awal. Kontraktor salahkan pengendali atau mesin. Masalah sebenar berada di hulu: ikatan tidak pernah dipadankan dengan bahan.',
            'Barisan CM-X Coolman menggunakan pembinaan kobalt tiga lapis — setiap lapisan pada kepekatan berlian berbeza. Apabila lapisan luar haus lebih cepat daripada jangkaan reka bentuk Eropah, lapisan dalaman terus mendedahkan berlian segar. Bilah direka untuk agregat yang sebenarnya akan ia potong, bukan agregat pada lembaran spesifikasi Eropah.',
          ],
          pullquote: 'Bilah tidak peduli apa yang lembaran spesifikasi kata. Ia peduli apa yang batu lakukan.',
        },
        folio03: {
          folioLabel: 'Folio Kejuruteraan №03',
          category: 'Falsafah jenama',
          title: 'Sistem',
          titleEmphasis: 'Brotherhood.',
          summary: 'Setiap jenama alat berlian di Malaysia ada rangkaian pengedar. Kebanyakan sudah tidak berfungsi menjelang tahun lima. Ini falsafah operasi yang mengekalkan rangkaian Coolman menguntungkan selama hampir dua dekad.',
          metaAuthor: 'Coolman Engineering',
          metaSubject: 'Falsafah pengedaran',
          metaRead: 'Bacaan 1 minit',
          paragraphs: [
            'Setiap jenama alat berlian di Malaysia ada rangkaian pengedar. Kebanyakan sudah tidak berfungsi menjelang tahun lima. Polanya: pengambilan agresif, diskaun maksimum, tiada perlindungan wilayah. Pengedar bersaing sesama sendiri untuk kontraktor yang sama. Margin mampat. Sesetengah gulung tikar. Yang terselamat potong perkhidmatan untuk terus hidup.',
            'Brotherhood beroperasi secara terbalik. Pengedar lebih sedikit setiap rantau daripada standard industri. Setiap satu dilindungi daripada persaingan langsung pengedar Coolman lain dalam wilayah mereka. Margin dikekalkan pada tahap yang menjadikan pelaburan teknikal rasional. Tiada operasi jualan langsung yang memotong harga asas pengedar kami sendiri.',
            'Kosnya nyata dalam jangka pendek: volum yang hilang, margin yang hilang, disiplin untuk berkata tidak setiap suku. Imbalannya ialah asas pengedar yang, dalam kebanyakan kes, telah membawa Coolman selama bertahun-tahun. Pengalaman itu bertambah menjadi sesuatu yang pesaing tidak mudah boleh tiru.',
          ],
          pullquote: 'Rangkaian pengedar paling stabil menang. Bukan yang terbesar.',
        },
        closingCta: {
          eyebrow: 'Perbualan',
          title: 'Ada pemotongan yang lembaran spesifikasi',
          titleEmphasis: 'tidak boleh jawab?',
          body: 'Hantar gambar kerja, agregat, dan bilah sedia ada. Meja kejuruteraan membalas pada hari kerja yang sama. Jika anda mahu baca lebih lanjut dalam suara yang sama, tiga Field Notes meliputi kerja khusus yang mengajar kami apa yang folio di atas hujahkan.',
          whatsappCtaLabel: 'Buka meja kejuruteraan di WhatsApp',
          fieldNotesCtaLabel: 'Baca Field Notes',
        },
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
        guidesEyebrow: 'Panduan Teknikal',
        guidesHeading: 'Panduan praktikal dari bengkel kami',
        guidesSubheading: 'Artikel praktikal tentang pemilihan bilah, gerudi teras, dan memilih alat pemotong yang sesuai.',
        guidesEmpty: 'Panduan baharu sedang disediakan. Sila kembali tidak lama lagi.',
        readMore: 'Baca artikel',
        publishedOn: 'Diterbitkan',
        backToResources: 'Kembali ke Sumber',
      },
      contact: {
        heroEyebrow: 'Hubungi · Meja kejuruteraan',
        fallbackHeroSubtitle: 'Cara paling pantas untuk menghubungi Coolman ialah meja kejuruteraan di WhatsApp. Untuk pertanyaan am, talian pejabat berfungsi. Untuk lawatan tapak, borang membantu kami bersiap sedia.',
        heroTitle: 'Kebanyakan potongan bermula dengan',
        heroTitleEmphasis: 'satu panggilan telefon.',
        heroLede: 'Cara paling pantas untuk menghubungi Coolman ialah meja kejuruteraan di WhatsApp. Untuk pertanyaan am, talian pejabat berfungsi. Untuk lawatan tapak, borang membantu kami bersiap sedia.',
        channelsEyebrow: 'Tiga saluran · pilih yang sesuai',
        channelsHeadline: 'Setiap saluran sesuai untuk jenis perbualan berbeza.',
        channelsLede: 'WhatsApp untuk jawapan teknikal pantas dan foto. Talian pejabat untuk pertanyaan am dan akaun perdagangan. Borang lawatan tapak apabila anda perlukan jurutera di tapak.',
        channel1Badge: 'Saluran 01 · WhatsApp',
        channel1Title: 'Meja kejuruteraan.',
        channel1Body: 'Hantar foto kerja, agregat, atau bilah sedia ada. Alan atau pasukan teknikal membalas pada hari bekerja yang sama. Laluan paling pantas dari soalan kepada cadangan ikatan.',
        channel1HoursLabel: 'Waktu',
        channel1ResponseLabel: 'Respons',
        channel1LanguagesLabel: 'Bahasa',
        channel1NumberLabel: 'Nombor',
        channel1Hours: 'Isnin hingga Jumaat, 9:00 pagi hingga 6:00 petang · Sabtu 9:00 pagi hingga 1:00 tengah hari',
        channel1Response: 'Biasanya dalam masa satu jam',
        channel1Languages: 'EN · BM',
        channel1Cta: 'Buka WhatsApp',
        channel2Badge: 'Saluran 02 · Talian pejabat',
        channel2Title: 'Hubungi pejabat.',
        channel2Body: 'Untuk pertanyaan am, soalan akaun, dan permohonan perdagangan. Isnin hingga Sabtu, waktu pejabat. Diangkat di meja depan dan dihalakan kepada orang yang betul.',
        channel2NumberLabel: 'Nombor',
        channel2HoursLabel: 'Waktu',
        channel2ResponseLabel: 'Dihalakan ke',
        channel2Hours: 'Isnin hingga Jumaat, 9:00 pagi hingga 6:00 petang · Sabtu 9:00 pagi hingga 1:00 tengah hari',
        channel2Response: 'Jualan, akaun, atau perdagangan',
        channel2Cta: 'Hubungi pejabat',
        channel3Badge: 'Saluran 03 · Lawatan tapak',
        channel3Title: 'Minta lawatan tapak.',
        channel3Body: 'Untuk perundingan khusus projek. Beritahu kami tentang projek, keadaan tapak, dan jangka masa anda. Jurutera membalas dengan slot lawatan yang dicadangkan.',
        channel3FormatLabel: 'Sesuai untuk',
        channel3ResponseLabel: 'Balasan',
        channel3OutputLabel: 'Hasil',
        channel3Format: 'Projek baharu, agregat luar biasa, persiapan tender',
        channel3Response: 'Dalam 2 hari bekerja',
        channel3Output: 'Slot lawatan dicadangkan · jurutera ditugaskan',
        channel3Cta: 'Minta lawatan',
        locationEyebrow: 'Bengkel · Selangor',
        locationHeadline: 'Mesin tekan, relau, dan stesen kimpalan laser.',
        locationLede: 'Pelawat dialu-alukan dengan janji temu. Pasukan teknikal boleh memandu anda melalui mesin tekan, relau segmen, dan stesen kimpalan laser. Tiga mesin yang dilalui oleh setiap bilah yang kami hantar.',
        locationAddressFallback: 'Selangor · Malaysia',
        locationAddressNote: 'Alamat penuh tersedia atas permintaan.',
        locationLabelMonFri: 'Isnin hingga Jumaat',
        locationLabelSat: 'Sabtu',
        locationLabelSun: 'Ahad',
        locationRegPrefix: 'Pendaftaran',
        locationDispatchLabel: 'Tarikh akhir penghantaran tapak',
        locationDispatchSuffix: 'untuk penghantaran hari yang sama dari stok PJ',
        locationOpenInMaps: 'Buka di peta',
        locationMapWorkshop: 'COOLMAN',
        locationMapSince: 'NO. 14 · SEJAK 2007',
        locationMapCity: 'Selangor',
        locationMapCoords: '3.0840° N · 101.6336° E',
        locationOverlayBrand: 'Coolman',
        directLinesEyebrow: 'Talian terus',
        directLinesHeadline: 'Jika anda sudah tahu siapa yang anda perlukan.',
        directLinesLede: 'Tempat hubungan terus untuk empat sebab paling biasa orang menghubungi syarikat. Setiap satu pergi kepada pasukan yang dinamakan, bukan barisan menunggu.',
        directLineSalesLabel: 'Jualan',
        directLineSalesNote: 'Sebut harga, soalan akaun, pertanyaan am.',
        directLinePartsLabel: 'Alat ganti dan pesanan',
        directLinePartsNote: 'Pesanan semula, penghantaran, invois untuk akaun perdagangan.',
        directLineTrainingLabel: 'Latihan dan servis',
        directLineTrainingNote: 'Latihan pengendali, pensijilan, servis Shibuya.',
        directLineCareersLabel: 'Kerjaya',
        directLineCareersNote: 'Permohonan kerja. Terus kepada Alan.',
        formEyebrow: 'Borang lawatan tapak',
        formTitle: 'Beritahu kami tentang projek.',
        formSubtitle: 'Jenis projek, keadaan tapak, jangka masa. Jurutera membalas dengan slot lawatan yang dicadangkan.',
        formNameLabel: 'Nama *',
        formNamePlaceholder: 'Nama anda',
        formCompanyLabel: 'Syarikat',
        formCompanyPlaceholder: 'Nama syarikat',
        formEmailLabel: 'Emel *',
        formEmailPlaceholder: 'nama@syarikat.com',
        formPhoneLabel: 'Telefon',
        formPhonePlaceholder: '+60 12-345 6789',
        formMessageLabel: 'Butiran projek *',
        formMessagePlaceholder: 'Jenis projek, keadaan tapak, agregat jika diketahui, jangka masa sasaran.',
        formSubmit: 'Minta lawatan',
        formSubmitting: 'Menghantar...',
        formSuccess: 'Terima kasih. Kami akan menghubungi anda tidak lama lagi.',
        formError: 'Terdapat ralat. Sila cuba lagi.',
        networkError: 'Ralat rangkaian. Sila semak sambungan anda dan cuba lagi.',
        successTitle: 'Permintaan diterima.',
        successMessage: 'Seorang jurutera akan membalas dengan slot lawatan yang dicadangkan dalam masa dua hari bekerja.',
        sendAnother: 'Hantar permintaan lain',
        infoHeading: 'Hubungi kami',
        phoneTitle: 'Telefon',
        phoneSubtitle: 'Isnin hingga Sabtu, waktu pejabat',
        emailTitle: 'Emel',
        emailSubtitle: 'Kami membalas dalam masa 24 jam',
        officeTitle: 'Pejabat',
        responseTimeLabel: 'Masa respons purata',
        responseTimeSubtitle: 'Semasa waktu perniagaan',
        liveChatLabel: 'Lebih suka WhatsApp?',
        liveChatMessage: 'Hubungi meja kejuruteraan di WhatsApp untuk jawapan teknikal pantas.',
        openWhatsapp: 'Buka WhatsApp',
        whatsappPrefillText: 'Hai, saya ada soalan tentang bilah anda.',
      },
      shibuya: {
        heroEyebrow: 'Shibuya',
        heroPrimaryLabel: 'Terokai Model',
        heroSecondaryLabel: 'Lihat mesin',
        scroll: 'SKROL',
        sincePrefix: 'SEJAK',
        modelsEyebrow: 'RANGKAIAN',
        modelsHeadline: 'Pilih Mesin Anda',
        modelNamePrefix: 'Shibuya',
        motorPowerLabel: 'Kuasa Motor',
        maxDiameterLabel: 'Diameter Maksimum',
        weightLabel: 'Berat',
        anchorLabel: 'Pengangkur',
        rpmRangeLabel: 'Julat RPM',
        voltageLabel: 'Voltan',
        maxDepthLabel: 'Kedalaman Gerudi Maksimum',
        feedSystemLabel: 'Sistem Suapan',
        holeRunoutLabel: 'Runout Lubang',
        bitPairingLabel: 'Padanan Bit Coolman',
        keyFeaturesLabel: 'CIRI UTAMA',
        startingFromLabel: 'Bermula dari',
        requestQuote: 'Minta Sebut Harga',
        downloadSpecSheet: 'Muat Turun Helaian Spesifikasi',
        inActionEyebrow: 'DI LAPANGAN',
        inActionCtaLabel: 'Lihat Aplikasi',
        supportEyebrow: 'SOKONGAN',
        ctaTitle: 'Mahukan Demo Shibuya?',
        ctaMessage: 'Bercakap dengan pasukan kami untuk tunjuk cara langsung dan harga.',
        ctaButton: 'Minta Demo',
        ctaWhatsApp: 'WhatsApp Kami Sekarang',
        ctaAllChannels: 'Semua Saluran Hubungi',
        emptyStateHeadline: 'Senarai akan datang',
        emptyStateBody: 'Rangkaian Shibuya sedang disediakan. Bercakap dengan pasukan kami untuk tunjuk cara langsung.',
        demoFormTitle: 'Minta Demo Shibuya',
        demoFormName: 'Nama Anda',
        demoFormCompany: 'Syarikat',
        demoFormPhone: 'Nombor Telefon',
        demoFormModel: 'Model Mesin yang Diminati',
        demoFormModelPlaceholder: 'Pilih model…',
        demoFormProject: 'Projek / Aplikasi',
        demoFormNotes: 'Nota Tambahan',
        demoFormSubmit: 'Hantar Permintaan',
        demoFormSuccessTitle: 'Permintaan diterima',
        demoFormSuccessBody: 'Pasukan kami akan menghubungi anda dalam satu hari bekerja untuk mengatur demo.',
        demoFormError: 'Sesuatu telah berlaku. Sila cuba lagi atau hubungi kami melalui WhatsApp.',
      },
      productDetail: {
        breadcrumbProducts: 'Produk',
        productTypeFallback: 'Bilah Berlian',
        machinePowerLabel: 'Kuasa mesin',
        quantityLabel: 'Kuantiti',
        recommendedMaterialsHeading: 'Bahan Disyorkan',
        materialBadgeFallback: 'Dalam stok',
        noImageUploaded: 'Tiada gambar dimuat naik',
        noImage: 'Tiada gambar',
        sectionLabels: {
          related: 'Berkaitan',
          relatedHeading: 'Anda Mungkin Perlukan Juga',
          viewAll: 'Lihat Semua',
          openProduct: 'Buka produk',
          universal: 'Universal',
        },
        specs: {
          diameter: 'Diameter',
          arborSize: 'Saiz Arbor',
          segmentHeight: 'Ketinggian Segmen',
          bondType: 'Jenis Ikatan',
          maxRPM: 'RPM Maksimum',
          maxRPMFallback: 'Lihat manual',
          machineTier: 'Tahap Mesin',
        },
        tabs: {
          specifications: 'Spesifikasi Penuh',
          applications: 'Nota Aplikasi',
          usageGuide: 'Panduan Penggunaan',
          parameters: 'Parameter Pemotongan',
          documents: 'Dokumen',
        },
        usageGuide: {
          steps: [
            {
              title: 'Periksa Sebelum Guna',
              body: 'Periksa sebarang retakan, lekukan, atau kerosakan sebelum memasang. Jangan sekali kali guna bilah yang rosak.',
            },
            {
              title: 'Pemasangan Yang Betul',
              body: 'Pastikan saiz arbor sepadan dengan mesin anda. Ketatkan dengan kuat menggunakan flange yang betul.',
            },
            {
              title: 'Tetapkan RPM Yang Betul',
              body: 'Jangan melebihi RPM yang ditetapkan. Lajak melebihi had menyebabkan kerosakan awal.',
              bodyWithMaxRPM: 'Jangan melebihi {maxRPM} RPM. Lajak melebihi had menyebabkan kerosakan awal.',
            },
            {
              title: 'Guna Penyejukan Air',
              body: 'Pemotongan basah memanjangkan jangka hayat bilah dengan ketara. Pemotongan kering hanya disyorkan untuk tempoh pendek.',
            },
          ],
        },
        orderForm: {
          title: 'Buat permintaan pesanan',
          blurb: 'Tiada bayaran sekarang. Alan akan mengesahkan dalam 24 jam dengan harga akhir, masa penyediaan, dan pilihan penghantaran.',
          lineTotal: 'Jumlah baris',
          submitLabel: 'Hantar permintaan pesanan →',
          whatsappLabel: 'WhatsApp meja kejuruteraan',
          orLabel: 'atau',
          footNote: 'Dengan menghantar, anda bersetuju kami boleh menghubungi anda mengenai permintaan ini. Penghantaran dalam 2 hari bekerja · ex-gudang PJ.',
        },
        priceCard: {
          footNote: 'Seunit · excl. SST · ex-gudang Selangor',
        },
        documentsEmpty: 'Tiada dokumen yang dimuat naik untuk produk ini lagi.',
        ctaStrip: {
          heading: 'Sedia membuat pesanan atau perlukan nasihat teknikal?',
          body: 'Jurutera kami sedia membantu anda memilih bilah yang sesuai.',
          primaryLabel: 'Bercakap dengan Jurutera',
          secondaryLabel: 'Minta sebut harga',
        },
        requestQuote: 'Minta sebut harga',
        skuLabel: 'SKU',
        bondLabel: 'Ikatan',
        whatsappEnquiry: 'Hai, saya ingin bertanya tentang {name} (SKU: {sku})',
        documentDownload: 'Muat turun',
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
      searchPlaceholder: 'Cari mengikut nama atau kod produk…',
      searchLabel: 'Cari produk',
      searchClear: 'Kosongkan carian',
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
      columns: {
        reachCoolman: {
          heading: 'Hubungi Coolman',
          items: [
            { primary: 'Meja kejuruteraan', secondary: 'WhatsApp', href: '/contact' },
            { primary: 'Pejabat', secondary: 'Isnin hingga Sabtu', href: '/contact' },
            { primary: 'Lawatan tapak', secondary: 'Minta lawatan', href: '/contact' },
            { primary: 'Selangor', secondary: 'Selangor', href: '/contact' },
          ],
        },
        readAndLearn: {
          heading: 'Baca dan pelajari',
          items: [
            { primary: 'Warisan', secondary: 'Kisah sejak 2007', href: '/heritage' },
            { primary: 'Folio Kejuruteraan', secondary: 'Pandangan kami', href: '/why-coolman' },
            { primary: 'Field Notes', secondary: 'Potongan yang kami lakukan', href: '/field-notes' },
            { primary: 'The Brotherhood', secondary: 'Falsafah pengedar', href: '/brotherhood' },
          ],
        },
        catalogueAndTrade: {
          heading: 'Katalog dan perdagangan',
          items: [
            { primary: 'Lihat katalog', secondary: '247 SKU', href: '/products' },
            { primary: 'Pencari bilah', secondary: 'Mengikut bahan', href: '/products' },
            { primary: 'Akaun perdagangan', secondary: 'Daftar masuk', href: '/auth/login' },
            { primary: 'Mohon membawa Coolman', secondary: 'Pertanyaan pengedar', href: '/trade' },
          ],
        },
      },
      baseBar: {
        manufacturedIn: 'Dibuat di Selangor, Malaysia',
        distributorLineTemplate: '{legalEntity} ialah pengedar tunggal Malaysia bagi Shibuya KK, Hiroshima.',
        legalLinks: {
          privacy: 'Privasi',
          terms: 'Terma jualan',
          returns: 'Pemulangan dan jaminan',
          cookies: 'Kuki',
        },
      },
      rightsReservedSuffix: 'Hak cipta terpelihara.',
    },
    manifesto: {
      line1: 'Bilah adalah jawapan kepada soalan yang belum sepenuhnya ditanya oleh kontraktor.',
      line2: 'Jangan jual produk sahaja. Selesaikan masalah.',
      line3: 'Tapak kerja yang akan beritahu anda kebenaran.',
    },
    homeNarrative: {
      opening: {
        eyebrow: 'Coolman · Pengeluar alat pemotong · Selangor, 2007',
        headlinePrefix: 'Kerja yang Betul ',
        headlineEmphasis: 'Dipadankan dengan Bilah yang Betul.',
        lede: 'Coolman telah membina bilah berlian, mata teras dan sistem pemotongan di Malaysia sejak 2007. Pengasas kami, Alan, telah berada dalam bidang pemotongan sejak 1998. Setiap bilah yang kami hasilkan direka untuk batu, besi tetulang dan jadual yang dihadapi kontraktor Malaysia.',
        ctaPrimary: 'Berbual dengan kejuruteraan',
        ctaSecondary: 'Lihat alat',
      },
      heroCard: {
        corner: 'FIELD NOTE № 014',
        eyebrow: 'Liputan utama · Oktober 2025',
        title: 'Memotong papak podium Merdeka 118 tanpa kehilangan satu segmen pun.',
        rows: [
          { key: 'Tapak', value: 'Podium Merdeka 118, KL' },
          { key: 'Masalah', value: 'Bilah gergaji dinding 600 mm Eropah mengaca pada agregat G60 bersilika tinggi selepas 4 m potongan.' },
          { key: 'Hasil', value: 'Sandwic kobalt C-Series Coolman, segmen 12 mm, berjalan 38 m sebelum menyerut semula.' },
        ],
        readLabel: 'Baca field note →',
      },
      fearGrid: {
        eyebrow: 'Apa yang kontraktor tanggung',
        headline: 'Empat perkara yang menjadikan bos sukar tidur. Kami sudah menyaksi keempat-empatnya di tapak.',
        cards: [
          { key: 'delay', title: 'Kelewatan yang anda tidak boleh jelaskan kepada pemaju', body: 'Bilah perlahan. Jadual tertunda. Pelanggan sudah pun menelefon. Kami sudah lihat ini berlaku lebih kerap daripada yang kami mahu.' },
          { key: 'equipment', title: 'Peralatan yang gagal pada 11 malam semasa penutupan jalan', body: 'Apabila potongan mesti siap malam ini dan bilah putus pada saat yang salah, kos itu bukan bilah. Ia adalah penutupan, polis, dan pemaju yang menelefon pada jam 6 pagi.' },
          { key: 'inconsistency', title: 'Ketidakkonsistenan antara bilah yang sepatutnya serupa', body: 'Satu bilah memotong. Bilah seterusnya dengan SKU yang sama tahan separuh sahaja. Krew hilang keyakinan. Pembekal hilang akaun.' },
          { key: 'alone', title: 'Ditinggalkan keseorangan dengan potongan yang belum pernah dilihat orang lain', body: 'Agregat baru. Kedalaman luar biasa. Spesifikasi yang pembekal tidak pernah uji. Krew faham. Pembekal mengelak panggilan.' },
        ],
      },
      threeMythsIntro: {
        eyebrow: 'Tiga mitos',
        headline: 'Tiga perkara yang industri pemotongan terus salah faham.',
        lede: "Bilah yang murah sebenarnya lebih mahal pada akhir kerja. Pengedar yang tidak pernah ke tapak tidak dapat beritahu anda kenapa bilah anda mengaca. Dan 'Buatan Jepun' tidak bermakna ia dibuat untuk memotong konkrit Malaysia.",
        ctaLabel: 'Baca folio',
      },
      brotherhoodIntro: {
        eyebrow: 'Sistem Brotherhood',
        headline: 'Bagaimana kami bekerja dengan orang yang membeli daripada kami.',
        lede: 'Pengedar dan kontraktor yang bekerja dengan Coolman mendapat akses terus ke kejuruteraan, bukan sistem mata. Jika anda membawa bilah kami, kami layani anda seperti rakan kongsi — bukan nombor pelanggan.',
        ctaLabel: 'Lihat lima prinsip',
      },
      fieldNotesPreview: {
        eyebrow: 'Field Notes',
        headline: 'Tiga kerja yang mengajar kami bagaimana membuat bilah yang lebih baik.',
        lede: 'Ini bukan kajian kes. Ini adalah perbualan yang kami buat di tapak, potongan yang gagal, pengajaran yang akhirnya kami terapkan ke dalam batch seterusnya.',
        cards: [
          { title: 'Apabila kontraktor berhenti mencuba, dan terus menelefon', meta: 'Konkrit bertetulang · pancang · Lembah Klang', readingTime: '9 minit bacaan' },
          { title: '"Kalau saya tak habis malam ini, saya habis."', meta: 'Pemotongan jalan · kabel utiliti', readingTime: '7 minit bacaan' },
          { title: 'Kami percayakan spesifikasi kilang. Kami sepatutnya tidak.', meta: 'Penarikan balik produk', readingTime: '6 minit bacaan' },
        ],
        ctaLabel: 'Baca semua Field Notes',
      },
      engineering: {
        eyebrow: 'Kejuruteraan',
        pullPrefix: 'Agregat Malaysia bukan agregat Eropah. Ia ',
        pullEmphasis: 'memecahkan bilah',
        pullSuffix: ' yang dibina untuk Eropah.',
        body: [
          'Segmen berlian adalah bahagian haus. Ia direka untuk menghakis pada kadar tertentu supaya berlian segar sentiasa terdedah kepada potongan. Matriks — aloi kobalt-gangsa yang memegang berlian — mesti haus pada kadar yang sama dengan kerja yang dilakukan oleh bilah. Apabila matriks terlalu keras, berlian mengaca dan bilah berhenti memotong. Apabila terlalu lembut, berlian jatuh sebelum ia sempat melakukan kerjanya.',
          'Matriks yang berfungsi di Eropah dikalibrasi untuk agregat Eropah: berasas batu kapur, rendah silika, mineralogi yang mudah dijangka. Agregat Malaysia adalah sebaliknya. Granit hancur KL mempunyai kandungan silika melebihi 60%. Butiran halus lebih tajam, kemasukan kuarza lebih tinggi, dan kekuatan mampatan tidak meramalkan tingkah laku pemotongan seperti yang dicadangkan oleh helaian spesifikasi Eropah.',
          'Tindak balas Coolman adalah segmen sandwic kobalt. Tiga lapisan matriks kekerasan bertahap, dikimpal laser ke teras keluli karbon tinggi berketegangan. Lapisan luar menanggung beban pemotongan. Lapisan tengah adalah kobalt lebih lembut — ia melepaskan berlian sebelum matriks mengaca. Hasilnya adalah segmen yang haus pada kadar yang diperlukan oleh kerja, bukan kadar yang matriks pada asalnya dikalibrasi.',
          'Hujah ini biasa dalam kalangan pengeluar alat. Ia jarang berlaku di pasaran ini kerana kebanyakan bilah yang dijual di Malaysia diimport siap dan tidak diformulasi semula untuk apa yang tanah di sini sebenarnya lakukan.',
        ],
        callouts: [
          { num: '62', sup: '%', label: 'Kandungan silika. Granit hancur Malaysia, sampel agregat KL, S2 2024.' },
          { num: '3.1', sup: '×', label: 'Haus matriks lebih cepat. Bilah kobalt-ikatan Eropah pada agregat Malaysia berbanding pasaran asal mereka.' },
          { num: '12', sup: 'mm', label: 'Ketinggian segmen. Segmen kobalt sandwic C-Series Coolman, generasi semasa.' },
          { num: '38', sup: 'm', label: 'Panjang potongan sebelum menyerut semula pada papak G60 Merdeka 118. Garis asas Eropah: 4 m.' },
        ],
        blueprint: {
          drawingNumber: 'DWG · CL-SS-012 · SEGMEN KOBALT SANDWIC · KERATAN RENTAS',
          scaleNote: 'SKALA 4:1 · SEMUA DIM. DALAM MM · REV. C · 2026-04',
          caption: 'Segmen kobalt sandwic, generasi semasa. Tiga lapisan matriks kekerasan bertahap dikimpal laser ke teras keluli karbon tinggi berketegangan. Kobalt tengah yang lembut melepaskan berlian sebelum matriks luar mengaca — kadar haus sepadan dengan kerja, bukan kalibrasi asal matriks.',
        },
        workshopPhoto: {
          heading: 'Bengkel tempat ikatan dibina.',
          body: 'Selangor, Seksyen 14. Setiap segmen yang kami hantar ditekan, disinter dan dikimpal laser di bangunan tunggal ini. Setiap bilah yang dipulangkan pada akhir hayat dipotong di sini. Relau adalah relau yang sama sejak Coolman bermula — formulasi ikatan tidak.',
        },
      },
      alansLetter: {
        eyebrow: 'Surat daripada Alan',
        paragraphs: [
          'Apabila saya memulakan kerjaya dalam bidang pemotongan pada 1998, saya fikir saya tahu apa itu bilah yang baik. Sembilan tahun kemudian, ketika saya mengasaskan Coolman pada 2007, saya sedar saya silap. Bilah yang baik bukan yang mempunyai formulasi segmen terbaik di atas kertas. Ia adalah yang menyiapkan potongan pada malam kontraktor tidak mampu untuk gagal.',
          'Coolman dibina di sekitar satu ayat itu. Setiap bilah yang kami hantar direka untuk jenis potongan yang memecahkan bilah yang lebih lemah: agregat Malaysia, besi tetulang keras, tuangan panjang, lembap monsun, mandor dengan tiga kerja berjalan dan tiada masa untuk menjaga alat yang perlahan.',
          'Saya mengasaskan Coolman kerana saya telah menyaksi terlalu ramai kontraktor dijual bilah oleh orang yang tidak pernah berada di tapak pada jam 2 pagi. Itu tidak pernah berlaku kepada pelanggan Coolman selama 19 tahun dan ia tidak akan berlaku. Jika potongan anda gagal, anda telefon saya. Bukan talian hotline. Saya.',
          'Halaman seterusnya bukan pemasaran. Itu adalah cara kami bekerja, apa yang kami telah pelajari, dan kerja yang mengajar kami. Jika anda membaca dan kami masih dirasakan sesuai untuk tapak anda, mari kita berbual.',
        ],
        signature: 'Alan',
        signatureLine2: 'Pengasas, Coolman',
      },
      quietDoor: {
        eyebrow: 'Pintu yang senyap',
        headline: 'Rangkaian penuh, dalam stok dan sedia untuk dihantar dari Selangor.',
        lede: 'Tiada muka katalog. Tiada perlu memburu PDF. Hanya inventori, spesifikasi, dan satu panggilan telefon jika bilah yang anda perlukan bukan yang kami senaraikan.',
        stats: [
          { key: 'sku', value: '247', label: 'SKU dalam stok' },
          { key: 'diameter', value: '100 hingga 900 mm', label: 'Julat diameter' },
          { key: 'onTimePct', value: '~500', label: 'Akaun aktif' },
          { key: 'dispatchCutoff', value: '2 hari', label: 'Penghantaran dari Selangor' },
        ],
        ctaPrimary: 'Buka katalog',
        ctaSecondary: 'Hubungi kejuruteraan',
      },
      conversation: {
        eyebrow: 'Bagaimana memulakan perbualan',
        headline: 'Tiga cara masuk. WhatsApp paling cepat.',
        lede: 'Kebanyakan potongan bermula dengan satu panggilan telefon. Kami tidak sembunyikan kami punya.',
        channels: [
          { tag: 'Utama', title: 'Meja kejuruteraan di WhatsApp', body: 'Hantar gambar potongan, agregat, bilah. Kami akan beritahu apa kami fikir sebelum kami beritahu apa kami jual.', ctaLabel: 'Buka WhatsApp' },
          { tag: 'Pejabat', title: 'Talian pejabat Selangor', body: 'Berbual dengan pasukan tentang pesanan, penghantaran, soalan pemulangan. Isnin hingga Jumaat 9:00 pagi–6:00 petang · Sabtu 9:00 pagi–1:00 tengah hari.', ctaLabel: 'Telefon pejabat' },
          { tag: 'Di tapak', title: 'Borang lawatan tapak', body: 'Jika potongan luar biasa, kami lebih rela datang melihat daripada meneka. Beritahu kami di mana dan bila.', ctaLabel: 'Minta lawatan tapak' },
        ],
      },
    },
    heritage: {
      hero: {
        eyebrow: 'Warisan',
        headline: 'Coolman, sejak 2007. Sembilan belas tahun potongan yang mengajar kami bagaimana membina bilah.',
        lede: 'Sejarah ringkas sebuah syarikat alat berlian Malaysia. Diasaskan di Selangor oleh seorang tukang yang telah berada dalam bidang pemotongan sejak 1998.',
      },
      pj2007: {
        eyebrow: 'PJ, 2007',
        headline: 'Sebuah bengkel di jalan kecil di Selangor.',
        body: [
          'Coolman bermula di satu unit sewa di Selangor pada 2007. Dua mesin penekan segmen, sebuah meja, dan satu telefon yang berdering terlalu kerap. Alan, pengasas, telah menghabiskan sembilan tahun dalam bidang pemotongan dan akhirnya mendengar satu aduan terlalu banyak tentang bilah yang tidak sesuai untuk batu kita.',
          'Tahun pertama senyap. Tahun kedua tidak. Menjelang akhir 2008, bengkel itu beroperasi dua syif.',
        ],
      },
      founding: {
        eyebrow: 'Keputusan pengasasan',
        headline: 'Selepas sembilan tahun dalam bidang, seorang tukang memulakan syarikat sendiri.',
        body: [
          'Alan telah menjual bilah syarikat lain sejak 1998. Beliau telah menyaksi tiga perkara yang sama berlaku salah di tapak, berulang kali. Harga sebagai ukuran nilai. Pengedar yang tidak pernah memegang bilah. Bilah import yang berfungsi di Jepun dan gagal di Selangor.',
          'Pada 2007, beliau berhenti menjelaskan bilah orang lain dan mula membuat bilah sendiri. Coolman adalah hasilnya.',
        ],
      },
      workshopDay: {
        eyebrow: 'Hari ia berhenti menjadi bengkel',
        headline: 'Sebuah kerja pancang yang berakhir dengan reka bentuk semula.',
        note: 'Tahun TBC. Alan untuk sahkan tahun.',
        body: [
          'Seorang kontraktor di Shah Alam menelefon pada jam 11 malam. Bilah yang kami jual kepadanya pada pagi itu tidak dapat menembusi pancang kedua. Alan memandu ke tapak. Beliau melihat potongan itu. Agregat lebih tajam daripada yang spesifikasi ramalkan. Ikatan bilah itu salah.',
          'Bilah itu direka semula dalam empat minggu seterusnya. Formulasi baru, sandwic kobalt, menjadi asas barisan CM-X hari ini. Bengkel itu menjadi pengeluar pada hari Alan menerima kontraktor itu betul dan helaian spesifikasi itu salah. (Tahun TBC. Alan untuk sahkan tahun.)',
        ],
      },
      shibuyaYears: {
        eyebrow: 'Dua belas tahun bersama Shibuya',
        headline: 'Ditandatangani 2014. Diperbaharui setiap tahun sejak itu.',
        body: [
          'Pada 2014, Coolman menandatangani perjanjian pengedaran eksklusif Malaysia untuk penggerudi teras Shibuya. Dua belas tahun kemudian, ia diperbaharui setiap tahun. Mesin yang sama dibuat di Jepun sejak 1923, disokong oleh pasukan kejuruteraan Malaysia yang telah melihat potongan yang ia sebenarnya buat.',
          'Shibuya membuat penggerudi. Coolman memastikan penggerudi itu adalah jawapan yang tepat kepada potongan di hadapan anda.',
        ],
      },
      hardestYear: {
        eyebrow: 'Tahun paling sukar',
        headline: 'Penarikan balik produk, dan apa yang berlaku selepasnya.',
        body: [
          'Dalam satu batch pengeluaran, agen pengikat yang salah digunakan. Bilah lulus ujian kilang. Ia gagal di tapak. Kami menarik balik setiap unit, menggantikan setiap satu, dan menanggung kos.',
          'Apa yang kami kekalkan ialah pangkalan pelanggan. Tiada seorang pengedar Brotherhood meninggalkan. Kontraktor yang menerima bilah gagal menerima penggantian, permohonan maaf, dan satu bilah kedua percuma. Kebanyakan mereka masih bersama kami. Perniagaan bukan perlumbaan siapa boleh berkembang paling cepat. Ia adalah soalan siapa boleh bertahan paling lama.',
        ],
      },
      twentyYears: {
        eyebrow: 'Dua puluh tahun dari sekarang',
        headline: 'Apa yang kami mahukan Coolman menjadi apabila anak-anak Alan menjalankannya.',
        body: [
          'Syarikat yang sama. Inventori yang lebih besar. Lebih banyak Field Notes dalam arkib. Talian terus yang sama ke kejuruteraan. Jawapan yang sama apabila seorang kontraktor menelefon pada jam 11 malam.',
          'Coolman dibina untuk bertahan lebih lama daripada pengasasnya. Itu satu-satunya ukuran kejayaan yang kami percaya.',
        ],
      },
      timeline: {
        eyebrow: 'Garis masa',
        headline: 'Sembilan belas tahun pada satu halaman.',
        events: [
          { year: '1998', title: 'Alan memasuki bidang pemotongan', body: 'Sembilan tahun menjual bilah syarikat lain bermula.' },
          { year: '2007', title: 'Coolman diasaskan di Selangor', body: 'Dua mesin penekan segmen, sebuah meja, sebuah telefon.' },
          { year: 'TBC', title: 'Formulasi sandwic kobalt dibangunkan', body: 'Selepas sebuah kerja pancang di Shah Alam mengajar kami spesifikasi adalah salah.', note: 'Alan untuk sahkan tahun' },
          { year: '2014', title: 'Pengedaran eksklusif Shibuya ditandatangani', body: 'Diperbaharui setiap tahun sejak itu.' },
          { year: 'TBC', title: 'Pensijilan SIRIM dianugerahkan', body: 'Pengesahan bebas spesifikasi ikatan kami.', note: 'Alan untuk sahkan tahun' },
          { year: '2026', title: '247 SKU dalam stok, ~500 akaun aktif', body: 'Dihantar dari Selangor dalam 2 hari bekerja.' },
        ],
      },
    },
    fieldNotes: {
      indexHero: {
        eyebrow: 'Field Notes',
        headline: 'Tiga kerja yang mengajar kami bagaimana membuat bilah yang lebih baik.',
        lede: 'Ditulis oleh Coolman Engineering. Difail apabila berlaku. Tiada apa-apa dalam catatan ini yang hipotesis.',
      },
      index: {
        eyebrowPrefix: 'Catatan Lapangan',
        eyebrowSincePrefix: 'Sejak',
        eyebrowPublishedSuffix: 'diterbitkan',
        filterAll: 'Semua catatan',
        filterAllShort: 'Semua',
        sortLabel: 'Susun',
        sortRecent: 'Terbaru',
        sortOldest: 'Paling lama dahulu',
        archiveHeading: 'Arkib',
        archiveHeadingNote: 'Catatan terdahulu, mengikut tahun.',
        featuredBadge: 'Catatan terbaru',
        readMore: 'Baca catatan',
        emptyHeadline: 'Belum ada Catatan Lapangan.',
        emptyBody: 'Catatan baharu difailkan apabila sebuah kerja mengajar kami sesuatu yang berbaloi ditulis. Sila semak semula tidak lama lagi.',
      },
      article: {
        back: 'Kembali ke Catatan Lapangan',
        breadcrumbHome: 'Coolman',
        breadcrumbFieldNotes: 'Catatan Lapangan',
        filedUnderLabel: 'Difailkan di bawah',
        bylineLabel: 'Ditulis oleh',
        publishedLabel: 'Diterbitkan',
        readTimeUnit: 'minit bacaan',
        relatedHeading: 'Disebut dalam Catatan Lapangan ini',
        relatedLede: 'Produk yang jurutera tetapkan untuk kerja ini.',
        sharePrefix: 'Kongsi catatan ini',
        missingTitle: 'Catatan tidak tersedia',
        missingBody: 'Catatan Lapangan ini tidak tersedia buat masa ini. Mungkin ia masih draf, atau pautan sudah lapuk.',
      },
      byline: 'Coolman Engineering',
      filedUnder: 'Difailkan di bawah Coolman Malaysia Sdn Bhd · Selangor · Dikilangkan di Malaysia',
      pileCutting: {
        title: 'Apabila kontraktor berhenti mencuba, dan terus menelefon',
        meta: 'Konkrit bertetulang · pancang · Lembah Klang',
        readingTime: '9 minit bacaan',
        pullQuote: 'Banyak kali, kontraktor fikir ini masalah produk. Sebenarnya, ia masalah sistem.',
        sections: [
          { heading: 'Panggilan', paragraphs: [
            'Mandor itu menelefon meja kejuruteraan pada jam 4:48 petang. Beliau telah memotong pancang konkrit bertetulang untuk sebuah pembangunan Lembah Klang sejak pagi. Bilah yang beliau gunakan, bukan kami punya, sudah berhenti maju. Beliau telah berada pada bilah ketiga hari itu.',
            'Beliau tidak meminta sebut harga. Beliau bertanya jika kami boleh datang melihat.',
          ] },
          { heading: 'Apa kami buat sebelum membuat sebut harga', paragraphs: [
            'Seorang jurutera memandu ke tapak pada malam yang sama. Beliau melihat agregat, kepadatan besi tetulang, gergaji, penyejukan, dan cara bilah itu menjadi licin. Beliau mengambil dua gambar dan menghantarnya kembali ke bengkel.',
            'Kami tidak membuat sebut harga malam itu. Kami beritahu mandor apa yang kami fikir salah dan kami akan menelefonnya pada pagi esok.',
          ] },
          { heading: 'Apa yang tapak beritahu kami', paragraphs: [
            'Agregat lebih keras daripada yang spesifikasi telah katakan. Bilah yang beliau gunakan diikat untuk konkrit umum. Ikatan menjadi licin kerana berlian tidak terdedah cukup cepat untuk batu ini.',
            'Masalahnya bukan kontraktor. Masalahnya pembekal telah menjual bilah untuk kerja yang mereka tidak pernah lihat.',
          ] },
          { heading: 'Apa yang berubah', paragraphs: [
            'Kami menghantar CM-X Pro 350 Hard-Bond pada pagi esok. Mandor menyiapkan baki pancang dalam dua hari, tepat masa, dalam bajet.',
            'Kami tidak mengenakan caj untuk lawatan jurutera. Kontraktor menjadi akaun Brotherhood tiga minggu kemudian.',
          ] },
          { heading: 'Pengajaran', paragraphs: [
            'Kami merekayasakan profil ikatan yang lebih tajam ke dalam batch CM-X Pro 350 Hard-Bond yang seterusnya, berdasarkan apa yang kami lihat di pancang itu.',
            'Bilah adalah jawapan kepada soalan yang belum sepenuhnya ditanya oleh kontraktor. Tugas kami adalah untuk menanyakannya bagi pihaknya.',
          ] },
        ],
      },
      midnightRoad: {
        title: '"Kalau saya tak habis malam ini, saya habis."',
        meta: 'Pemotongan jalan · kabel utiliti',
        readingTime: '7 minit bacaan',
        pullQuote: 'Kontraktor tidak selalu memerlukan pembekal. Kadang-kadang mereka memerlukan seseorang yang sanggup berdiri dengan mereka apabila kerja menjadi sukar.',
        sections: [
          { heading: 'Panggilan', paragraphs: [
            '10:42 malam. Permit penutupan jalan yang tamat pada jam 6 pagi. Kabel utiliti yang mesti didedahkan sebelum itu. Bilah yang krew gunakan telah putus pada potongan kedua.',
            'Mandor tidak panik pada telefon. Beliau sudah melepasi panik. Beliau tenang dengan cara yang memberitahu kami beliau hampir kehilangan kerja itu.',
          ] },
          { heading: 'Apa yang kami buat', paragraphs: [
            'Kami menghantar CM-X Road 450 dari gudang Selangor. Seorang jurutera bertemu krew di tapak pada jam 12:10 pagi. Beliau memeriksa gergaji, memasang bilah, melihat potongan pertama.',
            'Beliau tinggal di tapak sehingga jam 4 pagi.',
          ] },
          { heading: 'Apa yang berlaku', paragraphs: [
            'Krew selesai pada jam 5:36 pagi. Jalan dibuka semula tepat masa. Pemaju tidak pernah tahu.',
            'Mandor menelefon Alan pada jam 9 pagi keesokannya. Beliau tidak mahu mengucapkan terima kasih. Beliau mahu tahu apa diperlukan untuk membeli bilah kami untuk setiap kerja mulai sekarang.',
          ] },
          { heading: 'Pengajaran', paragraphs: [
            'Bilah ialah produk. Potongan yang dihantar pada jam 4 pagi adalah perkara lain. Coolman dibina di sekitar perkara kedua itu.',
          ] },
        ],
      },
      productRecall: {
        title: 'Kami percayakan spesifikasi kilang. Kami sepatutnya tidak.',
        meta: 'Penarikan balik produk',
        readingTime: '6 minit bacaan',
        pullQuote: 'Apa yang memusnahkan jenama bukan satu kerugian. Ia adalah saat pelanggan berhenti mempercayai anda.',
        sections: [
          { heading: 'Apa yang salah', paragraphs: [
            'Satu batch. Satu agen pengikat yang telah digantikan di pembekal tanpa pengetahuan kami. Bilah lulus ujian kilang standard kami. Ia gagal di tapak dalam 20% pertama hayat potongan yang dinilai.',
            'Kami telah menghantar 312 unit.',
          ] },
          { heading: 'Apa yang kami buat', paragraphs: [
            'Kami menelefon setiap pelanggan yang menerima bilah dari batch itu. Bukan emel. Telefon.',
            'Kami menggantikan setiap bilah. Kami menambah bilah kedua, percuma, ke setiap akaun. Kami menanggung pengangkutan, pemeriksaan, dan masa jurutera.',
          ] },
          { heading: 'Apa kosnya', paragraphs: [
            'Lebih daripada keuntungan setahun pada barisan itu.',
            'Tiada seorang pengedar Brotherhood meninggalkan. Tiga pengedar baru mendaftar dalam enam bulan berikutnya kerana mereka mendengar bagaimana kami menanganinya.',
          ] },
          { heading: 'Pengajaran', paragraphs: [
            'Kami mengubah proses kelayakan pembekal. Setiap perubahan agen pengikat di mana-mana peringkat kini mencetuskan ujian semula penuh sebelum ia boleh memasuki barisan pengeluaran.',
            'Jenama adalah apa yang anda buat apabila tiada siapa akan tahu jika anda diam.',
          ] },
        ],
      },
    },
    engineeringFolio: {
      indexHero: {
        eyebrow: 'Folio kejuruteraan',
        headline: 'Mengapa kami membuat bilah dengan cara kami membuatnya.',
        lede: 'Tiga karya ditulis oleh Coolman Engineering. Pemikiran di sebalik produk, pengilangan, dan cara kami bekerja dengan pelanggan kami.',
      },
      threeMyths: {
        title: 'Tiga perkara yang industri pemotongan terus salah faham',
        readingTime: '14 minit bacaan',
        pullQuote: 'Pilihan, akhirnya, adalah antara membeli mitos atau membeli potongan.',
        sections: [
          { heading: 'Sepatah kata tentang orang yang mengulanginya', paragraphs: [
            'Setiap bidang mempunyai kebijaksanaan yang diterima. Pemotongan berlian mempunyai tiga perkara yang telah diulang begitu kerap sehingga bunyinya benar. Ia tidak.',
            'Kami telah menghabiskan 19 tahun menyaksi ketiga-tiga idea ini merugikan kontraktor wang, masa, dan reputasi. Folio ini ialah percubaan kami untuk menjelaskannya dengan terus terang.',
          ] },
          { heading: 'Mitos 1: Harga memberitahu anda nilai bilah.', paragraphs: [
            'Bilah paling murah pada potongan keras menjadi bilah paling mahal menjelang waktu makan tengah hari. Krew dibayar. Tapak ada jadual. Penggantian dihantar dua kali. Harga seunit ialah ukuran yang salah. Kos sepotong adalah satu-satunya ukuran yang penting.',
            'Kami harga bilah kami supaya tahan lama. Kontraktor yang memahami itu menjadi pelanggan Brotherhood seumur hidup.',
          ] },
          { heading: 'Mitos 2: Pengedar dengan katalog paling lantang ialah rakan kongsi.', paragraphs: [
            'Pengedar yang menjual lapan jenama bukan rakan kongsi. Pengedar yang telah memotong konkrit ialah. Sistem Brotherhood wujud kerana kami percaya hubungan antara pengedar dan jurutera lebih penting daripada hubungan antara pengedar dan katalog.',
            'Separuh daripada pengedar kami telah berada di tapak bersama kami dalam tempoh 12 bulan terakhir. Itu ukuran yang kami ambil kira.',
          ] },
          { heading: 'Mitos 3: Buatan Jepun bermakna sesuai untuk Malaysia.', paragraphs: [
            'Teknologi berlian Jepun adalah cemerlang. Agregat yang ia direka untuk bukan agregat yang tapak Malaysia memotong. Barisan CM-X kami direka untuk batu Malaysia: silika lebih tinggi, besi tetulang lebih keras, tuangan lebih panjang.',
            'Kami membawa mesin Shibuya kerana Shibuya membuat penggerudi terbaik dalam bidang. Kami membuat bilah kami sendiri kerana tiada orang lain membuat bilah yang agregat Malaysia perlukan.',
          ] },
          { heading: 'Apa ini bermakna untuk cara kami menjual', paragraphs: [
            'Kami tidak utamakan harga. Kami utamakan potongan. Jika potongan betul, harga betul. Jika potongan salah, bilah murah menjadi yang paling mahal pada kerja itu.',
          ] },
          { heading: 'Kenapa ini penting', paragraphs: [
            'Bilah dibeli sekali. Hubungan dengan orang yang membuatnya dibeli setiap tahun. Pilihan, akhirnya, adalah antara membeli mitos atau membeli potongan.',
          ] },
        ],
      },
      malaysianAggregate: {
        title: 'Agregat Malaysia memecahkan bilah Eropah',
        readingTime: '13 minit bacaan',
        pullQuote: 'Bilah tidak ambil peduli apa yang helaian spesifikasi katakan. Ia ambil peduli apa yang batu lakukan.',
        sections: [
          { heading: 'Batu di bawah kaki kita', paragraphs: [
            'Agregat hancur Malaysia mempunyai kandungan silika yang lebih tinggi daripada batu rujukan Eropah yang kebanyakan bilah berlian direka untuk. Angka yang kami gunakan ialah sekitar 60 hingga 65% kandungan silika, untuk disahkan terhadap data kuari terkini.',
            'Silika lebih tinggi adalah lebih keras pada berlian. Ia melicinkan ikatan yang lebih lemah. Ia mendedahkan berlian terlalu perlahan. Bilah tidak memotong. Ia menggosok.',
          ] },
          { heading: 'Apa itu buat pada bilah', paragraphs: [
            'Bilah direka untuk spesifikasi Eropah tiba di Selangor dan menjadi panas. Ikatan menjadi licin. Berlian berhenti terdedah. Krew mengadu tentang bilah perlahan. Pembekal menyalahkan gergaji, operator, atau air.',
            'Jawapan sebenar ialah batu. Ia lebih keras daripada ikatan yang direka.',
          ] },
          { heading: 'Sandwic kobalt: jawapan yang kami bina', paragraphs: [
            'Barisan CM-X dibina pada pembinaan sandwic kobalt. Teras kobalt yang lebih keras, lapisan luar kobalt yang lebih lembut. Berlian terdedah pada kadar yang agregat perlukan. Bilah mengasah dirinya sendiri melalui potongan.',
            'Ia lebih mahal untuk dikilangkan. Ia jawapan jujur tunggal kepada batu yang kontraktor Malaysia sebenarnya memotong.',
          ] },
          { heading: 'Apa yang helaian spesifikasi tidak katakan', paragraphs: [
            'Kami telah berhenti cuba memadankan spesifikasi Eropah di atas kertas. Kami memadankan potongan di tapak. Setiap SKU CM-X diuji terhadap agregat Malaysia sebelum dihantar.',
            'Bilah tidak ambil peduli apa yang helaian spesifikasi katakan. Ia ambil peduli apa yang batu lakukan.',
          ] },
        ],
      },
      brotherhood: {
        title: 'Sistem Brotherhood',
        readingTime: '11 minit bacaan',
        pullQuote: 'Kami tidak berkembang dengan menandatangani pengedar. Kami berkembang dengan mengekalkan mereka yang telah berdiri dengan kami pada hari yang buruk.',
        sections: [
          { heading: 'Apa itu, dan apa yang ia bukan', paragraphs: [
            'Sistem Brotherhood ialah perjanjian kerja antara Coolman dan orang yang membawa bilah kami ke tapak kerja. Pengedar, mandor, dan operator yang sebenarnya memasang bilah dan memulakan potongan.',
            'Ia bukan program kesetiaan. Ia bukan peringkat diskaun. Ia adalah prinsip bahawa hubungan antara kami dan orang yang menggunakan bilah kami lebih penting daripada jumlah pada invois.',
          ] },
          { heading: 'Prinsip 1: Kami tidak menjual apa yang kami belum potong.', paragraphs: [
            'Setiap SKU CM-X telah dipotong oleh jurutera Coolman pada agregat Malaysia sebelum ia memasuki katalog. Kami tidak menjual bilah dari brosur.',
          ] },
          { heading: 'Prinsip 2: Kami menjawab panggilan.', paragraphs: [
            'Meja kejuruteraan kami ada di WhatsApp. Masa balasan diukur dalam minit, bukan jam. Jika mandor mempunyai gambar potongan yang tidak berfungsi, kami mahu melihatnya.',
          ] },
          { heading: 'Prinsip 3: Kami tanggung kos apabila kami silap.', paragraphs: [
            'Jika bilah Coolman gagal sebelum hayat yang dinilai pada potongan yang kami luluskan, kami menggantikannya. Kontraktor tidak menanggung kos kesilapan kami.',
          ] },
          { heading: 'Prinsip 4: Kami berkongsi apa yang kami pelajari.', paragraphs: [
            'Field Notes bukan pemasaran. Ia adalah pengajaran daripada kerja yang mengajar kami. Kami menerbitkannya supaya kontraktor seterusnya tidak perlu mempelajari pengajaran yang sama dengan cara yang sukar.',
          ] },
          { heading: 'Prinsip 5: Kami berkembang perlahan, dengan sengaja.', paragraphs: [
            'Kami bukan membina syarikat alat berlian terbesar di Malaysia. Kami membina yang masih ada selepas 20 tahun, dengan talian terus yang sama antara mandor dan jurutera.',
          ] },
        ],
      },
    },
    catalogueIntro: {
      eyebrow: 'Katalog',
      headline: 'Rangkaian penuh, dalam stok dan sedia untuk dihantar dari Selangor.',
      lede: '247 SKU merangkumi bilah berlian, penggerudi teras, dan sistem segmen. Guna penapis untuk tapis mengikut bahan, aplikasi, atau diameter. Jika pemotongan yang anda rancang tidak jelas dari rangkaian ini, meja kejuruteraan lebih pantas daripada borang.',
      tradeNote: 'Akaun perdagangan mendapat harga peringkat dan sejarah pesanan semula. Mohon melalui halaman Perdagangan.',
      filters: {
        materialLabel: 'Bahan',
        applicationLabel: 'Aplikasi',
        diameterLabel: 'Diameter',
        diameterUnit: ' mm',
      },
    },
    priceGate: {
      signInToSeePricing: 'Log masuk untuk lihat harga',
      verificationPending: 'Pengesahan tertangguh',
      contractPricingHint: 'Harga kontrak akan dipaparkan apabila e-mel anda disahkan.',
      resendVerification: 'Hantar semula e-mel pengesahan',
      listPrice: 'Harga senarai',
      yourTierDiscount: 'Diskaun peringkat anda',
      promo: 'Promosi',
      yourPrice: 'Harga anda',
    },
    productPageTemplate: {
      categoryEyebrow: 'Bilah berlian',
      tagline: 'Untuk konkrit bertetulang keras pada tuangan Malaysia yang panjang.',
      heroSpecBlock: {
        diameterLabel: 'Diameter',
        bondLabel: 'Ikatan',
        segmentLabel: 'Tinggi segmen',
        flangeLabel: 'Flens',
      },
      whatItsFor: {
        heading: 'Apa bilah ini untuk',
        body: 'Konkrit bertetulang dengan agregat silika tinggi. Pancang, pemotongan papak, prakacau keras. Direka untuk batu Malaysia dan tuangan panjang yang datang dengan lembap monsun.',
      },
      whenToChoose: {
        heading: 'Bila pilih ini berbanding alternatif',
        body: 'Pilih CM-X Pro 350 Hard-Bond apabila potongan perlahan pada bilah serbaguna dan agregat lebih tajam daripada yang spesifikasi ramalkan. Jika potongan lebih lembut, lihat CM-X Pro 350 Medium-Bond.',
      },
      specsTable: {
        heading: 'Spesifikasi',
        rows: [
          { key: 'Diameter', value: '350 mm' },
          { key: 'Ikatan', value: 'Keras, sandwic kobalt' },
          { key: 'Tinggi segmen', value: '10 mm' },
          { key: 'Flens', value: '25.4 mm' },
          { key: 'Hayat potongan dinilai', value: 'Sehingga 240 m pada konkrit bertetulang' },
          { key: 'Dikilangkan di', value: 'Selangor, Malaysia' },
        ],
      },
      unusualCuts: {
        heading: 'Untuk potongan luar biasa',
        body: 'Jika potongan anda luar biasa, hantar kami gambar. Kejuruteraan akan beritahu apa mereka fikir sebelum mereka beritahu apa kami jual.',
        ctaLabel: 'Hantar gambar di WhatsApp',
      },
    },
    tradePage: {
      hero: {
        eyebrow: 'Perdagangan',
        headline: 'Untuk pengedar dan pembeli perdagangan. Hubungan lebih penting daripada pesanan.',
        lede: 'Dua cara untuk bekerja dengan Coolman. Pilihan yang betul bergantung kepada sama ada anda mahukan pembekal atau rakan kongsi.',
      },
      tiers: {
        buyer: {
          title: 'Pembeli perdagangan',
          body: 'Akses kepada katalog Coolman penuh pada harga perdagangan. Penghantaran hari sama dari Selangor sebelum jam 2 petang.',
          bullets: ['Akses katalog penuh', 'Harga perdagangan', 'Penghantaran hari sama'],
        },
        dealer: {
          title: 'Pengedar Brotherhood',
          body: 'Semua yang diterima oleh pembeli perdagangan, ditambah lawatan tapak bersama, wilayah eksklusif di kawasan yang dipersetujui, dan talian terus ke kejuruteraan untuk pelanggan anda.',
          bullets: ['Harga perdagangan + peringkat Brotherhood', 'Lawatan tapak bersama dengan kejuruteraan', 'Talian terus untuk pelanggan anda', 'Wilayah eksklusif mengikut perjanjian'],
        },
      },
      application: {
        eyebrow: 'Bagaimana memohon',
        headline: 'Empat langkah. Kami akan jujur sama ada kesesuaian itu betul.',
        steps: [
          { title: '1. Hantar profil perniagaan anda', body: 'Beritahu kami siapa anda, di mana anda beroperasi, dan apa yang anda potong. Mesej ringkas sudah cukup untuk bermula.' },
          { title: '2. Kami datang melihat anda', body: 'Untuk permohonan Brotherhood, kami melawat premis anda atau tapak yang anda sedang kerjakan.' },
          { title: '3. Kami persetujui terma', body: 'Harga, wilayah, sokongan. Tiada yang rumit, semua secara bertulis.' },
          { title: '4. Kami mula bekerja', body: 'Pesanan pertama, pengenalan kejuruteraan kepada pelanggan anda, dan hubungan kerja.' },
        ],
        ctaLabel: 'Mulakan perbualan',
      },
    },
    contactPage: {
      hero: {
        eyebrow: 'Hubungi',
        headline: 'Kebanyakan potongan bermula dengan satu panggilan telefon. Kami tidak sembunyikan kami punya.',
        lede: 'Tiga cara untuk menghubungi Coolman. Meja kejuruteraan di WhatsApp adalah paling cepat.',
      },
      channels: [
        { tag: 'Utama', title: 'Meja kejuruteraan di WhatsApp', body: 'Gambar dialu-alukan. Balasan dalam minit semasa waktu pejabat.', ctaLabel: 'Buka WhatsApp' },
        { tag: 'Pejabat', title: 'Talian pejabat Selangor', body: 'Untuk pesanan, penghantaran dan soalan pemulangan.', ctaLabel: 'Telefon pejabat' },
        { tag: 'Tapak', title: 'Permintaan lawatan tapak', body: 'Jika potongan luar biasa, seorang jurutera akan datang melihatnya.', ctaLabel: 'Minta lawatan tapak' },
      ],
      hours: {
        heading: 'Waktu pejabat',
        line1: 'Isnin hingga Jumaat, 9:00 pagi hingga 6:00 petang · Sabtu 9:00 pagi hingga 1:00 tengah hari',
        line2: 'Hadang penghantaran hari sama jam 2:00 petang',
      },
    },
    aboutPage: {
      hero: {
        eyebrow: 'Tentang',
        headline: 'Alat pemotong berlian. Direka di Malaysia, untuk Malaysia.',
        lede: 'Coolman telah dibina di Selangor sejak 2007. Kami membuat bilah berlian, mata teras dan sistem segmen untuk kontraktor Malaysia. Sekitar 500 akaun aktif. Rangkaian yang sama, talian terus yang sama ke kejuruteraan, untuk 19 tahun.',
      },
      founded: { value: '2007', label: 'Diasaskan di Selangor' },
      builtIn: { value: 'Selangor', label: 'Di mana bilah dibuat' },
      accounts: { value: '~500', label: 'Akaun aktif' },
    },
    legal: {
      draftBadge: 'Deraf',
      privacy: { title: 'Privasi', lede: 'Bagaimana Coolman mengendalikan maklumat peribadi kontraktor, pengedar dan pelawat tapak. Bahasa yang jelas. Tiada kejutan.' },
      terms: { title: 'Terma jualan', lede: 'Terma di bawah mana Coolman Malaysia Sdn Bhd menjual alat pemotong berlian kepada pelanggan perdagangan dan Brotherhood di Malaysia.' },
      returns: { title: 'Pemulangan dan jaminan', lede: 'Bagaimana untuk memulangkan bilah Coolman, apa yang dilindungi oleh jaminan, dan apa yang perlu dibuat jika bilah gagal sebelum hayatnya yang dinilai.' },
      cookies: { title: 'Notis kuki', lede: 'Kuki yang digunakan tapak kami, apa yang mereka buat, dan bagaimana untuk mematikannya jika anda lebih suka.' },
    },
    seo: {
      home: { title: 'Bilah Berlian & Mata Teras Malaysia · Coolman Selangor', description: 'Bilah berlian, mata teras dan sistem segmen untuk konkrit, granit dan jubin. 247 dalam stok, dihantar dari Selangor (Lembah Klang) dalam 2 hari bekerja.' },
      heritage: { title: 'Warisan · Pembuat alat berlian di Selangor sejak 2007 · Coolman', description: 'Bagaimana Coolman membina bilah pemotong berlian di Selangor sejak 2007, diasaskan oleh seorang tukang dalam bidang pemotongan sejak 1998.' },
      whyCoolman: { title: 'Kenapa Coolman · Bilah berlian untuk konkrit Malaysia', description: 'Kenapa bilah kami tahan lebih lama daripada bilah import pada agregat Malaysia. Tiga mitos tentang harga, pengedar dan Buatan Jepun, dijawab terus.' },
      fieldNotes: { title: 'Field Notes · Kajian kes bilah berlian dari tapak Malaysia', description: 'Kerja pemotongan sebenar: konkrit bertetulang, potongan jalan waktu malam, dan bilah yang berkaca. Apa yang setiap satu ajar kami.' },
      catalogue: { title: 'Bilah Berlian & Mata Teras Malaysia · 247 dalam stok · Coolman', description: 'Layari 247 bilah berlian, mata teras dan sistem segmen untuk konkrit, granit, jubin dan asfalt. Tapis ikut bahan, aplikasi atau diameter.' },
      productTemplate: { title: 'Spesifikasi & aplikasi bilah berlian · Coolman Malaysia', description: 'Spesifikasi, padanan bahan dan nota kejuruteraan untuk bilah berlian dan mata teras Coolman. Dihantar dari Selangor dalam 2 hari bekerja.' },
      trade: { title: 'Perdagangan & harga pengedar · Bilah berlian Coolman Malaysia', description: 'Program pembeli perdagangan dan pengedar Brotherhood: harga peringkat, terma pesanan semula dan kawasan. Mohon dalam empat langkah.' },
      contact: { title: 'Hubungi Coolman · WhatsApp meja kejuruteraan, Selangor', description: 'Hubungi Coolman di Selangor: WhatsApp meja kejuruteraan, telefon pejabat, atau minta lawatan tapak. Kebanyakan potongan bermula dengan satu panggilan.' },
      about: { title: 'Tentang Coolman · Alat berlian dibuat di Selangor sejak 2007', description: 'Coolman membuat bilah pemotong berlian, mata teras dan sistem segmen di Selangor. Sekitar 500 akaun perdagangan aktif sejak 2007.' },
      shibuya: { title: 'Mesin Penggerudi Teras Shibuya Malaysia · Coring Konkrit · Coolman', description: 'Mesin penggerudi teras Shibuya untuk coring konkrit, dari Coolman, pengedar eksklusif Malaysia sejak 2014. Spesifikasi, model dan permohonan demo.' },
      privacy: { title: 'Privasi · Coolman', description: 'Bagaimana Coolman mengendalikan maklumat peribadi anda.' },
      terms: { title: 'Terma jualan · Coolman', description: 'Terma di bawah mana Coolman Malaysia Sdn Bhd menjual di Malaysia.' },
      returns: { title: 'Pemulangan dan jaminan · Bilah berlian Coolman', description: 'Memulangkan bilah Coolman, liputan jaminan, dan apa nak buat jika bilah rosak sebelum jangka hayatnya.' },
      cookies: { title: 'Notis kuki · Coolman', description: 'Kuki yang digunakan tapak kami dan bagaimana untuk mematikannya.' },
      folioThreeMyths: { title: 'Tiga perkara yang industri pemotongan terus salah faham', description: 'Sebuah folio Coolman Engineering tentang harga, pengedar, dan mitos Buatan Jepun.' },
      brotherhood: { title: 'Pengedar Coolman berhampiran anda · Stokis bilah berlian Malaysia', description: 'Cari pengedar Coolman sah yang terdekat. Tapis mengikut kawasan, hubungi melalui WhatsApp, atau buka alamat dalam Maps.' },
    },
    brotherhoodDirectory: {
      hero: {
        eyebrow: 'Direktori Brotherhood',
        headline: 'Pengedar Coolman sah di seluruh Malaysia.',
        lede: 'Mereka yang membawa bilah kami ke tapak kerja. Tapis mengikut kawasan, hubungi melalui WhatsApp, atau buka alamat dalam Maps.',
      },
      filter: {
        allLabel: 'Semua kawasan',
        label: 'Tapis mengikut kawasan',
      },
      emptyState: {
        headline: 'Direktori Brotherhood akan dilancarkan tidak lama lagi.',
        body: 'Hubungi jualan untuk pengedar sah yang terdekat sementara kami menerima kohort pertama.',
        ctaLabel: 'Hubungi jualan melalui WhatsApp',
      },
    },
    killSwitch: {
      message: 'Pesanan sedang dijeda buat masa ini. Hubungi kami di WhatsApp untuk membuat permintaan.',
      ctaLabel: 'Hubungi kami di WhatsApp',
    },
  },
}
