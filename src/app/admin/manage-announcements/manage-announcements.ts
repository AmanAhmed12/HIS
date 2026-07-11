import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-announcements',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manage-announcements.html',
  styleUrl: './manage-announcements.css'
})
export class ManageAnnouncements {}
