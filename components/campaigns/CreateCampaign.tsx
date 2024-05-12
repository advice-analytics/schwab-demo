'use client'

import React, { useState } from 'react';
import { Campaign } from '@/types/CampaignTypes';
import { saveCampaignToDatabase, deleteCampaignFromDatabase, getCampaignsForUser } from '@/utilities/firebaseClient';
import { generateCampaignPrompt } from '@/utilities/promptGenAI';
import { useAuth } from '../context/authContext';
import { Participant } from '@/types/ParticipantTypes';

interface CampaignsProps {
    uid?: string;
    selectedClient?: Participant | null;
}

const Campaigns: React.FC<CampaignsProps> = ({ selectedClient, uid = '' }) => {
    const [newCampaignName, setNewCampaignName] = useState<string>('');
    const [selectedPlan, setSelectedPlan] = useState('558'); // Default to '558'
    const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('');
    const [selectedScenario, setSelectedScenario] = useState<string[]>([]);
    const [messageContent, setMessageContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    const [userData, loadingAuth] = useAuth();
    const userId = userData?.uid || '';

    const ageGroupOptions: { value: string; label: string }[] = [
        { value: '< 25', label: '< 25' },
        { value: '25 - 35', label: '25 - 35' },
        { value: '35 - 45', label: '35 - 45' },
        { value: '45 - 55', label: '45 - 55' },
        { value: '55 - 65', label: '55 - 65' },
        { value: '65 +', label: '65 +' },
        { value: 'All', label: 'ALL' },
    ];

    const adviceScoreOptions = ['Retirement', 'Financial', 'Investment', 'Estate', 'Tax'];

    const handleAgeGroupChange = (value: string) => {
        setSelectedAgeGroup(value);
    };

    const handleAdviceScoreChange = (option: string) => {
        const isSelected = selectedScenario.includes(option);
        if (isSelected) {
            setSelectedScenario(selectedScenario.filter((item) => item !== option));
        } else {
            setSelectedScenario([...selectedScenario, option]);
        }
    };



    const clearInputFields = () => {
        setNewCampaignName('');
        setSelectedAgeGroup('');
        setSelectedScenario([]);
        setMessageContent('');
        setError('');
    };

        const createCampaign = async (): Promise<void> => {
        try {
            if (!newCampaignName || !selectedAgeGroup || selectedScenario.length === 0 || !messageContent) {
                setError('Please fill out all fields.');
                return;
            }

            setLoading(true);

            const adviceScores = selectedScenario.join(', ');

            const campaignType = selectedPlan === 'email' ? 'email' : 'text';

            const campaignPrompt = await generateCampaignPrompt(
                selectedPlan,
                newCampaignName,
                campaignType,
                adviceScores,
                selectedAgeGroup,
                messageContent,
                userId
            );

            const campaignData: Campaign = {
                id: '', // Firebase will assign an ID
                name: newCampaignName,
                type: campaignType,
                ageGroup: selectedAgeGroup,
                planName: selectedPlan,
                prompt: campaignPrompt,
                participant: selectedClient || null,
                plan: selectedPlan,
            };

            await saveCampaignToDatabase(campaignData);
            setCampaigns([...campaigns, campaignData]);
            clearInputFields();
            alert('Campaign created successfully!');
        } catch (error) {
            console.error('Error creating campaign:', error);
            setError('Failed to create campaign. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCampaign = async (): Promise<void> => {
        try {
            await createCampaign();
        } catch (error) {
            console.error('Error handling create campaign:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-semibold mb-8 text-navyblue">New Campaign</h2>
            <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                    <label htmlFor="selectedPlan" className="block text-sm font-medium text-gray-600 text-navyblue">
                        Plan
                    </label>
                    <select
                        id="selectedPlan"
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="input-field shadow-md px-4 py-3 rounded-lg w-full"
                        disabled={selectedPlan === '558'}
                    >
                        <option value="558">Plan 558</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="campaignName" className="block text-sm font-medium text-gray-600 text-navyblue">
                        Campaign Name
                    </label>
                    <input
                        id="campaignName"
                        type="text"
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                        placeholder="Enter campaign name"
                        className="input-field shadow-md px-4 py-3 rounded-lg w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 text-navyblue">Campaign Type</label>
                    <div className="flex space-x-4">
                        <div>
                            <input
                                type="radio"
                                id="email"
                                name="campaignType"
                                value="email"
                                checked={selectedPlan === 'email'}
                                onChange={() => setSelectedPlan('email')}
                                className="mr-2"
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="text"
                                name="campaignType"
                                value="text"
                                checked={selectedPlan === 'text'}
                                onChange={() => setSelectedPlan('text')}
                                className="mr-2"
                            />
                            <label htmlFor="text">Text</label>
                        </div>
                    </div>
                </div>
                <div>


                    <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-600 text-navyblue">
                        <p>Lets build the target participant list for the campaigns</p>
                        <br></br>
                        Age Group
                    </label>
                    <div className="flex flex-wrap">
                        {ageGroupOptions.map((option) => (
                            <div key={option.value} className="w-full sm:w-1/3">
                                <input
                                    type="radio"
                                    id={option.value}
                                    name="ageGroup"
                                    value={option.value}
                                    checked={selectedAgeGroup === option.value}
                                    onChange={() => handleAgeGroupChange(option.value)}
                                    className="mr-2"
                                />
                                <label htmlFor={option.value}>{option.label}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="selectedScenario" className="block text-sm font-medium text-gray-600 text-navyblue">
                        Select Advice Scores (up to 3)
                    </label>
                    <div className="flex flex-wrap">
                        {adviceScoreOptions.map((option) => (
                            <div key={option} className="w-full sm:w-1/3">
                                <input
                                    type="checkbox"
                                    id={option}
                                    checked={selectedScenario.includes(option)}
                                    onChange={() => handleAdviceScoreChange(option)}
                                    className="mr-2"
                                />
                                <label htmlFor={option}>{option}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="messageContent" className="block text-sm font-medium text-gray-600 text-navyblue">
                        Type Your Call to Action
                    </label>
                    <textarea
                        id="messageContent"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Enter message content"
                        rows={4}
                        className="input-field shadow-md px-4 py-3 rounded-lg w-full"
                    />
                </div>
                <button
                    onClick={handleCreateCampaign}
                    className="btn-primary bg-navyblue hover:bg-darknavyblue text-white mt-4 w-full rounded-md py-3 px-6 font-medium transition duration-300 ease-in-out"
                >
                    {loading ? 'Creating Campaign...' : 'Create Campaign'}
                </button>
                {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default Campaigns;