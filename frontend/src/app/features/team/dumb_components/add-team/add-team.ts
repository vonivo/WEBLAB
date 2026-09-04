import { Component, output, signal } from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Team } from '../../team.types';
import { form, FormField, required } from '@angular/forms/signals';

@Component({
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    TranslatePipe,
    MatCardContent,
    MatFormField,
    MatInput,
    MatLabel,
    MatCardActions,
    MatButton,
    FormField,
    MatError,
  ],
  selector: 'app-add-team',
  styleUrl: './add-team.css',
  templateUrl: './add-team.html',
})
export class AddTeam {
  addTeamModel = signal<Team>({
    name: '',
    logoUrl: '',
  });

  onFormSubmit = output<Team>();

  addTeamForm = form(this.addTeamModel, (schemaPath) => {
    required(schemaPath.name, { message: 'generic.required' });
    required(schemaPath.logoUrl, { message: 'generic.required' });
  });

  handleFormSubmit(event: Event) {
    event.preventDefault();
    this.addTeamForm().markAsTouched();

    if (this.addTeamForm().valid()) {
      this.onFormSubmit.emit({
        name: this.addTeamForm.name().value(),
        logoUrl: this.addTeamForm.logoUrl().value(),
      });
    }
  }
}
