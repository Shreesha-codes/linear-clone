'use client';

import { type FC, useState } from 'react';
import { tabHeaders } from '../../feature-lookup-data';
import styles from './styles.module.css';
import TabBody from './tab-body';
import TabHeader from './tab-header';

const WideCard: FC = () => {
  const [currentTab, setCurrentTab] = useState<string>(tabHeaders[0].id);
  return (
    <div className={styles.wide__card__tab}>
      <TabHeader tabHeaders={tabHeaders} currentTab={currentTab} changeTab={setCurrentTab} />
      <TabBody currentTab={currentTab} />
    </div>
  );
};

export default WideCard;
