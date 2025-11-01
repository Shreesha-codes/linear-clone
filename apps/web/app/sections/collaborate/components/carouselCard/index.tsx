import { Plus } from 'lucide-react';
import Image from 'next/image';
import type { FC } from 'react';
import styles from './styles.module.css';
const CarouselCard: FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.img__container}>
        <div className={styles.img__wrapper}>
          <Image src="/collaborate-img1.avif" alt="" width={336} height={469} />
        </div>
      </div>

      <div className={styles.content__container}>
        <div className={styles.card__heading__container}>
          <h3> Powerful git workflows </h3>
          <p> Automate pull requests and commit workflows </p>
        </div>

        <button className={styles.icon__button}>
          <Plus />
        </button>
      </div>
    </div>
  );
};

export default CarouselCard;
