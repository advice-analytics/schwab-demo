'use client'

import React, {useEffect, useState} from 'react';
import {AxiosResponse} from "axios";
import httpService from "@/services/http-service";
import {useRouter, useSearchParams} from "next/navigation";
import BackButton from "@/components/common/BackButton";

interface CreateCampaignDataType {
    name?: string;
    msg_type: string[];
    target_advice_scores?: string[];
    target_age_groups?: string[];
    income_from?: number | null;
    income_to?: number | null;
    balance_from?: number | null;
    balance_to?: number | null;
    campaign_msg?: string;
    plan_id: string;
    suggested_campaign_msg?: string;
    last_update_date?: string;
    count?: number;
    id?: string;
}

const CreateCampaign: React.FC = () => {
    const params = useSearchParams();
    const planId: string = params?.get('planId') ?? '';
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [createCampaignData, setCampaignData] = useState<CreateCampaignDataType>({
        plan_id: planId,
        msg_type: [],
        name: '',
        income_from: null,
        income_to: null,
        balance_from: null,
        balance_to: null,
    });
    const campaignId: string = params?.get('campaignId') ?? '';
    const isEditForm: boolean = (params?.get('edit') ?? '') === 'true';
    const router = useRouter();

    const ageGroupOptions: { value: string; label: string }[] = [
        { value: '<25', label: '<25' },
        { value: '25-34', label: '25-34' },
        { value: '35-44', label: '35-44' },
        { value: '45-54', label: '45-54' },
        { value: '55-64', label: '55-64' },
        { value: '65+', label: '65+' }
    ];

    const adviceScoreOptions: { value: string; label: string }[] = [
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
    }, [campaignId, isEditForm]);

    const handleCreateCampaign = async (): Promise<void> => {
        if (!validateData()) {
            return;
        }
        try {
            setLoading(true);
            const response: AxiosResponse = await httpService.post('/v1/advisor/campaign', createCampaignData);
            router.replace(`/campaign-detail?planId=${planId}&campaignId=${isEditForm ? campaignId : response?.data}&regenerate=true`);
        }
        catch (error: any) {
            throw new Error(error);
        }
        finally {
            setLoading(false);
        }
    };

    const validateData = (): boolean => {
        try {
            if (!createCampaignData?.name) {
                throw 'Campaign name should not be empty';
            }
            if (!createCampaignData?.msg_type?.length) {
                throw 'At least one campaign type should be selected';
            }
        }
        catch (error: any) {
            setError(error);
            return false
        }
        return true;
    }

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

    const handleCampaignTypeChange = (event: { target: { value: string; }; }) => {
        let updatedValues: string[] = createCampaignData.msg_type;
        const value: string = event.target.value;

        if (updatedValues.includes(value)) {
            updatedValues = updatedValues.filter((updatedValue) => updatedValue != value);
        }
        else {
            updatedValues.push(value);
        }

        setCampaignData({ ...createCampaignData, msg_type: updatedValues });
    }

    return (
      <div className="container mx-auto p-4">
          <BackButton url={`/participants-and-campaigns?planId=${planId}`} />
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
                    className="border border-solid border-gray-300 outline-none px-4 py-3 rounded-lg w-full mt-2"
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-navyblue">Campaign Type</label>
                  <div className="flex space-x-4 mt-2">
                      <div className={'flex items-center'}>
                          <input
                            type="checkbox"
                            id="email"
                            name="campaignType"
                            value="email"
                            onChange={handleCampaignTypeChange}
                            className="mr-2"
                            checked={createCampaignData?.msg_type?.includes('email')}
                          />
                          <label htmlFor="email">Email</label>
                      </div>
                      <div className={'flex items-center'}>
                          <input
                            type="checkbox"
                            id="text"
                            name="campaignType"
                            value="text"
                            onChange={handleCampaignTypeChange}
                            className="mr-2"
                            checked={createCampaignData?.msg_type?.includes('text')}
                          />
                          <label htmlFor="text">Text</label>
                      </div>
                  </div>
              </div>
              <div>
                  <label htmlFor="ageGroup" className="block text-sm font-medium text-navyblue">
                      <p>Lets build the target participant list for the campaigns</p>
                      <br></br>
                      Age Group
                  </label>
                  <div className="flex flex-wrap mt-2">
                      {ageGroupOptions.map((option) => (
                        <div key={option.value} className="w-full sm:w-1/3 flex items-center">
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
                      Select topic focus
                  </label>
                  <div className="flex flex-wrap mt-2">
                      {adviceScoreOptions.map((option) => (
                        <div key={option.value} className="w-full sm:w-1/3 flex items-center">
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
                  <div className={'mt-6'}>
                      <div className={'flex flex-col md:flex-row md:items-center gap-y-3 md:gap-x-6'}>
                          <b>Income($)</b>
                          <input
                            type={'number'}
                            className={'rounded h-9 w-full md:w-[20rem] outline-none p-3'}
                            style={{border: '1px solid lightgrey'}}
                            placeholder={'From'}
                            onChange={(event) => {
                                setCampaignData({ ...createCampaignData, income_from: event.target.value ? parseInt(event.target.value) : null })
                            }}
                            value={createCampaignData?.income_from ?? ''}
                          />
                          <input
                            type={'number'}
                            className={'rounded h-9 w-full md:w-[20rem] outline-none p-3'}
                            style={{border: '1px solid lightgrey'}}
                            placeholder={'To'}
                            onChange={(event) => {
                                setCampaignData({ ...createCampaignData, income_to: event.target.value ? parseInt(event.target.value) : null })
                            }}
                            value={createCampaignData?.income_to ?? ''}
                          />
                      </div>
                      <div className={'flex flex-col md:flex-row md:items-center gap-y-3 md:gap-x-6 mt-5'}>
                          <b>Balance($)</b>
                          <input
                            type={'number'}
                            className={'rounded h-9 w-full md:w-[20rem] -ml-0.5 outline-none p-3'}
                            style={{border: '1px solid lightgrey'}}
                            placeholder={'From'}
                            onChange={(event) => {
                                setCampaignData({ ...createCampaignData, balance_from: event.target.value ? parseInt(event.target.value) : null })
                            }}
                            value={createCampaignData?.balance_from ?? ''}
                          />
                          <input
                            type={'number'}
                            className={'rounded h-9 w-full md:w-[20rem] outline-none p-3'}
                            style={{border: '1px solid lightgrey'}}
                            placeholder={'To'}
                            onChange={(event) => {
                                setCampaignData({ ...createCampaignData, balance_to: event.target.value ? parseInt(event.target.value) : null })
                            }}
                            value={createCampaignData?.balance_to ?? ''}
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
                            isEditForm ? 'Save Changes' : 'Create Campaign'
                          )}
                    </button>
              </div>
              <div className={'text-center'}>
                {error && <p className="text-red-600 mt-2">{error}</p>}
              </div>
          </div>
      </div>
    );
};

export default CreateCampaign;