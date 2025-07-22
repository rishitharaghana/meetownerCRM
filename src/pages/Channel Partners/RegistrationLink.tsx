import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const SharePartnerLink: React.FC = () => {
  const { selectedUser } = useSelector((state: RootState) => state.user);
  const registrationLink = 'https://crm.mntechs.com/partners/addpartners';
  
  const message = encodeURIComponent(
    `Join as a Channel Partner!\nBuilder Name: ${selectedUser?.name || 'N/A'}\nCompany Name: ${selectedUser?.company_name || 'N/A'}\nRegister now: ${registrationLink}`
  );
  
  const whatsappLink = `https://wa.me/?text=${message}`;

  return (
    <div>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          backgroundColor: '#1c398e',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
        }}
      >
        Share via WhatsApp
      </a>
    </div>
  );
};

export default SharePartnerLink;