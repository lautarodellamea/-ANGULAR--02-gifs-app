import { Component, inject, signal } from '@angular/core';
import { Gif } from '../../interface/gif.interface';
import { GifsService } from '../../services/gifs.service';
import { GifList } from '../../components/gif-list/gif-list';

@Component({
  selector: 'app-search-page',
  imports: [GifList],
  templateUrl: './search-page.html',
})
export default class SearchPage {
  gifService = inject(GifsService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    this.gifService.searchGifs(query).subscribe((resp) => {
      this.gifs.set(resp);
    });
  }
}
