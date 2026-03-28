/**
 * Sanitizes user input to prevent XSS attacks and ensure data integrity
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    // Remove potentially dangerous HTML/script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    // Limit length to prevent excessive data
    .slice(0, 1000);
}

/**
 * Validates that a string is not empty after sanitization
 */
export function validateRequired(input: string, fieldName: string): string | null {
  const sanitized = sanitizeInput(input);
  if (!sanitized) {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validates string length constraints
 */
export function validateLength(
  input: string, 
  fieldName: string, 
  minLength: number = 1, 
  maxLength: number = 1000
): string | null {
  const sanitized = sanitizeInput(input);
  
  if (sanitized.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  
  if (sanitized.length > maxLength) {
    return `${fieldName} must be no more than ${maxLength} characters`;
  }
  
  return null;
}

/**
 * Validates that an ID is safe to use
 */
export function validateId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}