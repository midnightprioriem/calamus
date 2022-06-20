import Icon from './Icon';
import { IconProps, IconPropDefaults } from './type';

const SectionOpenIcon = (props: IconProps) => {
  return (
    <Icon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.055 4L16.7179 4C17.3977 4 17.9487 4.55103 17.9487 5.23077C17.9487 5.91051 17.3977 6.46154 16.7179 6.46154H13.1077C11.7088 6.46154 10.7336 6.4625 9.97445 6.52452C9.22963 6.58538 8.8017 6.69882 8.47757 6.86398C7.78282 7.21797 7.21797 7.78282 6.86398 8.47757C6.69882 8.8017 6.58538 9.22963 6.52452 9.97445C6.4625 10.7336 6.46154 11.7088 6.46154 13.1077V26.8923C6.46154 28.2912 6.4625 29.2664 6.52452 30.0256C6.58538 30.7704 6.69882 31.1983 6.86398 31.5224C7.21797 32.2172 7.78282 32.782 8.47758 33.136C8.8017 33.3012 9.22963 33.4146 9.97445 33.4755C10.7336 33.5375 11.7088 33.5385 13.1077 33.5385H26.8923C28.2912 33.5385 29.2664 33.5375 30.0256 33.4755C30.7704 33.4146 31.1983 33.3012 31.5224 33.136C32.2172 32.782 32.782 32.2172 33.136 31.5224C33.3012 31.1983 33.4146 30.7704 33.4755 30.0256C33.5375 29.2664 33.5385 28.2912 33.5385 26.8923V23.2821C33.5385 22.6023 34.0895 22.0513 34.7692 22.0513C35.449 22.0513 36 22.6023 36 23.2821V26.945C36 28.2789 36 29.3548 35.9288 30.226C35.8555 31.123 35.7007 31.911 35.3293 32.6399C34.7393 33.7979 33.7979 34.7393 32.6399 35.3293C31.911 35.7007 31.123 35.8555 30.226 35.9288C29.3548 36 28.2789 36 26.945 36H13.055C11.7211 36 10.6452 36 9.774 35.9288C8.87696 35.8555 8.08903 35.7007 7.36006 35.3293C6.20214 34.7393 5.26072 33.7979 4.67073 32.6399C4.2993 31.911 4.14445 31.123 4.07116 30.226C3.99998 29.3548 3.99999 28.2789 4 26.945V13.055C3.99999 11.7211 3.99998 10.6452 4.07116 9.774C4.14445 8.87696 4.2993 8.08903 4.67073 7.36006C5.26072 6.20214 6.20214 5.26072 7.36006 4.67073C8.08903 4.2993 8.87696 4.14445 9.774 4.07116C10.6452 3.99998 11.7211 3.99999 13.055 4ZM23.6923 5.23079C23.6923 4.55105 24.2433 4.00002 24.923 4.00002H34.7692C35.4489 4.00002 36 4.55105 36 5.23078L36 15.0769C36 15.7567 35.4489 16.3077 34.7692 16.3077C34.0895 16.3077 33.5384 15.7567 33.5384 15.0769L33.5384 8.20213L20.8703 20.8703C20.3896 21.3509 19.6104 21.3509 19.1297 20.8703C18.6491 20.3896 18.6491 19.6104 19.1297 19.1297L31.7979 6.46156H24.923C24.2433 6.46156 23.6923 5.91052 23.6923 5.23079Z"
      />
    </Icon>
  );
};

SectionOpenIcon.defaultProps = {
  ...IconPropDefaults,
};

export default SectionOpenIcon;
