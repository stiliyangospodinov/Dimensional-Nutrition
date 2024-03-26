import { Component } from '@angular/core';

@Component({
  selector: 'app-like-btn',
  templateUrl: './like-btn.component.html',
  styleUrls: ['./like-btn.component.css']
})
export class LikeBtnComponent {
  toggleLike(event: MouseEvent): void {
    const button = event.target as HTMLButtonElement;
    if (button) {
      button.classList.toggle("liked");
    }
  }
}