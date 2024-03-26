import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppEmailDirective } from './validators/app-email.directive';
import { SlicePipe } from './pipes/slice.pipe';
import { LikeBtnComponent } from './like-btn/like-btn.component';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [AppEmailDirective, SlicePipe, LikeBtnComponent, LoaderComponent],
  imports: [
    CommonModule
  ],
  exports: [AppEmailDirective,SlicePipe,LikeBtnComponent],
})
export class SharedModule {}
