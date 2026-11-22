"use client";
import { useEffect } from 'react';
import { initializeMotion } from '@/lib/motion-runtime';

/** Hidrata la coreografía DOM existente de la V2.4, una sola vez. */
export function MotionController(){
 useEffect(() => { initializeMotion(); }, []);
 return null;
}
