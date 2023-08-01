import { JSX } from 'solid-js';
import styles from './Header.module.css';
import { A } from '@solidjs/router';

interface TextOptions {
  text: string
  href?: string
}

function Header (props: {
  title?: TextOptions | string,
  subtitle?: TextOptions | string

  children?: JSX.Element
}) {
  return (
    <div class={styles.header_container}>
      <div class={styles.left_float}>
        <div>
          {(() => {
            const title = props.title;
            if (!title) return false;

            if (typeof title === 'string') return (<h6>{title}</h6>);
            else {
              const text = (<h6>{title.text}</h6>);
              if (!title.href) return text;
              else return (<A href={title.href}>{text}</A>);
            }
          })()}
          {(() => {
            const subtitle = props.subtitle;
            if (!subtitle) return false;

            if (typeof subtitle === 'string') return (<p class={styles.subtitle}>{subtitle}</p>);
            else {
              const text = (<p class={styles.subtitle}>{subtitle.text}</p>);
              if (!subtitle.href) return text;
              else return (<A href={subtitle.href}>{text}</A>);
            }
          })()}
        </div>
      </div>
      <div class={styles.right_float}>{props.children}</div>
    </div>
  );
}

export default Header