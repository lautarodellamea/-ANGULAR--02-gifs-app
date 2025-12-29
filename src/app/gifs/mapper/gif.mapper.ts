import { Gif } from '../interface/gif.interface';
import { GiphyItem } from '../interface/giphy.interfaces';

export class GifMapper {
  // Para mapear un item a un gif
  static mapGiphyItemToGif(item: GiphyItem): Gif {
    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url,
    };
  }

  // Para mapear un array de items a un array de gifs
  static mapGiphyItemsToGifArray(items: GiphyItem[]): Gif[] {
    return items.map(this.mapGiphyItemToGif);
  }
}
