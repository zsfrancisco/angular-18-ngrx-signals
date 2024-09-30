import { inject, InjectionToken } from '@angular/core';
import { Character } from '@app/models/character.model';
import { CharacterService } from '@app/services/character.service';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  removeEntities,
  removeEntity,
  setEntities,
  updateAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { lastValueFrom } from 'rxjs';

type StoreState = {
  characters: Character[];
};

const initialState: StoreState = {
  characters: [],
};

const STORE_STATE = new InjectionToken<StoreState>('GlobalStore', {
  factory: () => initialState,
});

export const GlobalStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(STORE_STATE)),
  withEntities<Character>(),
  withMethods((store, characterService = inject(CharacterService)) => ({
    getCharacter(id: number) {
      return store.characters().find((character) => character.id === id);
    },
    async addCharacter(character: Omit<Character, 'id'>) {
      try {
        await lastValueFrom(characterService.addCharacter(character));
        // patchState(
        //   store,
        //   addEntity({
        //     id: new Date().getTime(),
        //     ...character,
        //   })
        // );
        patchState(store, ({ characters }) => ({
          characters: [
            ...characters,
            {
              id: new Date().getTime(),
              ...character,
            },
          ],
        }));
      } catch (error) {}
    },
    async removeCharacter(id: number) {
      try {
        await lastValueFrom(characterService.removeCharacter(id));
        // patchState(store, removeEntity(id));
        patchState(store, ({ characters }) => ({
          characters: characters.filter((character) => character.id !== id),
        }));
      } catch (error) {}
    },
    async updateCharacter(character: Character) {
      try {
        await lastValueFrom(characterService.updateCharacter(character));
        // patchState(
        //   store,
        //   updateEntity({ id: character.id, changes: { ...character } })
        // );
        patchState(store, ({ characters }) => ({
          characters: characters.map((c) =>
            c.id === character.id ? { ...c, ...character } : c
          ),
        }));
      } catch (error) {}
    },
  })),
  withHooks({
    async onInit(store, characterService = inject(CharacterService)) {
      try {
        const characters = await lastValueFrom(
          characterService.getAllCharacters()
        );
        patchState(store, { characters });
      } catch (error) {}
    },
  })
);
