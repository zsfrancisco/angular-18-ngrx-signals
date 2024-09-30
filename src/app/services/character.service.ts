import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CharacterAdapter } from '@app/adapters/character.adapter';
import { Character, CharacterInfo } from '@app/models/character.model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly baseUrl = 'https://rickandmortyapi.com/api/character';
  http = inject(HttpClient);

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      console.info('Error prevented for testing', error);
      return of(result as T);
    };
  }

  getAllCharacters(): Observable<Character[]> {
    return this.http
      .get<CharacterInfo>(this.baseUrl)
      .pipe(
        map(CharacterAdapter),
        catchError(this.handleError<Character[]>([]))
      );
  }

  addCharacter(character: Omit<Character, 'id'>): Observable<void> {
    return this.http
      .post<void>(this.baseUrl, { character })
      .pipe(catchError(this.handleError<void>()));
  }

  removeCharacter(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http
      .delete<void>(url)
      .pipe(catchError(this.handleError<void>()));
  }

  updateCharacter(character: Character): Observable<void> {
    return this.http
      .put<void>(this.baseUrl, { character })
      .pipe(catchError(this.handleError<void>()));
  }
}
