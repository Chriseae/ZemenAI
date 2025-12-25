
export interface TranslationResource {
  common: {
    appName: string;
    loading: string;
    error: string;
  };
  sidebar: {
    newChat: string;
    library: string;
    projects: string;
    legacyWallet: string;
    wallet: string;
    referrals: string;
    settings: string;
    recent: string;
    rename: string;
    delete: string;
    deleteConfirm: string;
  };
  chat: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    inputPlaceholder: string;
    listening: string;
    disclaimer: string;
    liveError: string;
    actions: {
      copy: string;
      readAloud: string;
      goodResponse: string;
      badResponse: string;
      share: string;
      more: string;
      report: string;
      reportSuccess: string;
    };
  };
  library: {
    title: string;
    description: string;
    searchPlaceholder: string;
    tabs: {
      all: string;
      documents: string;
      articles: string;
      summaries: string;
    };
    emptyState: string;
    actions: {
      open: string;
      pin: string;
      delete: string;
      deleteConfirm: string;
      download: string;
    };
    upload: {
      buttonLabel: string;
      dropLabel: string;
      status: {
        waiting: string;
        uploading: string;
        processing: string;
        training: string;
        complete: string;
        failed: string;
      };
      error: {
        retry: string;
        generic: string;
      };
    };
  };
  projects: {
    title: string;
    description: string;
    newProject: string;
    createCard: string;
    stats: {
      tasks: string;
      files: string;
    };
    status: {
      active: string;
      archived: string;
    }
  };
  wallet: {
    title: string;
    balance: {
      available: string;
      equivalent: string;
    };
    actions: {
      send: string;
      receive: string;
      buy: string;
    };
    transactions: {
      title: string;
      filters: {
        all: string;
        incoming: string;
        outgoing: string;
        rewards: string;
      };
      empty: string;
      status: {
        completed: string;
        pending: string;
        failed: string;
      }
    };
    sendModal: {
      title: string;
      recipient: string;
      amount: string;
      note: string;
      submit: string;
    };
    receiveModal: {
      title: string;
      addressLabel: string;
      copy: string;
      share: string;
      note: string;
    };
  };
  referrals: {
    title: string;
    stats: {
      earnings: string;
      active: string;
      pending: string;
      rank: string;
    };
    linkBox: {
      label: string;
      copy: string;
      copied: string;
      share: string;
      footer: string;
    };
    rewards: {
      title: string;
      signup: string;
      pro: string;
      max: string;
    };
    table: {
      title: string;
      cols: {
        friend: string;
        date: string;
        plan: string;
        reward: string;
        status: string;
      }
    };
    cta: {
      text: string;
      button: string;
    };
  };
  settings: {
    title: string;
    sections: {
      general: string;
      model: string;
      data: string;
    };
    labels: {
      account: string;
      motherTongue: string;
      theme: string;
      language: string;
      aiModel: string;
      memory: string;
      notifications: string;
      clearData: string;
      clearDataButton: string;
    };
  };
  landing: {
    hero: {
      title: string;
      subtitle: string;
      cta: string;
    };
    pricing: {
      title: string;
      subtitle: string;
      monthly: string;
      yearly: string;
      saveBadge: string;
      billedMonthly: string;
      billedAnnually: string;
      plan_free: {
        title: string;
        subtitle: string;
        price: string;
        features: string[];
        cta: string;
      };
      plan_pro: {
        title: string;
        subtitle: string;
        monthlyPrice: string;
        yearlyPrice: string;
        features: string[];
        cta: string;
      };
      plan_max: {
        title: string;
        subtitle: string;
        monthlyPrice: string;
        yearlyPrice: string;
        features: string[];
        cta: string;
      };
    };
  };
  checkout: {
    title: string;
    back: string;
    orderSummary: string;
    billedNow: string;
    total: string;
    payWithCard: string;
    emailLabel: string;
    cardLabel: string;
    nameLabel: string;
    countryLabel: string;
    payButton: string;
    secure: string;
    success: string;
    processing: string;
  };
  onboarding: {
    interests: {
      title: string;
      subtitle: string;
      items: {
        creative: string;
        business: string;
        education: string;
        health: string;
        technology: string;
        history: string;
        culture: string;
        news: string;
      }
    };
    intro: {
      title: string;
      blocks: {
        ask: { title: string; description: string };
        safety: { title: string; description: string };
        improve: { title: string; description: string };
      };
      toggleLabel: string;
      cta: string;
    };
    auth: {
      title: string;
      subtitle: string;
      google: string;
      apple: string;
      facebook: string;
      email: string;
      footer: string;
      footerLink: string;
    };
  };
}
export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'file';
  mimeType: string;
  data: string; // base64
  name: string;
  loading?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachments?: Attachment[];
  timestamp?: number | string; // Add this line - accept both number and string
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

// Types for other pages
export interface LibraryItem {
  id: string;
  title: string;
  type: 'article' | 'document' | 'summary';
  date: string;
  tags: string[];
  isPinned?: boolean;
  url?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived';
  tasks: number;
  files: number;
  lastActive: string;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'reward' | 'subscription' | 'training';
  title: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface Referral {
  id: string;
  name: string;
  date: string;
  plan: 'Free' | 'Pro' | 'Max';
  reward: number;
  status: 'pending' | 'qualified' | 'paid';
}