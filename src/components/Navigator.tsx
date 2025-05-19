import React from 'react';

import type {ReactNode} from 'react'
import '../assets/css/Navigator.css'

interface NavigatorProps {
  children: ReactNode;
}

export default function Navigator({ children }: NavigatorProps) {
  return <nav className='nav'>{children}</nav>;
}