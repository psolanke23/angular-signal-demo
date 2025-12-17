import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { MessagesService } from "../messages/messages.service";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MessagesComponent } from '../messages/messages.component';

@Component({
    selector: 'login',
    imports: [
        RouterLink,
        ReactiveFormsModule,
        MessagesComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

    fb = inject(FormBuilder);
    messagesService = inject(MessagesService);
    authservice = inject(AuthService);
    router = inject(Router);

    form = this.fb.group({
        email: [''],
        password: ['']
    })

    async onLogin() {
        try {
            const { email, password } = this.form.value;
            if (!email && !password) {
                this.messagesService.showMeassage({ severity: 'warning', text: 'Please enter email and password!' });
                return;
            }
           await this.authservice.login(email!, password!);
            this.router.navigate(['/home']);

        } catch (error) {
            this.messagesService.showMeassage({ severity: 'error', text: 'Login failed!' });
        }
    }
}
