import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  description = "With our products, we keep our athletes in good shape. We offer high quality products available to all athletes who want to have a stunning body. Anyone can order a variety of products available on our site.";
  isReadMore : boolean = false;
  toggleDescription() {
    this.isReadMore  = !this.isReadMore ;
  }
}
