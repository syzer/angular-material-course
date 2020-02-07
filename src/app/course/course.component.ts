import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {MatPaginator} from '@angular/material/paginator'
import {MatSort} from '@angular/material/sort'
import {MatTableDataSource} from '@angular/material/table'
import {Course} from '../model/course'
import {JournalService} from '../services/journal.service'
import {debounceTime, distinctUntilChanged, startWith, tap, delay} from 'rxjs/operators'
import {merge, fromEvent} from 'rxjs'
import {JournalDataSource} from '../services/journal.datasource'


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {
  course: Course
  dataSource: JournalDataSource
  displayedColumns = ['seqNo', 'description', 'duration']

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator
  @ViewChild(MatSort, {static: false}) sort: MatSort
  @ViewChild('input', {static: false}) input: ElementRef

  constructor(private route: ActivatedRoute,
              private journalService: JournalService) {
  }

  ngOnInit() {
    this.course = this.route.snapshot.data['course']
    this.dataSource = new JournalDataSource(this.journalService)
    this.dataSource.loadJournals(this.course.id, '', 'asc',  0, 3,  'seqNo')
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() =>
      this.paginator.pageIndex = 0)

    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0

          this.loadJournalPage()
        })
      )
      .subscribe()

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(console.warn),
        tap(() => this.loadJournalPage())
      )
      .subscribe()

    // setTimeout(() => {
    //   // this.paginator
    //   // TODO figure out if to put in page
    //   this.course.lessonsCount += 1
    // }, 2000)
  }

  loadJournalPage() {
    this.dataSource.loadJournals(
      this.course.id,
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      this.sort.active,
      // this.paginator
    )
  }


}
