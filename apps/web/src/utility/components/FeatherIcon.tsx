import feather, { icons as FeatherIcons } from 'feather-icons';
import { JSX } from 'solid-js';

function FeatherIcon (props: {
  id?: string,
  class?: string,
  icon: feather.FeatherIcon,
  options?: Partial<feather.FeatherAttributes>,
  onClick?: (e: MouseEvent) => any
}) {
  const div = (<div innerHTML={props.icon.toSvg(props.options)}></div>) as HTMLDivElement;
  const element = div.firstElementChild as SVGElement;
  if (props.id) element.id = props.id;
  if (props.class) element.classList.add(...props.class.split(' '));
  if (props.onClick) element.addEventListener('click', props.onClick);
  
  return element;
}

export default FeatherIcon
export {
  FeatherIcons
}