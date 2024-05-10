'use client'

import React, {useEffect, useState} from 'react';
import {AxiosResponse} from "axios";
import httpService from "@/services/http-service";
import {useRouter, useSearchParams} from "next/navigation";
import BackButton from "@/components/common/BackButton";

interface CreateCampaignDataType {
    name?: string;
    msg_type?: string[];
    target_advice_scores?: string[];
    target_age_groups?: string[];
    income_from?: number;
    income_to?: number;
    balance_from?: number;
    balance_to?: number;
    campaign_msg?: string;
    plan_id: string;
    suggested_campaign_msg?: string;
    last_update_date?: string;
    count?: number;
    id?: string;
}

const CreateCampaign: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [createCampaignData, setCampaignData] = useState<CreateCampaignDataType>({
        plan_id: useSearchParams()?.get('planId') ?? '',
        balance_from: 0,
        income_from: 0,
    });
    const params = useSearchParams();
    const campaignId: string = params?.get('campaignId') ?? '';
    const isEditForm: boolean = (params?.get('edit') ?? '') === 'true';
    const router = useRouter();

    const ageGroupOptions: { value: string; label: string }[] = [
        { value: '<25', label: '<25' },
        { value: '25-35', label: '25-35' },
        { value: '35-45', label: '35-45' },
        { value: '45-55', label: '45-55' },
        { value: '55-65', label: '55-65' },
        { value: '65+', label: '65+' }
    ];

    const adviceScoreOptions: { value: string; label: string }[] = [
        { label: 'Overall Advice', value: 'advice' },
        { label: 'Retirement', value: 'retirement' },
        { label: 'Financial Planning', value: 'finances' },
        { label: 'Investment', value: 'investing' },
        { label: 'Estate Planning', value: 'estate' },
        { label: 'Tax Planning', value: 'taxes' }
    ];

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const response: AxiosResponse = await httpService.get(`/v1/advisor/campaign/${campaignId}`);
                setCampaignData({ ...createCampaignData, ...response.data });
            }
            catch (err: any) {
                throw new Error(err);
            }
        };

        isEditForm && fetchCampaign();
    }, [campaignId]);

    const handleCreateCampaign = async (): Promise<void> => {
        try {
            setLoading(true);
            const response: AxiosResponse = await httpService.post('/v1/advisor/campaign', createCampaignData);
            router.back();
        }
        catch (error: any) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    const handleAgeGroupsChange = (event: { target: { value: string; }; }) => {
        const value: string = event.target.value;
        let updatedAgeOptions: string[] = createCampaignData?.target_age_groups ?? [];

        if (updatedAgeOptions.includes(value)) {
            updatedAgeOptions = updatedAgeOptions.filter((ageOption) => ageOption !== value);
        }
        else {
            updatedAgeOptions.push(value);
        }

        setCampaignData({ ...createCampaignData, target_age_groups: updatedAgeOptions });
    }

    const handleAdviceScoresChange = (event: { target: { value: string; }; }) => {
        const value: string = event.target.value;
        let updatedAdviceScores: string[] = createCampaignData?.target_advice_scores ?? [];

        if (updatedAdviceScores.includes(value)) {
            updatedAdviceScores = updatedAdviceScores.filter((adviceScores) => adviceScores !== value);
        }
        else {
            updatedAdviceScores.push(value);
        }

        setCampaignData({ ...createCampaignData, target_advice_scores: updatedAdviceScores });
    }

    return (
      <div className="container mx-auto p-4">
          <BackButton />
          <h2 className="text-3xl mt-5 font-semibold mb-8 text-navyblue">
              {isEditForm ? 'Edit Campaign' : 'New Campaign'}
          </h2>
          <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                  <label htmlFor="campaignName" className="block text-sm font-medium text-gray-600 text-navyblue">
                      Campaign Name
                  </label>
                  <input
                    id="campaignName"
                    type="text"
                    value={createCampaignData?.name}
                    onChange={(event) => {
                        setCampaignData({ ...createCampaignData, name: event.target.value });
                    }}
                    placeholder="Enter campaign name"
                    className="input-field shadow-md px-4 py-3 rounded-lg w-full"
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-navyblue">Campaign Type</label>
                  <div className="flex space-x-4">
                      <div>
                          <input
                            type="radio"
                            id="email"
                            name="campaignType"
                            value="email"
                            onChange={(event) => {
                                setCampaignData({ ...createCampaignData, msg_type: [event.target.value] });
                            }}
                            className="mr-2"
                            checked={createCampaignData?.msg_type?.includes('email')}
                          />
                          <label htmlFor="email">Email</label>
                      </div>
                      <div>
                          <input
                            type="radio"
                            id="text"
                            name="campaignType"
                            value="text"
                            onChange={(event) => {
                                setCampaignData({ ...createCampaignData, msg_type: [event.target.value] });
                            }}
                            className="mr-2"
                            checked={createCampaignData?.msg_type?.includes('text')}
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
                              type="checkbox"
                              id={option.value}
                              name="ageGroup"
                              value={option.value}
                              onChange={handleAgeGroupsChange}
                              className="mr-2"
                              checked={createCampaignData?.target_age_groups?.includes(option.value)}
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
                        <div key={option.value} className="w-full sm:w-1/3">
                            <input
                              type="checkbox"
                              id={option.value}
                              onChange={handleAdviceScoresChange}
                              className="mr-2"
                              value={option.value}
                              checked={createCampaignData?.target_advice_scores?.includes(option.value)}
                            />
                            <label htmlFor={option.value}>
                                {option.label}
                            </label>
                        </div>
                      ))}
                  </div>
                  <div className={'mt-3'}>
                      <div className={'flex flex-col md:flex-row md:items-center gap-y-3 md:gap-x-6'}>
                          <b>Income</b>
                          <input
                            className={'rounded h-9 w-full md:w-[20rem] outline-none p-3'}
                            style={{border: '1px solid lightgrey'}}
                            placeholder={'From'}
                            onChange={(event) => {
                                setCampaignData({ ...createCampaignData, income_from: parseInt(event.target.value) })
                            }}
                            value={createCampaignData?.income_from || 0}
                          />
                          <input
                            className={'rounded h-9 w-full md:w-[20rem] outline-none p-3'}
                            style={{border: '1px solid lightgrey'}}
                            placeholder={'To'}
                            onChange={(event) => {
                                setCampaignData({ ...createCampaignData, income_to: parseInt(event.target.value) })
                            }}
                            value={createCampaignData?.income_to || 0}
                          />
                      </div>
                      <div className={'flex flex-col md:flex-row md:items-center gap-y-3 md:gap-x-6 mt-5'}>
                          <b>Balance</b>
                          <input
                            className={'rounded h-9 w-full md:w-[20rem] -ml-0.5 outline-none p-3'}
                            style={{border: '1px solid lightgrey'}}
                            placeholder={'From'}
                            onChange={(event) => {
                                setCampaignData({ ...createCampaignData, balance_from: parseInt(event.target.value) })
                            }}
                            value={createCampaignData?.balance_from || 0}
                          />
                          <input
                            className={'rounded h-9 w-full md:w-[20rem] outline-none p-3'}
                            style={{border: '1px solid lightgrey'}}
                            placeholder={'To'}
                            onChange={(event) => {
                                setCampaignData({ ...createCampaignData, balance_to: parseInt(event.target.value) })
                            }}
                            value={createCampaignData?.balance_to || 0}
                          />
                      </div>
                  </div>
              </div>
              {/*<div>*/}
              {/*    <label htmlFor="messageContent" className="block text-sm font-medium text-gray-600 text-navyblue">*/}
              {/*        Type Your Call to Action*/}
              {/*    </label>*/}
              {/*    <textarea*/}
              {/*      id="messageContent"*/}
              {/*      onChange={(event) => {*/}
              {/*          setCampaignData({ ...createCampaignData, campaign_msg: event.target.value });*/}
              {/*      }}*/}
              {/*      placeholder="Enter message content"*/}
              {/*      rows={4}*/}
              {/*      className="rounded h-32 w-full p-3 mt-3 outline-none resize-none"*/}
              {/*      style={{border: '1px solid lightgrey'}}*/}
              {/*      value={createCampaignData?.campaign_msg}*/}
              {/*    />*/}
              {/*</div>*/}
              <div className={'text-center'}>
                    <button
                        onClick={handleCreateCampaign}
                        className="btn-primary bg-navyblue hover:bg-darknavyblue text-white mt-2 rounded-md py-2.5 px-5 font-medium transition duration-300 ease-in-out"
                        disabled={loading}
                    >
                          {loading ? (
                            isEditForm ? 'Saving...' : 'Creating Campaign...'
                          ) : (
                            isEditForm ? 'Save' : 'Create Campaign'
                          )}
                    </button>
              </div>
              {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
      </div>
    );
};

export default CreateCampaign;