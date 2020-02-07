import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Course} from '../model/course';
import {map} from 'rxjs/operators';
import {Journal} from '../model/journal';


@Injectable()
export class JournalService {

  constructor(private http: HttpClient) {
  }

  findCourseById(courseId: number): Observable<Course> {
    return this.http.get<Course>(`/api/courses/${courseId}`)
  }

  findAllCourses(): Observable<Course[]> {
    return this.http.get('/api/courses')
      .pipe(
        map(res => res['payload'])
      )
  }

  findEvents(courseId: number, filter = '', sortOrder = 'asc',
             pageNumber = 0, pageSize = 3, sortColumn = 'seqNo'): Observable<Journal[]> {

    return this.http.get('/api/lessons', {
      params: new HttpParams()
        .set('courseId', courseId.toString())
        .set('filter', filter)
        .set('sortColumn', sortColumn)
        .set('sortOrder', sortOrder)
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
    }).pipe(
      map(res => res['payload'])
    )
  }

}
