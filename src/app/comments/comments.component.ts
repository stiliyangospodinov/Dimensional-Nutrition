import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { ApiService } from '../api.service';
import { Comment } from '../types/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  providers: [DatePipe]
})
export class CommentsComponent implements OnInit {
  commentForm: FormGroup;
  comments: Comment[] = [];
  newCommentPosted: boolean = false;
  newCommentId: string | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private apiService: ApiService,
    private datePipe: DatePipe
  ) {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
  }

  get isLogged(): boolean {
    return this.userService.isLogged;
  }

  get username(): string {
    return this.userService.user?.username || '';
  }
  
  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.apiService.getComments()
      .pipe(
        catchError(error => {
          console.error('Error loading comments:', error);
          return [];
        })
      )
      .subscribe((data: Comment[]) => {
        console.log(data);
        this.comments = data;
      });
  }

  addComment(event: Event): void {
    event.preventDefault();
    
    const comment = this.commentForm.value.comment;

    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const newComment: Comment = {
      name: this.username,
      img: 'https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=',
      comment: comment,
      posted: formattedDate || ''
    };

    this.apiService.postComment(newComment)
      .pipe(
        catchError(error => {
          console.error('Error posting comment:', error);
          throw error;
        })
      )
      .subscribe((id: string) => {
        newComment.id = id; 
        this.comments.push(newComment);
        this.commentForm.reset();
        this.newCommentPosted = true;
        this.newCommentId = id;
      });
  }

  closeNewComment(commentId: string | undefined): void {
    if (commentId) {
      this.apiService.deleteComment(commentId)
        .pipe(
          catchError(error => {
            console.error('Error deleting comment:', error);
            throw error;
          })
        )
        .subscribe(() => {
          this.comments = this.comments.filter(comment => comment.id !== commentId);
        });
    }
    this.newCommentPosted = false;
  }
}
