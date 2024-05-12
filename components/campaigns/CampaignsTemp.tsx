'use client';

import React, {useState} from "react";

import { Campaign } from "@/types/CampaignTypes";
import { deleteCampaignFromDatabase, saveCampaignToDatabase } from "@/utilities/firebaseClient";
import { Participant } from "@/types/ParticipantTypes";

interface CampaignsProps {
    uid?: string;
    selectedClient?: Participant | null;
}

const CampaignsTemp: React.FC<CampaignsProps> = ({ selectedClient, uid = '' }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    const handleClick = () => {
        window.open('/advisor/create-campaign', '_blank');
    }

    const handleEditPrompt = (campaignId: string, updatedPrompt: string) => {
        const updatedCampaigns: Campaign[] = campaigns.map((campaign) =>
            campaign.id === campaignId ? { ...campaign, prompt: updatedPrompt } : campaign
        );
        setCampaigns(updatedCampaigns);
    };

    const handleSavePrompt = async (uid: string, campaignId: string): Promise<void> => {
        try {
            const campaignToUpdate: Campaign | undefined = campaigns.find((campaign) => campaign.id === campaignId);
            if (campaignToUpdate) {
                await saveCampaignToDatabase(campaignToUpdate);
                alert('Campaign message updated successfully!');
            }
        } catch (error) {
            console.error('Error updating campaign:', error);
            throw new Error('Failed to update campaign. Please try again.');
        }
    };

    const handleCopyPrompt = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        alert('Campaign message copied to clipboard!');
    };

    const handleDeleteCampaign = async (campaignId: string): Promise<void> => {
        try {
            await deleteCampaignFromDatabase(campaignId);
            const updatedCampaigns: Campaign[] = campaigns.filter((campaign) => campaign.id !== campaignId);
            setCampaigns(updatedCampaigns);
            console.log('Campaign deleted successfully.');
        } catch (error) {
            console.error('Error deleting campaign:', error);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold mt-8 mb-4 text-navyblue">Existing Campaigns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
                        <p>Type: {campaign.type}</p>
                        <p>Age Group: {campaign.ageGroup}</p>
                        <div className="my-4">
                            <strong>Prompt:</strong>
                            <textarea
                                value={campaign.prompt ?? ''}
                                onChange={(e) => handleEditPrompt(campaign.id, e.target.value)}
                                placeholder="Edit campaign message..."
                                rows={4}
                                className="input-field shadow-md px-4 py-3 rounded-lg w-full resize-none"
                                style={{minHeight: '100px'}}
                            />
                            <div className="flex flex-col sm:flex-row justify-center items-center mt-4">
                                <button
                                    onClick={() => handleSavePrompt(uid, campaign.id)}
                                    className="btn-primary bg-green-500 text-white rounded-md py-1 px-2 my-2 w-full sm:w-auto"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => handleCopyPrompt(campaign.prompt ?? '')}
                                    className="btn-primary bg-blue-500 text-white rounded-md py-1 px-2 my-2 w-full sm:w-auto"
                                >
                                    Copy
                                </button>
                                <button
                                    onClick={() => handleDeleteCampaign(campaign.id)}
                                    className="btn-delete bg-red-500 text-white rounded-md py-1 px-2 my-2 w-full sm:w-auto"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="btn-primary bg-navyblue hover:bg-darknavyblue text-white mt-4 rounded-md py-3 px-6 font-medium"
                onClick={handleClick}
            >
                Create Campaign
            </button>
        </div>
    )
}

export default CampaignsTemp;