import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { ApiService } from '../api.service';
import { Comment } from '../types/comment';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  providers: [DatePipe]
})
export class CommentsComponent implements OnInit {
  comment: string = '';
  comments: Comment[] = [];
  constructor(private userService: UserService, private apiService: ApiService, private datePipe: DatePipe) {}

  get isLogged(): boolean {
    return this.userService.isLogged;
  }
  get username(): string {
    return this.userService.user?.username || '';
  }
  
  ngOnInit(): void {
    this.apiService.getComments().subscribe((data: Comment[]) => {
      console.log(data);
      this.comments = data;
    });
  }
  addComment(event: Event): void {
    event.preventDefault();
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const newComment: Comment = {
      name: this.username,
      img: 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=',
      comment: this.comment,
      posted: formattedDate || ''
    };
    
    this.apiService.postComment(newComment).subscribe(() => {
      this.comments.push(newComment);
      this.comment = ''; 
    });
  }
}