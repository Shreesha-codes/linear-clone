'use client';

import { motion } from 'framer-motion';
import type { FC } from 'react';
import { blurPopUp } from '@/lib/animations';

type Props = {
  text: string;
};

const BlurPopUpByWord: FC<Props> = ({ text }) => {
  const words = text.split(' ');
  return (
    <span className="block text-balance">
      <span className="inline-block align-top text-balance" style={{ wordSpacing: '0.25em' }}>
        {words.map((word, idx) => {
          // Use word + index as unique key to avoid issues with duplicate words
          const uniqueKey = `word-${idx}-${word.slice(0, 10)}`;
          return (
            <motion.span
              key={uniqueKey}
              className="inline-block"
              variants={blurPopUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 * idx }}
            >
              {word}
              {idx + 1 < words.length && '\u00A0'}
            </motion.span>
          );
        })}
      </span>
    </span>
  );
};

export default BlurPopUpByWord;
