import { JSX } from 'solid-js';
import styles from './Bubble.module.css';
import { A } from '@solidjs/router';
import { RouterInput } from '../trpc';
import FeatherIcon, { FeatherIcons } from './FeatherIcon';

import atSignOff from '../../assets/icons/svg/at-sign-off.svg';
import AtSignOffIcon from '../../assets/icons/svg/atSignOff';

function Bubble (props: {
  name: string,
  owner?: string,
  visibility?: RouterInput['bubbles']['createBubble']['visibility'],

  children?: JSX.Element
}) {
  return (
    <div class={styles.bubble_container}>
      <div class={styles.left_float}>
        <div>
          <h6>{props.name}</h6>
          { props.owner ? <p class={styles.subtitle}>{props.owner}</p> : undefined }
        </div>
        {
          props.visibility 
          ? (
            props.visibility === 'ANON'
            ? <AtSignOffIcon class={styles.bubble_visibility_icon} height={22} />
            : 
            <FeatherIcon 
              options={{ 
                height: 22,
                class: styles.bubble_visibility_icon
              }}
              icon={(() => {
                if (props.visibility === 'PUBLIC') return FeatherIcons.globe;
                else if (props.visibility === 'UNLISTED') return FeatherIcons['link-2'];
                else return FeatherIcons.lock;
              })()}
            ></FeatherIcon>
          )
          : undefined
        }
      </div>
      <div class={styles.right_float}>{props.children}</div>
    </div>
  );
}

export default Bubble