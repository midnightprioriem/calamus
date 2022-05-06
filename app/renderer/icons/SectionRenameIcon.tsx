import Icon from './Icon';
import { IconProps, IconPropDefaults } from './type';

const SectionRenameIcon = (props: IconProps) => {
  return (
    <Icon {...props}>
      <path d="M35.8059 4.98996C36.3434 4.0433 37.5337 3.71894 38.4646 4.2655L39.0265 4.59538C39.9574 5.14193 40.2764 6.35243 39.7389 7.29909L38.7657 9.01317L34.8327 6.70404L35.8059 4.98996Z" />
      <path d="M37.9344 10.5245L34.0014 8.21537L26.1327 22.0278C25.8809 22.4713 25.7341 22.9683 25.7039 23.4795L25.4845 27.1977C25.4685 27.469 25.7639 27.6425 25.987 27.4927L29.0438 25.4404C29.464 25.1582 29.8139 24.7804 30.0657 24.3369L37.9344 10.5245Z" />
      <path d="M7.89319 13.7723C3.5339 13.7723 0 17.366 0 21.799V27.9733C0 32.4063 3.5339 36 7.89319 36H30.9656C35.3249 36 38.8588 32.4063 38.8588 27.9733V23.0338C38.8588 22.0108 38.0433 21.1815 37.0373 21.1815C36.0313 21.1815 35.2158 22.0108 35.2158 23.0338V27.9733C35.2158 30.3603 33.3129 32.2954 30.9656 32.2954H7.89319C5.54588 32.2954 3.64301 30.3603 3.64301 27.9733V21.799C3.64301 19.412 5.54588 17.4769 7.89319 17.4769H24.2867C25.2927 17.4769 26.1082 16.6476 26.1082 15.6246C26.1082 14.6016 25.2927 13.7723 24.2867 13.7723H7.89319Z" />
      <path d="M19.4294 27.9733C20.7707 27.9733 21.8581 26.8676 21.8581 25.5036C21.8581 24.1396 20.7707 23.0338 19.4294 23.0338C18.0881 23.0338 17.0007 24.1396 17.0007 25.5036C17.0007 26.8676 18.0881 27.9733 19.4294 27.9733Z" />
      <path d="M13.3577 25.5036C13.3577 26.8676 12.2704 27.9733 10.929 27.9733C9.58771 27.9733 8.50036 26.8676 8.50036 25.5036C8.50036 24.1396 9.58771 23.0338 10.929 23.0338C12.2704 23.0338 13.3577 24.1396 13.3577 25.5036Z" />
    </Icon>
  );
};

SectionRenameIcon.defaultProps = {
  ...IconPropDefaults,
};

export default SectionRenameIcon;