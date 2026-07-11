import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-gallery',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manage-gallery.html',
  styleUrl: './manage-gallery.css'
})
export class ManageGallery {}
