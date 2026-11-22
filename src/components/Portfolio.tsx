import { BrandSymbols } from './BrandSymbols';
import { SiteHeader } from './SiteHeader';
import { Hero } from './sections/Hero';
import { Exhibition } from './sections/Exhibition';
import { SelectedWorks } from './sections/SelectedWorks';
import { Expertise } from './sections/Expertise';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { CaseStudyDialog } from './CaseStudyDialog';
import { CursorLabel } from './CursorLabel';
import { Loader } from './Loader';
import { MotionController } from './MotionController';

export function Portfolio(){
 return <>
  <BrandSymbols />
  <SiteHeader />
  <main><Hero /><Exhibition /><SelectedWorks /><Expertise /><About /><Contact /></main>
  <CaseStudyDialog />
  <CursorLabel />
  <Loader />
  <MotionController />
 </>;
}
