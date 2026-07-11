import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-manage-achievements',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manage-achievements.html',
  styleUrl: './manage-achievements.css'
})
export class ManageAchievements {}
