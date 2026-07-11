import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-contact',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manage-contact.html',
  styleUrl: './manage-contact.css'
})
export class ManageContact {}
