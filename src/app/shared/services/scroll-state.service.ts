import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  trendingScrollState = signal(0);

  // para guardar el scroll de cada pagina podriamos hacer esto
  // pagesScrollState = signal<Record<string, number>>({
  //   trending: 0,
  //   search: 0,
  //   history: 0,
  // });
}
