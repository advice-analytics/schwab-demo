'use client'

import React from 'react'
import { useState } from 'react'
import NavMenu from './NavMenu'

export const Header: React.FC = () => (
  <header id='App:Header' className={'w-full fixed top-0 left-0 z-50'}>
    <NavMenu/>
  </header>
);

export default Header;