import { Character, CharacterInfo } from '@app/models/character.model';

export const CharacterAdapter = (characterInfo: CharacterInfo): Character[] => [
  ...characterInfo.results,
];
