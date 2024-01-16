// APP TEXT
export const APP_TITLE = 'TerraScan'
export const FOOTER_TEXT = `${new Date().getFullYear()} Proudly made in Vancouver ♡ by Seven Of Spades`
// PAGES TITLE
export const PAGE_TITLE_MY_VIOLATIONS = 'My Violations'
export const ADMIN_MANAGE_ALL_RULES = 'Manage All Rules'
export const ADMIN_VIO_QUERY_SEARCH = 'Search'
export const ADMIN_VIO_QUERY_TOP_10_RULES = 'Top 10 Rules Being Violated'
export const ADMIN_VIO_QUERY_TOTAL_VIO_PER_REPO = 'Total Violations Per Repo'
export const USER_VIEW_ALL_VIOS = 'My Violations'
export const PAGE_TITLE_CODE = 'Code Editor'
export const PAGE_LOGOUT = 'Log out'
// UI CONSTANTS
export const FOOTER_HEIGHT = 30
export const HEADER_HEIGHT = 60
export const DRAWER_WIDTH = 300
export const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF30BB', '#80C40C', '#B00800', '#FF0800', '#8FF400', '#AA00FE'
]

/**
 * API endpoints
 * composite endpoints in the order of COMMON PART, STAGE, VERSION, and a specific name
 */

//COMMON PART
const COMMON_PART = process.env.REACT_APP_BACKEND_URL
// const COMMON_PART = 'https://jhstgvwqkl.execute-api.us-east-2.amazonaws.com/dev/v1'

// DASHBOARD HEADER
export const VIOLATION_DASHBOARD_HEADERS = [
    'Violation Info',
    'PR Info',
    'GitHub Username',
    'Created Date (UTC)',
    'Severity',
    'Status',
]

// RULES HEADER
export const RULES_DASHBOARD_HEADERS = [
    'Rule ID',
    'Rule Description',
    'Creation Date (UTC)',
    'Severity',
    'Category',
    'Status',
    'Delete'
]

// SEVERITY MAPPING
export enum SEVERITY {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL,
}

// SEVERITY COLOR
export enum SEVERITY_COLOR {
    Green,
    Gold,
    Orange,
    Red,
}

export const VIOLATION_PER_REPO_DASHBOARD_HEADERS = [
    'Repo Name',
    'Violation Amount',
]

export const TOP10_RULES_DASHBOARD_HEADERS = [
    'Rule Description',
    'Count',
]

// User/Admin - Register
export const API_GENERAL_USER_REGISTER = COMMON_PART + '/auth/user'

// User/Admin - LOG IN
export const API_GENERAL_USER_LOG_IN = COMMON_PART + '/auth/login'

// Admin - VIOLATION QUERY SEARCH
export const API_ADMIN_VIO_QUERY_SEARCH = COMMON_PART + '/violations'

// Admin - VIOLATION QUERY AGGREGATED (count-per-repo/top10)
export const API_ADMIN_VIO_QUERY_AGGREGATED = COMMON_PART + '/violations/aggregated'

// Admin - MANAGE ALL RULES
export const API_ADMIN_MANAGE_ALL_RULES = COMMON_PART + '/rules'

// Admin - MANAGE ALL RULES - add / delete a rule based on the axios action
export const API_ADMIN_MANAGE_A_RULE = COMMON_PART + '/rules/'

// Admin - MANAGE RULES STATUS
export const API_ADMIN_MANAGE_RULES_ENABLE = COMMON_PART + '/rules/enable/'

export const API_ADMIN_MANAGE_RULES_DISABLE = COMMON_PART + '/rules/disable/'

/**
 * Components String
 */

// RulesPanel

export const RULESPANEL_NO_RULE = 'No Rule in Database'
export const UPLOAD_RULES_FILE_LIMIT = 1

// Dashboard
export const DASHBOARD_NO_VIOLATION = 'Wow no violations~ Congratulations!!!'

