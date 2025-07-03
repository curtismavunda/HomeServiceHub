
import React from 'react';
import { VettingStatus } from '../types';

interface VettingBadgesProps {
  status: VettingStatus;
}

const Badge: React.FC<{ text: string; icon: string; enabled: boolean }> = ({ text, icon, enabled }) => {
  if (!enabled) return null;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <i className={`fas ${icon} mr-1.5`}></i>
      {text}
    </span>
  );
};

const TopProBadge: React.FC = () => (
     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 ring-1 ring-inset ring-indigo-600/20">
      <i className="fas fa-crown mr-1.5 text-indigo-500"></i>
      Top Pro
    </span>
);


const VettingBadges: React.FC<VettingBadgesProps> = ({ status }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {status.isTopPro && <TopProBadge />}
      <Badge text="Background Checked" icon="fa-shield-alt" enabled={status.backgroundChecked} />
      <Badge text="Skills Verified" icon="fa-check-circle" enabled={status.skillsVerified} />
      <Badge text="References Checked" icon="fa-users" enabled={status.referencesChecked} />
    </div>
  );
};

export default VettingBadges;
