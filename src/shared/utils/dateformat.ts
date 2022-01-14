/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const dateFormat = (date: Date, formatDate = 'dd MMM yyyy') => {
  return format(date, formatDate, {
    locale: ptBR,
  });
};
