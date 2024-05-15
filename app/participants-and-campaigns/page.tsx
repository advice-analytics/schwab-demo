import React, {Suspense} from 'react';

import NavMenuWrapper from "@/components/common/NavMenuWrapper";

const ParticipantsPage: React.FC = () => (
  <Suspense>
    <NavMenuWrapper activeItem={'Participants and Campaigns'} />
  </Suspense>
);

export default ParticipantsPage;