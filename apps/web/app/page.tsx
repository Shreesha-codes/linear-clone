import AmbientLighting from '@/components/ambient-lighting';
import type { FC } from 'react';
import Collaborate from './sections/collaborate';
import Customers from './sections/customers';
import Foundation from './sections/foundation';
import Hero from './sections/hero';
import IssueTracking from './sections/issue-tracking';
import LongTermPlanning from './sections/long-term-planning';
import ModernProductTeams from './sections/modern-product-teams';
import PreFooter from './sections/prefooter';

const Home: FC = () => {
  return (
    <main className=" min-h-screen pt-[calc(var(--header-top)+var(--header-height))]">
      <AmbientLighting />
      <Hero />
      <Customers />
      <ModernProductTeams />
      <LongTermPlanning />
      <IssueTracking />
      <Collaborate />
      <Foundation />
      <PreFooter />
    </main>
  );
};

export default Home;
