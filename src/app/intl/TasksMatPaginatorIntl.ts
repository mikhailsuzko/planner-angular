import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class TasksMatPaginatorIntl extends MatPaginatorIntl {

  of: string = this.translate.instant('PAGING.OF');

  constructor(private translate: TranslateService,) {
    super();
    this.itemsPerPageLabel = translate.instant('PAGING.PAGE-SIZE')!;
    this.previousPageLabel = translate.instant('PAGING.PREV');
    this.nextPageLabel = translate.instant('PAGING.NEXT');
    this.lastPageLabel = translate.instant('PAGING.LAST');
    this.firstPageLabel = translate.instant('PAGING.FIRST');
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' ' + this.of + ' ' + length;
  };

}
