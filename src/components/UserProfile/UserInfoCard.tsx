import React from 'react';
import {
  User2,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Option {
  value: number;
  text: string;
}

const designationOptions: Option[] = [
  { value: 1, text: "Admin" },
  { value: 7, text: "Manager" },
  { value: 8, text: "TeleCaller" },
  { value: 9, text: "Marketing Executive" },
  { value: 10, text: "Customer Support" },
  { value: 11, text: "Customer Service" },
];

export default function UserInfoCard() {
  const { selectedUser, loading, error } = useSelector((state: RootState) => state.user);

 

  

  return (
    <div className="relative rounded-3xl bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 p-10 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
      <div className="mb-10">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          addhar card : {selectedUser?.aadhar_number}
        </h2>
         <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          pancard:{selectedUser?.pan_card_number}
        </h2>
         <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          rera number:{selectedUser?.rera_number}
        </h2>
         <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          company address:{selectedUser?.company_address}
        </h2>
         <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          company name:{selectedUser?.company_name}
        </h2>
         <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          representive name:{selectedUser?.representative_name}
        </h2>
      </div>

     

      
    </div>
  );
}
