export const COLLECTIONS = {
  USERS: 'users',
  CLIENTS: 'clients',
  PROJECTS: 'projects',
  APPS: 'apps',
  SCOPES: 'scopes',
  PRICING_RULES: 'pricingRules',
  PROPOSALS: 'proposals'
} as const;

export const CLIENT_STATUS = {
  PENDING: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export const PROJECT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  REQUIRED_DATA_PENDING: 'required_data_pending',
  IN_REVISION: 'in_revision',
  IN_VERIFICATION: 'in_verification',
  DELAYED: 'delayed',
  COMPLETED: 'completed'
} as const;

export const CLIENT_FIELDS = {
  COMPANY_NAME: 'companyName',
  CONTACT_PERSON: 'contactPerson',
  EMAIL: 'email',
  PHONE: 'phone',
  CITY: 'city',
  GSTIN: 'gstin',
  PRICING_CATEGORY: 'pricingCategory',
  SALES_PERSON_EMAIL: 'salesPersonEmail',
  PROPOSAL_NUMBER: 'proposalNumber',
  STATUS: 'status',
  CREATED_AT: 'createdAt'
} as const;

export const PROJECT_FIELDS = {
  PROJECT_NAME: 'projectName',
  CAPACITY: 'capacity',
  UNIT: 'unit',
  LOCATION: 'location',
  EXECUTIVE_NAME: 'executiveName',
  EXECUTIVE_MOBILE: 'executiveMobile'
} as const;
