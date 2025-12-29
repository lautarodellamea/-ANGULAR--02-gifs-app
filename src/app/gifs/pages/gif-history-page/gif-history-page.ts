import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifsService } from '../../services/gifs.service';
import { GifList } from '../../components/gif-list/gif-list';

@Component({
  selector: 'gif-history-page',
  imports: [GifList],
  templateUrl: './gif-history-page.html',
})

// las paginas las exportamos por defecto para que se puedan importar en el app.routes.ts sin necesidad de poner el nombre de la clase
export default class GifHistoryPage {
  gifService = inject(GifsService);

  // query = inject(ActivatedRoute).params.subscribe((params) => {
  //   console.log({ params });
  // });

  // asi transformamos el observable a señal
  query = toSignal(inject(ActivatedRoute).params.pipe(map((params) => params['query'])));
  // estamos inyectando el servicio del activated route, tenemos el observable (params) y le conectamos un operador map mediante el pipe para tomar los parametros y extraer el query (DIFICIL PERO SE PUEDE!!! GO GO GO)

  gifsByKey = computed(() => {
    return this.gifService.getHistoryGifs(this.query());
  });
}
