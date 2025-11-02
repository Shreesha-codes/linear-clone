import { modernProductCards } from '@/lib/constant';
import type { FC } from 'react';
import CarouselCard from '../carousel-card';
import styles from './styles.module.css';

const Carousel: FC = () => {
  return (
    <div>
      <div className={styles.carousel__container}>
        <div className={styles.carousel__inner__container}>
          {modernProductCards.map((card) => (
            <CarouselCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
