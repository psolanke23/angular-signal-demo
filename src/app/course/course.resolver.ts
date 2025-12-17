import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Course } from "../models/course.model";
import { CoursesService } from "../services/courses.service";
import { inject } from "@angular/core";

export const courseResolver: ResolveFn<Course | null> = async (router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const courseId = router.paramMap.get('courseId');
    if (!courseId) {
        return null;
    }
    const coursesService = inject(CoursesService);
    return coursesService.getCourseById(courseId);
}