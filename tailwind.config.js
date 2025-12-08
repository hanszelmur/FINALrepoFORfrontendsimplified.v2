/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        status: {
          available: '#10b981',
          reserved: '#f97316',
          pending: '#3b82f6',
          sold: '#6b7280',
          withdrawn: '#ef4444',
        },
        inquiry: {
          new: '#8b5cf6',
          assigned: '#3b82f6',
          inProgress: '#0ea5e9',
          waiting: '#f97316',
          scheduled: '#10b981',
          interested: '#22c55e',
          notInterested: '#ef4444',
          undecided: '#f59e0b',
          depositPaid: '#14b8a6',
          successful: '#059669',
          cancelled: '#dc2626',
        },
      },
    },
  },
  plugins: [],
};
