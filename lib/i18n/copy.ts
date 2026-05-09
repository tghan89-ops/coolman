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
  }
  hero: {
    headline: string
    subheadline: string
    cta: string
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
    },
    hero: {
      headline: 'The Right Blade for Every Cut',
      subheadline: 'Premium diamond cutting tools engineered for Malaysian contractors. Quality you can trust.',
      cta: 'Browse Products',
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
    product: {
      viewDetails: 'View Details',
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
    },
    hero: {
      headline: 'Bilah Tepat untuk Setiap Potongan',
      subheadline: 'Alat pemotong berlian premium direka untuk kontraktor Malaysia. Kualiti yang boleh dipercayai.',
      cta: 'Lihat Produk',
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
    product: {
      viewDetails: 'Lihat Butiran',
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
    },
  },
}
