import Icon from './Icon';
import { IconProps, IconPropDefaults } from './type';

const SettingsIcon = (props: IconProps) => {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 7.5C29.5147 7.5 27.5 9.51472 27.5 12C27.5 14.4853 29.5147 16.5 32 16.5C34.4853 16.5 36.5 14.4853 36.5 12C36.5 9.51472 34.4853 7.5 32 7.5ZM24.65 10.5C25.3449 7.07664 28.3716 4.5 32 4.5C36.1421 4.5 39.5 7.85786 39.5 12C39.5 16.1421 36.1421 19.5 32 19.5C28.3716 19.5 25.3449 16.9234 24.65 13.5L2 13.5C1.17157 13.5 0.5 12.8284 0.5 12C0.5 11.1716 1.17157 10.5 2 10.5L24.65 10.5ZM8 23.5C5.51472 23.5 3.5 25.5147 3.5 28C3.5 30.4853 5.51472 32.5 8 32.5C10.4853 32.5 12.5 30.4853 12.5 28C12.5 25.5147 10.4853 23.5 8 23.5ZM0.5 28C0.5 23.8579 3.85786 20.5 8 20.5C11.6284 20.5 14.6551 23.0766 15.35 26.5L38 26.5C38.8284 26.5 39.5 27.1716 39.5 28C39.5 28.8284 38.8284 29.5 38 29.5L15.35 29.5C14.6551 32.9234 11.6284 35.5 8 35.5C3.85786 35.5 0.5 32.1421 0.5 28Z"
      />
    </Icon>
  );
};

SettingsIcon.defaultProps = {
  ...IconPropDefaults,
};

export default SettingsIcon;
