

import React from 'react';

// General Navigation Icons
export const DashboardIcon: React.FC = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const TransactionIcon: React.FC = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 12L3 8m4 8l4-8m6 12V4m0 12l-4 8m4-8l4 8" />
  </svg>
);

export const BudgetIcon: React.FC = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
  </svg>
);

export const FamilyIcon: React.FC = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.122-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.122-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export const LightBulbIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const DreamPlannerIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export const VideoStoryIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
);

export const LogoIcon: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="url(#paint0_linear_1_2)"/>
        <path d="M10 16L14 12L18 16L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 20L14 16L18 20L22 16" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
        <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9a3412"/>
            <stop offset="1" stopColor="#fb923c"/>
        </linearGradient>
        </defs>
    </svg>
);

export const AccountsIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

export const ReportsIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const InvestmentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export const DebtsIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8" />
  </svg>
);

export const SettingsIcon: React.FC = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


// Dashboard Icons
export const BalanceIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
);

export const IncomeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 6v1m0-10a9 9 0 110 18 9 9 0 010-18z" />
    </svg>
);

export const ExpenseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
);

// Transaction Icons
export const ArrowUpIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

export const ArrowDownIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

export const GoalIcon: React.FC = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1014.12 11.88a3 3 0 00-4.242 4.242z" />
    </svg>
);

export const CalendarClockIcon: React.FC = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v3l2 1" />
    </svg>
);

export const VolumeUpIcon: React.FC<{className?: string}> = ({className, ...props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);


// Action Icons
export const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const PencilIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

export const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
);

export const PriceTagIcon: React.FC<{className?: string}> = ({className, ...props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM4 14l4.5-4.5 5.5 5.5L21 8" />
    </svg>
);


// Chatbot Icons
export const ChatbotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        {/* Main head shape filled with currentColor (white) */}
        <path d="M20,21H4a2,2,0,0,1-2-2V9A2,2,0,0,1,4,7H20a2,2,0,0,1,2,2v10A2,2,0,0,1,20,21Z" />

        {/* Antenna */}
        <path d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="12" cy="3.5" r="1.5" fill="currentColor" />

        {/* Eyes group for animation */}
        <g className="robot-eyes">
            {/* Eyes are filled with the app's primary color to stand out */}
            <rect x="7" y="11" width="3" height="4" rx="1.5" fill="#7c2d12" />
            <rect x="14" y="11" width="3" height="4" rx="1.5" fill="#7c2d12" />
        </g>
        
        {/* Smile */}
        <path d="M9 17a3 3 0 006 0" stroke="#7c2d12" fill="none" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);


export const SendIcon: React.FC = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h14" />
    </svg>
);

