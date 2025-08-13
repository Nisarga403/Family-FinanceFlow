import React from 'react';
import { FamilyHubMember, Gender } from '../types';
import { MaleAvatar, FemaleAvatar, UserAvatar, PriceTagIcon } from './icons/Icons';

interface FamilyHubProps {
    members: FamilyHubMember[];
}

const getAvatar = (member: FamilyHubMember) => {
    const avatarClass = "w-full h-full object-cover";
    switch (member.gender) {
        case Gender.MALE:
            return <MaleAvatar className={avatarClass} />;
        case Gender.FEMALE:
            return <FemaleAvatar className={avatarClass} />;
        case Gender.OTHER:
        default:
            return <UserAvatar className={avatarClass} />;
    }
};

const FamilyHub: React.FC<FamilyHubProps> = ({ members }) => {

    if (!members || members.length === 0) {
        return null;
    }

    return (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-sm p-4 border border-white/20 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 px-2">Family Hub</h3>
            <div className="flex items-end justify-center gap-4 sm:gap-6 h-40">
                {members.map((member, index) => (
                    <div key={member.id} className="relative group flex flex-col items-center">
                        <div 
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200 dark:bg-slate-700 p-1 shadow-lg transition-transform duration-300 group-hover:scale-110 animate-float"
                            style={{ animationDelay: `${index * 0.3}s` }}
                        >
                            {getAvatar(member)}
                        </div>
                        <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{member.name}</p>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-16 w-max max-w-xs p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 transform-gpu">
                            <h4 className="font-bold text-sm mb-1">{member.name}'s 30-Day Activity</h4>
                            <p>
                                <span className="font-semibold">Total Spent:</span> ₹{member.totalSpent.toLocaleString('en-IN')}
                            </p>
                            {member.topCategory && (
                                <p className="flex items-center gap-1">
                                    <PriceTagIcon className="w-3 h-3"/>
                                    <span className="font-semibold">Top Category:</span> {member.topCategory}
                                </p>
                            )}
                             <div className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FamilyHub;
