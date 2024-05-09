'use client'

import React, { useState, useEffect } from 'react';
import { saveValuePropToDatabase, getValuePropFromDatabase } from '@/utilities/firebaseClient';
import { useAuth } from '@/components/context/authContext';
import AdvisorBanner from "@/components/advisor/banner/AdvisorBanner";
import {AxiosResponse} from "axios";
import httpService from "@/services/http-service";

interface ValuePropProps {
  uid: string; // Change userId to uid
  onValuePropChange: (newValueProp: string) => void;
  initialValue: string;
}

const ageGroupOptions: { value: string; label: string }[] = [
  { value: '<25', label: '< 25' },
  { value: '25 - 35', label: '25 - 35' },
  { value: '35 - 45', label: '35 - 45' },
  { value: '45 - 55', label: '45 - 55' },
  { value: '55 - 65', label: '55 - 65' },
  { value: '65 +', label: '65 +' }
];

const roles: { value: string; label: string }[] = [
  { label: 'Executives', value: 'Executives' },
  { label: 'Business owners', value: 'Business owners' },
  { label: 'Family', value: 'Family' },
  { label: 'Retirees', value: 'Retirees' },
  { label: 'Other', value: 'Other' },
];

interface ValuePropositionData {
  id?: string;
  name?: string;
  external_id?: string;
  email?: string;
  plans?: string[];
  target_age_groups?: string[],
  target_roles?: string[],
  how_unique?: string;
  value_proposition?: string;
}