export const CloseIcon: React.FC = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Gender Icons
export const MaleIcon: React.FC<{className?: string}> = ({className, ...props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12zm6-11l-4 4m0 0V7m0 4h4" />
    </svg>
);

export const FemaleIcon: React.FC<{className?: string}> = ({className, ...props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12zm0 0v5m-3-2h6" />
    </svg>
);

export const UserIcon: React.FC<{className?: string}> = ({className, ...props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const FamilyAvatar: React.FC<{className?: string}> = ({className, ...props}) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="3" stroke="#0F172A">
        {/* Person 1 (right, female-ish) */}
        <path d="M43 38V42C43 42.7956 40.3137 44 37 44C33.6863 44 31 42.7956 31 42V38" fill="#a8a29e"/>
        <path d="M45 31C45 34.866 41.4183 38 37 38C32.5817 38 29 34.866 29 31C29 27.134 32.5817 24 37 24C41.4183 24 45 27.134 45 31Z" fill="#F3D1A9"/>
        <path d="M42 17C42 10.3726 37.9411 5 37 5C30.3726 5 25 10.3726 25 17H29C29 12.5817 32.5817 9 37 9C41.4183 9 45 12.5817 45 17H42Z" fill="#78350F" />


        {/* Person 2 (left, male-ish) */}
        <path d="M17 38V42C17 42.7956 14.3137 44 11 44C7.68629 44 5 42.7956 5 42V38" fill="#ea580c"/>
        <path d="M19 31C19 34.866 15.4183 38 11 38C6.58172 38 3 34.866 3 31C3 27.134 6.58172 24 11 24C15.4183 24 19 27.134 19 31Z" fill="#F3D1A9"/>
        <path d="M19 24C19 19.5817 15.4183 16 11 16C6.58172 16 3 19.5817 3 24H19Z" fill="#431407"/>

        {/* Person 3 (center, child) */}
        <path d="M30 22V25C30 28.3137 27.3137 31 24 31C20.6863 31 18 28.3137 18 25V22" fill="#E5E7EB"/>
        <path d="M32 15C32 20.5228 28.4183 25 24 25C19.5817 25 16 20.5228 16 15C16 9.47715 19.5817 5 24 5C28.4183 5 32 9.47715 32 15Z" fill="#F3D1A9"/>
        <path d="M30 11C30 6.58172 27.3137 3 24 3C20.6863 3 18 6.58172 18 11H30Z" fill="#c2410c"/>
      </g>
    </svg>
);

// Gender Avatars
export const MaleAvatar: React.FC<{className?: string}> = ({className, ...props}) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="3" stroke="#0F172A">
        <path d="M37 31V35C37 39.4183 30.4183 43 24 43C17.5817 43 11 39.4183 11 35V31" fill="#ea580c"/>
        <path d="M35 24C35 30.0751 30.0751 35 24 35C17.9249 35 13 30.0751 13 24C13 17.9249 17.9249 13 24 13C30.0751 13 35 17.9249 35 24Z" fill="#F3D1A9"/>
        <path d="M32 17C32 10.9249 28.4183 6 24 6C19.5817 6 16 10.9249 16 17H32Z" fill="#78350F"/>
        <path d="M22 30.5C22.6667 31.1667 25.3333 31.1667 26 30.5" strokeWidth="2"/>
      </g>
      <circle cx="19.5" cy="25.5" r="1.5" fill="#0F172A"/>
      <circle cx="28.5" cy="25.5" r="1.5" fill="#0F172A"/>
    </svg>
);

export const FemaleAvatar: React.FC<{className?: string}> = ({className, ...props}) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="3" stroke="#0F172A">
            <path d="M37 31V35C37 39.4183 30.4183 43 24 43C17.5817 43 11 39.4183 11 35V31" fill="#a8a29e"/>
            <path d="M35 24C35 30.0751 30.0751 35 24 35C17.9249 35 13 30.0751 13 24C13 17.9249 17.9249 13 24 13C30.0751 13 35 17.9249 35 24Z" fill="#F3D1A9"/>
            <path d="M36 17C36 10.3726 30.6274 5 24 5C17.3726 5 12 10.3726 12 17H16C16 12.5817 19.5817 9 24 9C28.4183 9 32 12.5817 32 17H36Z" fill="#78350F"/>
            <path d="M22 30.5C22.6667 31.1667 25.3333 31.1667 26 30.5" strokeWidth="2"/>
        </g>
        <circle cx="19.5" cy="25.5" r="1.5" fill="#0F172A"/>
        <circle cx="28.5" cy="25.5" r="1.5" fill="#0F172A"/>
    </svg>
);

export const UserAvatar: React.FC<{className?: string}> = ({className, ...props}) => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="3" stroke="#0F172A">
            <path d="M37 31V35C37 39.4183 30.4183 43 24 43C17.5817 43 11 39.4183 11 35V31" fill="#E5E7EB"/>
            <path d="M35 24C35 30.0751 30.0751 35 24 35C17.9249 35 13 30.0751 13 24C13 17.9249 17.9249 13 24 13C30.0751 13 35 17.9249 35 24Z" fill="#F3D1A9"/>
            <path d="M33 17C33 11.4772 29.0457 7 24 7C18.9543 7 15 11.4772 15 17H33Z" fill="#c2410c"/>
            <path d="M22 30H26" strokeWidth="2"/>
        </g>
        <circle cx="19.5" cy="25.5" r="1.5" fill="#0F172A"/>
        <circle cx="28.5" cy="25.5" r="1.5" fill="#0F172A"/>
    </svg>
);

export const QuestionMarkCircleIcon: React.FC<{className?: string}> = ({className, ...props}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);