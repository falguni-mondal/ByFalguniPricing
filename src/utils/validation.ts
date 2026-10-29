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

// 5. URL Regex (Kept exported for optional URL validation helpers)
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

  // Tab 01: Full Name (Required)
  if (!data.fullName.trim()) {
    errors.fullName = 'Full Name is required.';
    missingList.push('Full Name (Tab 01)');
  } else if (!NAME_REGEX.test(data.fullName.trim())) {
    errors.fullName = 'Enter a valid Full Name (letters only, 2-80 characters).';
    missingList.push('Valid Full Name (Tab 01)');
  }

  // Tab 01: Email (Required)
  if (!data.email.trim()) {
    errors.email = 'Email Address is required.';
    missingList.push('Email Address (Tab 01)');
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Enter a valid email address (e.g. name@company.com).';
    missingList.push('Valid Email (Tab 01)');
  }

  // Tab 01: Phone / WhatsApp (Required)
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

  // Tab 01: Target Budget (Optional)
  if (data.budget < 0) {
    errors.budget = 'Budget cannot be negative.';
    missingList.push('Valid Budget (Tab 01)');
  }

  // Tab 02: Page Count is required (must be at least 1 page); Website Category is not forced
  if (!data.pages || data.pages < 1 || data.pages > 200) {
    errors.pages = 'Please select the number of pages needed (at least 1 page).';
    missingList.push('Number of Pages (Tab 02)');
  }

  // Tab 03 (Functionality) & Tab 04 (Motion & 3D) are fully optional

  // Tab 05: Business Name (Required)
  if (!data.businessName.trim()) {
    errors.businessName = 'Business Name is required.';
    missingList.push('Business Name (Tab 05)');
  } else if (!SAFE_TEXT_REGEX.test(data.businessName.trim())) {
    errors.businessName = 'Enter a valid Business Name (at least 3 characters).';
    missingList.push('Valid Business Name (Tab 05)');
  }

  // Tab 05: Main Goal (Required)
  if (!data.mainGoal.trim()) {
    errors.mainGoal = 'Main Website Goal is required.';
    missingList.push('Main Goal (Tab 05)');
  } else if (!SAFE_TEXT_REGEX.test(data.mainGoal.trim())) {
    errors.mainGoal = 'Describe your main website goal (at least 3 characters).';
    missingList.push('Valid Main Goal (Tab 05)');
  }

  // Tab 05: Description of the Business (Required)
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

  // All other Tab 05 fields (Ideal Launch Date, Rush Delivery, Design References, Extra Note, Files) are optional

  return {
    isValid: missingList.length === 0,
    errors,
    missingList,
  };
}