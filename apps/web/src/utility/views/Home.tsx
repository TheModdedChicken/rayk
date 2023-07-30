import type { Component } from 'solid-js';

import styles from './Home.module.css';
import FeatherIcon, { FeatherIcons } from '../elements/FeatherIcon';
import TextArea from '../elements/TextArea';

const HomeView: Component = () => {
  return (
    <>
      <header class={styles.header}>
        <div>
          <h6>TheModdedChicken</h6>
          <FeatherIcon icon={FeatherIcons['chevron-down']} options={{ height: 24, "stroke-width": 1.5 }}/>
        </div>
        <div>
          {/* <FeatherIcon icon={FeatherIcons.star} options={{ height: 24, "stroke-width": 2 }}/> */}
          <FeatherIcon icon={FeatherIcons.settings} options={{ height: 24, "stroke-width": 2 }}/>
        </div>
      </header>
      <div class={styles.mainContent}>
        <TextArea placeholder="What's on your mind?" />
      </div>
      <footer class={styles.footer}>

      </footer>
    </>
  );
};

export default HomeView;
