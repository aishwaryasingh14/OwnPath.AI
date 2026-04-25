export const SUPPORT_RESOURCES = {
  transportation: [
    {
      name: "Sun Tran Route 8 (Main Ave)",
      detail: "Stops directly on Main Ave near Caridad — 845 N Main Ave",
      contact: "520-792-9222",
      url: "https://suntran.com",
      cost: "Day Pass available"
    },
    {
      name: "Sun Tran Route 4 (4th Ave)",
      detail: "Connects to downtown, short walk to Caridad",
      contact: "520-792-9222",
      cost: "Day Pass available"
    },
    {
      name: "211 Arizona Transport Line",
      detail: "Free bilingual help finding rides and bus passes",
      contact: "Dial 2-1-1",
      cost: "Free"
    }
  ],
  childcare: [
    {
      name: "ADES Child Care Assistance Program",
      detail: "State childcare subsidies for income-eligible families",
      contact: "1-800-204-7633",
      url: "https://des.az.gov/services/family/childcare",
      note: "Wait lists may apply — apply early"
    },
    {
      name: "211 Arizona Childcare Referrals",
      detail: "Bilingual, free resource navigation",
      contact: "Dial 2-1-1",
      cost: "Free"
    }
  ],
  housing: [
    {
      name: "211 Arizona (Housing/Emergency Shelter)",
      detail: "24/7 bilingual housing resource hotline",
      contact: "Dial 2-1-1",
      cost: "Free"
    },
    {
      name: "Primavera Foundation",
      detail: "Tucson's largest homeless-services provider",
      contact: "520-882-8157"
    }
  ],
  overwhelmed: [
    {
      name: "Caridad Program Staff",
      detail: "Talk to your instructor — they've seen this before",
      contact: "520-882-5641"
    },
    {
      name: "Crisis Text Line",
      detail: "Text HOME to 741741 — free, confidential",
      contact: "Text HOME to 741741",
      cost: "Free"
    }
  ]
};

export const BARRIER_RESOURCE_MAP = {
  transportation: "transportation",
  childcare: "childcare",
  housing: "housing",
  overwhelmed: "overwhelmed",
  money: "overwhelmed",
  sick: "overwhelmed"
};
