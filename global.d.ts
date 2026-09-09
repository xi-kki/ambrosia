/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      'disable-pan'?: boolean;
      'disable-zoom'?: boolean;
      ar?: boolean;
      'ar-modes'?: string;
      'environment-image'?: string;
      exposure?: string | number;
      'shadow-intensity'?: string | number;
      'shadow-softness'?: string | number;
      'tone-mapping'?: string;
      'interaction-prompt'?: string;
      loading?: string;
      poster?: React.ReactNode;
    };
  }
}