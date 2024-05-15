import React, {Suspense} from 'react';

import NavMenuWrapper from "@/components/common/NavMenuWrapper";

const CreateCampaignPage: React.FC = () => (
  <Suspense>
      <NavMenuWrapper activeItem={'Create Campaign'} />
  </Suspense>
)

export default CreateCampaignPage;