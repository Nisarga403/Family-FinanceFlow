

import React, { useState } from 'react';
import { FamilyMember, Gender } from '../types';
import { TrashIcon, MaleIcon, FemaleIcon, UserIcon, MaleAvatar, FemaleAvatar, UserAvatar, FamilyAvatar } from './icons/Icons';

interface FamilyPageProps {
    members: FamilyMember[];
    onAddMember: (name: string, gender: Gender) => void;
    onDeleteMember: (id: number) => void;
}

const FamilyPage: React.FC<FamilyPageProps> = ({ members, onAddMember, onDeleteMember }) => {
    const [newName, setNewName] = useState('');
    const [gender, setGender] = useState<Gender>(Gender.MALE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            onAddMember(newName.trim(), gender);
            setNewName('');
            setGender(Gender.MALE);
        }
    };

    const getAvatar = (member: FamilyMember) => {
        const avatarClass = "w-full h-full";
        switch (member.gender) {
            case Gender.MALE:
                return <MaleAvatar className={avatarClass} />;
            case Gender.FEMALE:
                return <FemaleAvatar className={avatarClass} />;
            case Gender.OTHER:
                return <UserAvatar className={avatarClass} />;
            default:
                return <UserAvatar className={avatarClass} />;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-primary-50 dark:bg-primary-950/50 rounded-lg p-1">
                    <FamilyAvatar />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Family Members</h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        Add members to track spending across your household. When a member is deleted, their transactions are reassigned to 'Me'.
                    </p>
                </div>
            </div>

            {/* Add Member Form */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                 <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 flex-wrap">
                    <div className="flex-grow w-full sm:w-auto">
                        <label htmlFor="memberName" className="sr-only">Member Name</label>
                        <input
                            id="memberName"
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter member's name"
                            className="flex-grow w-full px-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                        {(Object.keys(Gender) as Array<keyof typeof Gender>).map(key => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setGender(Gender[key])}
                                className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-colors duration-200 capitalize ${
                                    gender === Gender[key] 
                                    ? 'bg-white shadow-sm text-primary dark:bg-slate-800 dark:text-primary-400' 
                                    : 'text-slate-500 hover:bg-slate-300/50 dark:text-slate-400 dark:hover:bg-slate-600/50'
                                }`}
                            >
                                {Gender[key] === Gender.MALE && <MaleIcon className="h-4 w-4" />}
                                {Gender[key] === Gender.FEMALE && <FemaleIcon className="h-4 w-4" />}
                                {Gender[key] === Gender.OTHER && <UserIcon className="h-4 w-4" />}
                                {Gender[key]}
                            </button>
                        ))}
                    </div>
                    <button type="submit" className="w-full sm:w-auto py-2.5 px-6 bg-gradient-to-r from-primary to-primary-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-primary-600 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200">
                        Add Member
                    </button>
                </form>
            </div>
           

            {/* Members List */}
            <div>
                <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Your Family</h3>
                {members.length > 0 ? (
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm">
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                            {members.map((member, index) => (
                                <li 
                                    key={member.id} 
                                    className="flex items-center justify-between p-4 group animate-fade-in-up"
                                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-700">
                                            {getAvatar(member)}
                                        </div>
                                        <span className="text-lg font-medium text-slate-800 dark:text-slate-200">{member.name}</span>
                                    </div>
                                    <button
                                        onClick={() => onDeleteMember(member.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 dark:hover:text-red-400 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        aria-label={`Delete member ${member.name}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                        <p className="text-slate-500 dark:text-slate-400">No family members added yet. Add one above to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FamilyPage;