const ValueProp: React.FC<ValuePropProps> = ({ uid, onValuePropChange, initialValue }) => {
  const [valueProp, setValueProp] = useState(initialValue);
  const [currentChars, setCurrentChars] = useState(initialValue ? initialValue.length : 0);
  const [maxChars] = useState(250);
  const [loading, setLoading] = useState(false);

  const [userData, loadingAuth] = useAuth();
  // Extract uid from userData instead of userId
  const userId = userData?.uid || '';

  const [valueProposition, setValueProposition] = useState<ValuePropositionData>();

  useEffect(() => {
    const fetchValueProp = async () => {
      // if (uid) { // Use uid instead of userId
      //   setLoading(true);
      //   try {
      //     const fetchedValueProp = await getValuePropFromDatabase(uid); // Use uid instead of userId
      //     if (fetchedValueProp !== undefined) {
      //       setValueProp(fetchedValueProp);
      //       setCurrentChars(fetchedValueProp.length);
      //     } else {
      //       setValueProp('');
      //       setCurrentChars(0);
      //     }
      //   } catch (error) {
      //     console.error('Error fetching value proposition:', error);
      //   } finally {
      //     setLoading(false);
      //   }
      // }
      try {
        const response: AxiosResponse = await httpService.get('/v1/advisor/profile');
        setValueProposition(response?.data);
      }
      catch (error: any) {
        throw new Error(error);
      }
    };

    fetchValueProp();
  }, [uid]); // Re-run effect when uid changes

  const handleSave = async () => {
    // if (uid && valueProp.trim() !== '') {
    //   setLoading(true);
    //   try {
    //     await saveValuePropToDatabase(uid, valueProp); // Use uid instead of userId
    //     alert('Value proposition saved successfully!');
    //   } catch (error) {
    //     console.error('Error saving value proposition:', error);
    //     alert('Failed to save value proposition. Please try again.');
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    try {
      const response: AxiosResponse = await httpService.put(`/v1/advisor/profile`, valueProposition);
    }
    catch (error: any) {
      throw new Error(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValueProp = event.target.value;
    setValueProp(newValueProp);
    onValuePropChange(newValueProp);
    setCurrentChars(newValueProp.length);
  };

  const getColorForRating = (chars: number): string => {
    if (chars < maxChars * 0.5) {
      return 'text-red-500';
    } else if (chars < maxChars * 0.8) {
      return 'text-yellow-500';
    } else {
      return 'text-green-500';
    }
  };

  const handleAgeGroupChange = (event: { target: { value: string; }; }) => {
    const value: string = event.target.value;
    let updatedAgeOptions: string[] | undefined = valueProposition?.target_age_groups;

    if (!updatedAgeOptions) {
      return;
    }

    if (updatedAgeOptions.includes(value)) {
      updatedAgeOptions = updatedAgeOptions.filter((ageOption) => ageOption !== value);
    }
    else {
      updatedAgeOptions.push(value);
    }

    setValueProposition({ ...valueProposition, target_age_groups: updatedAgeOptions });
  }

  const handleRoleChange = (event: { target: { value: string; }; }) => {
    const value: string = event.target.value;
    let updatedUserRoles: string[] | undefined = valueProposition?.target_roles;

    if (!updatedUserRoles) {
      return;
    }

    if (updatedUserRoles.includes(value)) {
      updatedUserRoles = updatedUserRoles.filter((userRole) => userRole !== value);
    }
    else {
      updatedUserRoles.push(value);
    }

    setValueProposition({ ...valueProposition, target_roles: updatedUserRoles });
  }

  const handleNoteChange = (event: { target: { value: any; }; }) => {
    setValueProposition({ ...valueProposition, how_unique: event.target.value });
  }

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white flex flex-col gap-y-5 flex-grow">
      <div className={'flex justify-between items-center'}>
        <h2 className="text-2xl font-semibold text-navyblue">Value Proposition</h2>
        <button className={'btn-primary bg-navyblue hover:bg-darknavyblue text-white h-10 rounded-md px-6 font-medium'}>
          Edit
        </button>
      </div>
      <div className={'flex flex-col gap-y-4'}>
        <p>Describe your ideal client (Check all that apply)</p>
        <h4 className={'font-bold text-navyblue'}>Age</h4>
        <div className={'flex gap-x-7 flex-wrap'}>
          {ageGroupOptions.map((ageGroupOption, index: number) => (
            <div className={'inline-flex items-center'} key={index}>
              <input
                type={'checkbox'}
                value={ageGroupOption.value}
                id={`ageGroupOption${index + 1}`}
                className={'mr-3 mt-0.5'}
                onChange={handleAgeGroupChange}
                checked={valueProposition?.target_age_groups?.includes(ageGroupOption.value)}
              />
              <label htmlFor={`ageGroupOption${index + 1}`}>
                {ageGroupOption.label}
              </label>
            </div>
          ))}
        </div>
        <h4 className={'font-bold text-navyblue'}>Role</h4>
        <div className={'flex gap-x-7 flex-wrap'}>
          {roles.map((role, index: number) => (
            <div className={'inline-flex items-center'} key={index}>
              <input
                type={'checkbox'}
                value={role.value}
                id={`roleOption${index + 1}`}
                className={'mr-3 mt-0.5'}
                onChange={handleRoleChange}
                checked={valueProposition?.target_roles?.includes(role.value)}
              />
              <label htmlFor={`roleOption${index + 1}`}>
                {role.label}
              </label>
            </div>
          ))}
        </div>
        {valueProposition?.target_roles?.includes('Other') && (
          <input
            className={'rounded h-11 w-full md:w-[25rem] outline-none p-3.5'}
            style={{border: '1px solid lightgrey'}}
            placeholder={'e.g, athletes, inheritance, income, net worth'}
            onChange={handleRoleChange}
          />
        )}
        <div>
          <p>Briefly describe why you are unique</p>
          <textarea
            className={'rounded w-full md:w-[25rem] h-40 outline-none p-3.5 mt-3 resize-none'}
            style={{border: '1px solid lightgrey'}}
            placeholder={'e.g, i focus on complex family and business situations'}
            value={valueProposition?.how_unique}
            onChange={handleNoteChange}
          />
        </div>
      </div>
      {/*<div className="mb-4">*/}
      {/*  <label htmlFor="value-prop" className="block mb-2 text-navyblue">*/}
      {/*    Enter Value Prop:*/}
      {/*  </label>*/}
      {/*  <textarea*/}
      {/*    id="value-prop"*/}
      {/*    value={valueProp}*/}
      {/*    onChange={handleChange}*/}
      {/*    className="border rounded-lg p-2 w-full h-40 text-navyblue resize-none"*/}
      {/*    style={{backgroundColor: 'white', minHeight: '120px'}}*/}
      {/*    placeholder="Describe your value proposition here..."*/}
      {/*  ></textarea>*/}
      {/*  <p className={getColorForRating(currentChars)}>*/}
      {/*    {currentChars}/{maxChars} characters entered*/}
      {/*  </p>*/}
      {/*</div>*/}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSave}
          className={"bg-green-400 text-white px-4 py-2 rounded-md"}
        >
          Create Value Proposition
        </button>
      </div>
    </div>
  );
};

export default ValueProp;
