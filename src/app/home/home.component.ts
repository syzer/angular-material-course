import {Component, OnInit} from '@angular/core'
import {Course} from '../model/course'
import {Observable} from 'rxjs'
import {JournalService} from '../services/journal.service'
import {map} from 'rxjs/operators'

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>

    advancedCourses$: Observable<Course[]>

    constructor(private coursesService: JournalService) {

    }

    ngOnInit() {

        const courses$ = this.coursesService.findAllCourses()

        this.beginnerCourses$ = courses$.pipe(
          map(courses => courses.filter(course => course.category === 'BEGINNER') )
        )

        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter(course => course.category === 'ADVANCED') )
        )

    }

}
