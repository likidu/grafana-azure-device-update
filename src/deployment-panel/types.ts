import { ButtonVariant } from '@grafana/ui';

export interface ButtonOptions {
  text?: string;
  variant?: ButtonVariant;
}

export interface Options {
  buttons: ButtonOptions[];
  orientation: 'vertical' | 'horizontal';
}
