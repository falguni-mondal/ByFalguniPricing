// frontend/src/utils/validation.ts

// 1. Human Full Name: 2-80 chars, letters, spaces, dots, apostrophes, hyphens
export const NAME_REGEX = /^[a-zA-Z\s.'-]{2,80}$/;

// 2. Strict RFC-compliant Email Address
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 3. Phone / WhatsApp Number: 7-15 digits, optional + country code, spaces or hyphens
export const PHONE_REGEX = /^\+?[0-9\s-]{7,18}$/;
export const INDIA_PHONE_REGEX = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;

// 4. Meaningful Text (Business Name, Business Description, Main Goal): Must contain letters, min 3 chars, no <script> tags
export const SAFE_TEXT_REGEX = /^(?!.*<script)(?=.*[a-zA-Z]).{3,500}$/is;

// 5. URL Regex (Checks that at least one valid http/https URL is provided in Design References)
export const URL_EXTRACT_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,10}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i;

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  missingList: string[];
}

export function validateClientSubmission(data: {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  budget: number;
  region: 'INDIA' | 'INTL';
  projectPurpose: string;
  pagesAndTypeNote: string;
  pages: number;
  businessName: string;
  businessDescription: string;
  mainGoal: string;
  launchDateReason: string;
  designReferences: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  const missingList: string[] = [];

  // Full Name
  if (!data.fullName.trim()) {
    errors.fullName = 'Full Name is required.';
    missingList.push('Full Name (Tab 01)');
  } else if (!NAME_REGEX.test(data.fullName.trim())) {
    errors.fullName = 'Enter a valid Full Name (letters only, 2-80 characters).';
    missingList.push('Valid Full Name (Tab 01)');
  }

  // Email
  if (!data.email.trim()) {
    errors.email = 'Email Address is required.';
    missingList.push('Email Address (Tab 01)');
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Enter a valid email address (e.g. name@company.com).';
    missingList.push('Valid Email (Tab 01)');
  }

  // Phone / WhatsApp
  const cleanPhone = data.phone.trim();
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  if (!cleanPhone) {
    errors.phone = 'Phone / WhatsApp number is required.';
    missingList.push('Phone / WhatsApp (Tab 01)');
  } else if (data.countryCode === 'IN' && !INDIA_PHONE_REGEX.test(cleanPhone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number (e.g. +91 9876543210).';
    missingList.push('Valid Indian Phone (Tab 01)');
  } else if (
    data.countryCode !== 'IN' &&
    (!PHONE_REGEX.test(cleanPhone) || digitsOnly.length < 7 || digitsOnly.length > 15)
  ) {
    errors.phone = 'Enter a valid phone number with country code (7-15 digits).';
    missingList.push('Valid Phone Number (Tab 01)');
  }

  // Target Budget
  if (!data.budget || data.budget <= 0) {
    errors.budget = 'Target Budget is required.';
    missingList.push('Target Budget (Tab 01)');
  }

  // Category & Pages (Starts at 0; client must select a category or custom note, and choose at least 1 page or describe custom page structure)
  if (!data.projectPurpose && !data.pagesAndTypeNote.trim()) {
    errors.projectPurpose = 'Select a Website Category or describe your custom type.';
    missingList.push('Website Category (Tab 02)');
  }
  if ((data.pages < 1 && !data.pagesAndTypeNote.trim()) || data.pages > 200) {
    errors.pages = 'Please select your needed page count (or describe your page structure in the note).';
    missingList.push('Page Count (Tab 02)');
  }

  // Business Name
  if (!data.businessName.trim()) {
    errors.businessName = 'Business Name is required.';
    missingList.push('Business Name (Tab 05)');
  } else if (!SAFE_TEXT_REGEX.test(data.businessName.trim())) {
    errors.businessName = 'Enter a valid Business Name (at least 3 characters).';
    missingList.push('Valid Business Name (Tab 05)');
  }

  // Description of the Business (Required)
  if (!data.businessDescription.trim()) {
    errors.businessDescription = 'Description of the Business is required.';
    missingList.push('Business Description (Tab 05)');
  } else if (
    data.businessDescription.trim().length < 10 ||
    !SAFE_TEXT_REGEX.test(data.businessDescription.trim())
  ) {
    errors.businessDescription =
      'Please describe what your business does (at least 10 characters).';
    missingList.push('Valid Business Description (Tab 05)');
  }

  // Main Goal
  if (!data.mainGoal.trim()) {
    errors.mainGoal = 'Main Website Goal is required.';
    missingList.push('Main Goal (Tab 05)');
  } else if (!SAFE_TEXT_REGEX.test(data.mainGoal.trim())) {
    errors.mainGoal = 'Describe your main website goal (at least 3 characters).';
    missingList.push('Valid Main Goal (Tab 05)');
  }

  // Ideal Launch Date & Reason
  if (!data.launchDateReason.trim()) {
    errors.launchDateReason = 'Ideal Launch Date & Reason is required.';
    missingList.push('Launch Date & Reason (Tab 05)');
  } else if (data.launchDateReason.trim().length < 3) {
    errors.launchDateReason = 'Enter a valid launch date and reason.';
    missingList.push('Valid Launch Date (Tab 05)');
  }

  // Design References (Must contain at least 1 valid http:// or https:// link)
  if (!data.designReferences.trim()) {
    errors.designReferences = 'Provide a Figma link or reference website URLs.';
    missingList.push('Reference URLs (Tab 05)');
  } else if (!URL_EXTRACT_REGEX.test(data.designReferences.trim())) {
    errors.designReferences =
      'Include at least one valid URL starting with https:// or http:// (e.g. https://example.com).';
    missingList.push('Valid Reference URL https://... (Tab 05)');
  }

  return {
    isValid: missingList.length === 0,
    errors,
    missingList,
  };
}