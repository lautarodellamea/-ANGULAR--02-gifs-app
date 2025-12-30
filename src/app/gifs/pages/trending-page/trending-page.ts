import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { GifList } from '../../components/gif-list/gif-list';
import { GifsService } from '../../services/gifs.service';
import { ScrollStateService } from 'src/app/shared/services/scroll-state.service';

// const imageUrls: string[] = [
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-6.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-7.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-8.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-9.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-10.jpg',
//   'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-11.jpg',
// ];

@Component({
  selector: 'app-trending-page',
  // imports: [GifList],
  templateUrl: './trending-page.html',
})

// los ciclos de vida los veremos en posteriores secciones
export default class TrendingPage implements AfterViewInit {
  // nueva forma de inyectar el servicio (se puede hacer en el constructor)
  gifsService = inject(GifsService);
  scrollStateService = inject(ScrollStateService);

  // podemos usar viewChild para usar el elemento html que tenemos en el template y viewChild para mas de un elemento
  // si usamos el viewChild y hay dos elementos que cumplen la condicion, solo se usara el primero que se encuentre
  scrollDivRef = viewChild<ElementRef>('groupDiv');

  // esto es para que se ejecute despues de que se haya renderizado el componente y se haya cargado el elemento html
  // lo usaremos para ir al scroll que teniamos guardado en el servicio
  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement; // obtenemos el elemento html nativo, el ? es por si el elemento no existe todabia

    // console.log(event);
    // console.log(scrollDiv);

    if (!scrollDiv) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollDiv;
    console.log({ scrollTop, scrollHeight, clientHeight });

    // const isAtBottom = scrollTop + clientHeight >= scrollHeight; // si el scroll top + el height del div es mayor o igual al height del div, entonces estamos al final
    // pero la peticion se hace un ratito antes de que se llegue al final
    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight; // 300 es un margen de seguridad para que la peticion se haga un ratito antes de que se llegue al final

    this.scrollStateService.trendingScrollState.set(scrollTop);

    console.log({ isAtBottom });
    if (isAtBottom) {
      // cargamos mas gifs (la pagina siguiente)
      this.gifsService.loadTrendingGifs();
    }
  }
}
