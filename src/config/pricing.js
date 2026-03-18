export const CATEGORIES = {
  EXTREME: {
    name: "Extreme (Late: ₹17,999)",
    fee: 14999,
    lateFee: 17999,
    description: "On top of the line - Ultimate performance class",
    technicalTerms: [
      "Ultimate performance engine upgrades authorized (Up to 4L)",
      "Maximum Tyre Size allowed: 38\"",
      "Mechanical Portal Axles allowed",
      "Full External 6-Point Roll Cage mandatory"
    ]
  },
  DIESEL_MODIFIED: {
    name: "Diesel Modified (Late: ₹12,999)",
    fee: 9999,
    lateFee: 12999,
    description: "High-performance diesel monsters built for ultimate trail conquest.",
    technicalTerms: [
      "Diesel engines up to 3.0L authorized",
      "Turbo and other performance upgrades allowed",
      "Maximum Tyre Size: 34\" properly inflated",
      "Min 6-Point internal/external roll cage mandatory"
    ]
  },
  PETROL_MODIFIED: {
    name: "Petrol Modified (Late: ₹12,999)",
    fee: 9999,
    lateFee: 12999,
    description: "Turbocharged petrol builds designed for speed and technical precision.",
    technicalTerms: [
      "Petrol engines up to 2.5L authorized",
      "Forced induction (Turbo) allowed",
      "Maximum Tyre Size: 34\" properly inflated",
      "Min 6-Point internal/external roll cage mandatory"
    ]
  },
  DIESEL_EXPERT: {
    name: "Diesel Expert (Late: ₹9,999)",
    fee: 7999,
    lateFee: 9999,
    description: "Professional level diesel class for seasoned off-roaders.",
    technicalTerms: [
      "Engines: Up to DI Turbo, M2DI TC (SZ/CRDe not allowed)",
      "Maximum Tyre Size: 32\" properly inflated",
      "Differential: Closed/Open Knuckle allowed (OEM type)",
      "Min 4-Point roll cage mandatory"
    ]
  },
  PETROL_EXPERT: {
    name: "Petrol Expert (Late: ₹9,999)",
    fee: 7999,
    lateFee: 9999,
    description: "Expert level petrol class focused on technical mastery.",
    technicalTerms: [
      "Up to 1.3L Stock Petrol Engine authorized",
      "Turbo upgrades not allowed in this class",
      "Maximum Tyre Size: 32\" properly inflated",
      "Min 4-Point roll cage mandatory"
    ]
  },
  THAR_SUV: {
    name: "Thar SUV (Late: ₹9,999)",
    fee: 7999,
    lateFee: 9999,
    description: "Battle-ready Mahindra Thar class. Built to dominate.",
    technicalTerms: [
      "Stock class requires ALL OEM components",
      "OEM doors and body panels mandatory",
      "35\" tyres only allowed in modified subclass",
      "ECU/ECM tuning authorized for modified class"
    ]
  },
  SUV_MODIFIED: {
    name: "SUV Modified (Late: ₹11,999)",
    fee: 9999,
    lateFee: 11999,
    description: "Modified SUV class for heavy-duty challengers.",
    technicalTerms: [
       "35\" MT Tyres authorized",
       "Lift kits and heavy suspension upgrades authorized",
       "OEM doors MUST remain intact",
       "ECU/ECM tuning allowed"
    ]
  },
  JIMNY_SUV: {
    name: "Jimny SUV (Late: ₹9,999)",
    fee: 7999,
    lateFee: 9999,
    description: "Suzuki Jimny Specific Category",
    technicalTerms: [
       "Modified subclass allows performance upgrades",
       "OEM doors and body mandatory",
       "35\" MT Tyres max in modified subclass",
       "Suspension lift authorized"
    ]
  },
  STOCK_NDMS: {
    name: "Stock NDMS (Late: ₹7,999)",
    fee: 5999,
    lateFee: 7999,
    description: "Standard configuration with NDMS tires",
    technicalTerms: [
       "OEM Stock Engines only (SZ/CRDe/M2DI not allowed for Diesel)",
       "No Performance upgrades or engine replacements",
       "Tyres: Strictly NDMS 6.00.16 (Diesel) / 78.15 (Petrol)",
       "Stock Suspension only"
    ]
  },
};

export const PRICING_CONFIG = {
  currency: "INR",
  upiId: "7020440073@okbizaxis",
  upiName: "Team Karad Offroaders",
};

export const MAX_CAR_NUMBER = 160;
