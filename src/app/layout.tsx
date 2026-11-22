import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { studio } from '@/data/site';

export const metadata: Metadata = {
 title: `${studio.name} — Independent Design Studio`,
 description: 'Portafolio editorial e inmersivo de AS Design Studio. Identidad visual, diseño editorial y experiencias visuales.',
 robots: { index: !studio.isPrelaunch, follow: !studio.isPrelaunch },
 openGraph: {title: 'AS Design Studio', description: 'Creative identity. Visual experimentation. Made in Argentina.', type:'website'},
};
export const viewport: Viewport = { width:'device-width', initialScale:1, themeColor:'#070707' };
export default function RootLayout({children}:{children:ReactNode}){
 return <html lang="es"><body>{children}</body></html>;
}
