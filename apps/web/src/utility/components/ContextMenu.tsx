import { JSX, Show, createEffect, createSignal, onMount } from 'solid-js';
import styles from './ContextMenu.module.css';
import { Portal } from 'solid-js/web';

export interface ContextOption<T> {
  name?: string
  id: string
  hide?: T | undefined | null | false
  action: (data: { name?: string, id: string }) => void
  danger?: boolean
}

function ContextMenu<T> (props: {
  children: JSX.Element
  
  mouseToggle?: boolean,
  center?: boolean,
  width?: number,

  xToggle?: boolean,
  xOffset?: number,
  yToggle?: boolean,
  yOffset?: number,
  options: ContextOption<T>[],

  onClickOff?: () => any,
  onSelect?: (data: { name?: string, id: string }) => any
}) {
  const [ enabled, setState ] = createSignal(false);
  const [ pos, setPos ] = createSignal([ 0, 0 ]);

  const menuID = 'context_menu_' + crypto.getRandomValues(new Uint32Array(1))[0];
  const child = props.children as HTMLDivElement;

  if (props.mouseToggle) {
    window.addEventListener('mousemove', (event) => {
      if (!enabled()) setPos([
        (event.x) + (props.xOffset || 0),
        (event.y) + (props.yOffset || 0)
      ])
    });
  }

  window.addEventListener('click', (e) => {
    const target = e.target as Element;
    const childWasClicked = child.contains(target);
    const menuWasClicked = document.getElementById(menuID)?.contains(target);

    if (!props.mouseToggle) {
      const childRect = child.getBoundingClientRect();
      setPos([
        (props.xToggle ? childRect.left + childRect.width : childRect.left) + (props.xOffset || 0),
        (props.yToggle ? childRect.top + childRect.height : childRect.top)  + (props.yOffset || 0)
      ])
    }

    if (childWasClicked) setState( !enabled() );
    else if (!menuWasClicked && enabled()) {
      setState(false);
      if (props.onClickOff) props.onClickOff();
    }
  })

  return (
    <>
      {child}
      <Show when={enabled()}>
        <Portal>
          <div 
            id={menuID} 
            class={styles.context_menu} 
            style={{ 
              top: `${pos()[1]}px`, 
              left: `${pos()[0]}px`, 
              width: props.width ? `${props.width}px` : undefined
            }}
          >
            {props.options.map((o) => {
              if (o.hide) return false;

              return (
                <div 
                  classList={{ 
                    [styles.context_menu_option]: true, 
                    [styles.context_menu_option_danger]: o.danger,
                    [styles.context_menu_center]: props.center
                  }}
                  onClick={() => {
                    const data = { name: o.name, id: o.id };
                    o.action(data);
                    if (props.onSelect) props.onSelect(data);
                    setState(false);
                  }}
                >
                  {o.name || o.id}
                </div>
              )
            })}
          </div>
        </Portal>
      </Show>
    </>
  );
}

export default ContextMenu