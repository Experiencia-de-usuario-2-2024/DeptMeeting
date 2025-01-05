import React from 'react';
import Select from '@atlaskit/select';

interface Props {
  participants: Participant[];
  onChange: (selected: Participant[]) => void;
  isMulti?: boolean;
  disabled?: boolean;
}

export const ParticipantSelect = ({
  participants,
  onChange,
  isMulti,
  disabled
}: Props) => {
  return (
    <Select
      isMulti={isMulti}
      options={participants}
      onChange={onChange} 
      isDisabled={disabled}
    />
  );
};
