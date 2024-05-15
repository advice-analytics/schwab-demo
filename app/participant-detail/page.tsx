import React, {Suspense} from 'react';

import NavMenuWrapper from "@/components/common/NavMenuWrapper";

const Page = () => (
  <Suspense>
    <NavMenuWrapper activeItem={'Participant Detail'} />
  </Suspense>
)

export default Page;