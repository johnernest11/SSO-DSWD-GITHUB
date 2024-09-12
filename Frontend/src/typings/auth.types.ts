export const enum AuthType {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  OPEN = 'open',
  MFA = 'mfa',
}

export enum AuthRole {
  STANDARD_USER = 'standard_user',
  ADMIN = 'admin',
  SUPER_USER = 'super_user',
  SYSTEM_SUPPORT = 'system_support',
}
