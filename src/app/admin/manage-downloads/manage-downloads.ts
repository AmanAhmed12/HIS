import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-downloads',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manage-downloads.html',
  styleUrl: './manage-downloads.css'
})
export class ManageDownloads {}
