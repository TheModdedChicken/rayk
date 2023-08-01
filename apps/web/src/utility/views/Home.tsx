import { onMount, type Component, createRenderEffect } from 'solid-js';

import styles from './Home.module.css';
import FeatherIcon, { FeatherIcons } from '../components/FeatherIcon';
import TextArea from '../components/TextArea';

import bubble from '../../assets/icons/svg/bubble.svg';

const HomeView: Component = () => {
  return (
    <>
      <header class={styles.header}></header>
      <div class={styles.mainContent}>
        <TextArea placeholder={
          SplashText[Math.round(Math.random() * (SplashText.length - 1))]
        } />
      </div>
      <footer class={styles.footer}>
        <div class={styles.left_float}>
          <FeatherIcon icon={FeatherIcons.eye} options={{ height: 24, "stroke-width": 2 }} />
          <img src={bubble} style={{ "stroke-width": '2px' }}></img>
          {/* <FeatherIcon icon={FeatherIcons.tag} options={{ height: 24, "stroke-width": 2 }}/> */}
        </div>
        <div class={styles.right_float}>
          <FeatherIcon icon={FeatherIcons.send} options={{ height: 24, "stroke-width": 2, class: styles.send_button }}/>
        </div>
      </footer>
    </>
  );
};

export default HomeView;


const SplashText = [
  "What's on your mind?",
  "I don't like that",
  "Hi",
  "i dont have a single original thought in my brain",
  "Call me crazy but .....",
  "I just wanna rollie rollie rollie with a dab of ranch",
  "Crazy? I was crazy once",
  "What's good gangalang",
  "The fitness gram pacer test is a...",
  "That's what the point of the mask is.",
  "I- I- I be poppin bottles",
  "I got new the 4 g's on the jeep"
]