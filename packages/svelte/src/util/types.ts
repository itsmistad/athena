import type { AthenaComponentStyles } from '@athena-ui/base';
import type { PartialDeep } from 'type-fest';

export type PartialAthenaComponentStyle<T extends keyof typeof AthenaComponentStyles> = PartialDeep<
    typeof AthenaComponentStyles[T]
> & {
    [key: string]: string;
};
