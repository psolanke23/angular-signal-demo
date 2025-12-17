import { Component, computed, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { CoursesService } from "../services/courses.service";
import { Course, sortCoursesBySeqNo } from "../models/course.model";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { CoursesCardListComponent } from "../courses-card-list/courses-card-list.component";
import { MatDialog } from "@angular/material/dialog";
import { MessagesService } from "../messages/messages.service";
import { catchError, from, throwError } from "rxjs";
import { toObservable, toSignal, outputToObservable, outputFromObservable } from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import { MessagesComponent } from '../messages/messages.component';

@Component({
    selector: 'home',
    standalone: true,
    imports: [
        MatTabGroup,
        MatTab,
        CoursesCardListComponent,
        LoadingIndicatorComponent,
        MessagesComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

    #courses = signal<Course[]>([]);
    // coursesService = inject(CoursesServiceWithFetch);
    coursesService = inject(CoursesService);
    loadingService = inject(LoadingService);
    dialog = inject(MatDialog);
    messagesService = inject(MessagesService);

    beginnerCourses = computed(() => {
        const courses = this.#courses();
        return courses.filter(course => course.category === 'BEGINNER');
    })

    advancedCourses = computed(() => {
        const courses = this.#courses();
        return courses.filter(course => course.category === 'ADVANCED');
    })

    constructor() {
        effect(() => {
            console.log("beginner courses:", this.beginnerCourses());
            console.log("advanced courses:", this.advancedCourses());
        })
    }


    ngOnInit(): void {
        this.loadCourses().then(() => {
            console.log("all courses loaded", this.#courses());
        });
    }

    async loadCourses() {
        try {
            const courses = await this.coursesService.loadAllCourses();
            this.#courses.set(courses.sort(sortCoursesBySeqNo));

        } catch (err) {
            // alert('Error Loading courses');
            this.messagesService.showMeassage({ text: 'Could not load courses', severity: 'error' });
            console.error('Could not load courses', err);
        }
    }


    onCourseUpdated(updatedCourse: Course) {
        const courses = this.#courses();
        const newCourses = courses.map(course => course.id === updatedCourse.id ? updatedCourse : course);
        this.#courses.set(newCourses);
    }

    async onCourseDeleted(courseId: string) {
        try {
            await this.coursesService.deleteCourse(courseId);
            const courses = this.#courses();
            const newCourses = courses.filter(course => course.id !== courseId);
            this.#courses.set(newCourses);
        } catch (err) {
            console.error('Could not delete course', err);
        }
    }


    async onAddCourse() {
       const newCourse = await openEditCourseDialog(this.dialog, { mode: 'create', title: 'Create New Course' });
       const newCourses = [...this.#courses(),newCourse];
       this.#courses.set(newCourses.sort(sortCoursesBySeqNo));
    }

}
