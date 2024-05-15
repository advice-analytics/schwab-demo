import React, {Suspense} from 'react';

import NavMenuWrapper from "@/components/common/NavMenuWrapper";

const Page = () => (
  <Suspense>
    <NavMenuWrapper activeItem={'Plan Health'} />
  </Suspense>
)

export default Page;