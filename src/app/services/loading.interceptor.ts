import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { inject } from "@angular/core";
import { finalize } from "rxjs";
import { SkipLoading } from "../loading/skip-loading.component";

export const loadingInterceptor = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    const skipLoading = req.context.get(SkipLoading);
    if (skipLoading) {
        return next(req);
    }
    const loadingService = inject(LoadingService);
    loadingService.loadingOn();
    return next(req).pipe(
        finalize(() => loadingService.loadingOff())
    );

}