import { JSX, Show } from 'solid-js';
import styles from './Modal.module.css';
import { Portal } from 'solid-js/web';

function Modal (props: {
  show: boolean,
  onClickOff?: () => void,

  children?: JSX.Element
}) {
  window.addEventListener('click', (e) => {
    const target = e.target as Element;
    if (target.classList.contains(styles.modal_backdrop) && props.onClickOff) props.onClickOff();
  })

  return (
    <Show when={props.show}>
      <Portal>
        <div class={styles.modal_container}> 
          <div class={styles.modal_backdrop} />
          <div class={styles.modal_panel}>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}

export default Modal