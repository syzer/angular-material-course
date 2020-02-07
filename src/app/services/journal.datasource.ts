import {CollectionViewer, DataSource} from '@angular/cdk/collections'
import {Observable, BehaviorSubject, of} from 'rxjs'
import {Journal} from '../model/journal'
import {JournalService} from './journal.service'
import {catchError, finalize} from 'rxjs/operators'


export class JournalDataSource implements DataSource<Journal> {
  private journalSubject = new BehaviorSubject<Journal[]>([])
  private loadingSubject = new BehaviorSubject<boolean>(false)
  public loading$ = this.loadingSubject.asObservable()

  constructor(private journalService: JournalService) {
  }

  loadJournals(courseId: number,
               filter: string,
               sortDirection: string,
               pageIndex: number,
               pageSize: number,
               sortColumn: string,
               // paginator?: any
  ) {

    this.loadingSubject.next(true)

    this.journalService.findEvents(courseId, filter, sortDirection, pageIndex, pageSize, sortColumn)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(journals => {
        this.journalSubject.next(journals)

        // setTimeout(() => {
        //   console.warn('stream coming', journals)
        //   journals.unshift({
        //     ...journals[0],
        //     id: 666
        //   })
        //   console.warn('stream coming2', journals)
        //
        //   this.journalSubject.next(journals)
        // }, 2000)
      })


  }

  connect(collectionViewer: CollectionViewer): Observable<Journal[]> {
    console.log('Connecting data source')
    return this.journalSubject.asObservable()
  }

  // TODO disconnect
  disconnect(collectionViewer: CollectionViewer): void {
    console.warn('disconnect')
    this.journalSubject.complete()
    this.loadingSubject.complete()
  }

}

