import feather, { icons as FeatherIcons } from 'feather-icons';

function FeatherIcon (props: {
  icon: feather.FeatherIcon,
  options?: Partial<feather.FeatherAttributes>
}) {
  const element = (<div innerHTML={props.icon.toSvg(props.options)}></div>) as HTMLDivElement;
  
  return element.firstElementChild;
}

export default FeatherIcon
export {
  FeatherIcons
}