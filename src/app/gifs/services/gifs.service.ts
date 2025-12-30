import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interface/giphy.interfaces';
import { Gif } from '../interface/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY = 'gifs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}'; //Record<string, gifs[]>
  const gifs = JSON.parse(gifsFromLocalStorage);
  console.log(gifs);
  return gifs;
};
// de esta forma guardamos los gifs en el historial de búsqueda
// {
//   'goku': [gif1, gif2, gif3]
//   'vegeta': [gif4, gif5, gif6]
//   'gohan': [gif7, gif8, gif9]
//   'goku': [gif10, gif11, gif12]
//   'vegeta': [gif13, gif14, gif15]
//   'gohan': [gif16, gif17, gif18]
//   'goku': [gif19, gif20, gif21]
//   'vegeta': [gif22, gif23, gif24]
//   'gohan': [gif25, gif26, gif27]
// }

@Injectable({ providedIn: 'root' })
export class GifsService {
  // Inyectamos el objeto HttpClient para hacer peticiones HTTP
  private http = inject(HttpClient);

  public trendingGifs = signal<Gif[]>([]);
  public trendingGifsLoading = signal<boolean>(false);
  private trendingPage = signal(0);

  // para usar el mansonry debemos tener los gifs en este formato
  // [[gif1, gif2, gif3], [gif4, gif5, gif6], [gif7, gif8, gif9]]
  public trendingGifsGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }
    console.log(groups);
    return groups;
  });

  public searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  // cada vez que la señal searchHistory cambia, se recalcula el computed
  public searchHistoryKeys = computed<string[]>(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();

    // si voy a otra página y vuelvo a la página de trending, el servicio ya está creado y no se vuelve a disparar
    console.log('Servicio creado');
  }

  saveGifsToLocalStorage = effect(() => {
    // cada vez que la señal searchHistory cambia, se guarda en el localStorage
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  loadTrendingGifs() {
    // esto es para tener solo un loadTrendingGifs por vez
    // si esta en true, no se hace la peticion
    if (this.trendingGifsLoading()) return;

    // pero si esta en false, se hace la peticion
    this.trendingGifsLoading.set(true);

    this.http
      .get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          offset: this.trendingPage() * 20,
        },
      })
      // hasta que no nos suscribamos a la respuesta, no se ejecuta la petición
      .subscribe((resp) => {
        // console.log(resp);

        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        console.log(gifs);
        this.trendingGifs.update((currentGifs) => [...currentGifs, ...gifs]); // añadimos los nuevos gifs a los gifs existentes
        this.trendingPage.update((currentPage) => currentPage + 1); // incrementamos la pagina
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return (
      this.http
        .get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/search`, {
          params: {
            api_key: environment.giphyApiKey,
            limit: 20,
            q: query,
          },
        })
        // el pipe es para manejar la respuesta de la petición
        .pipe(
          // el tap me permite ejecutar un efecto secundario, en este caso imprimir la respuesta en la consola
          // tap((resp) => {
          //   console.log(resp);
          // }),

          // el map me permite transformar la respuesta y emitirla, en este caso mapear los items a gifs
          // barre cada item del array y lo transforma
          map(({ data }) => data), // me devuelve el array de items sin la metadata (pagination, etc.)
          map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

          tap((items) => {
            this.searchHistory.update((history) => ({
              ...history,
              [query.toLowerCase()]: items,
            }));
          })
        )
    );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
