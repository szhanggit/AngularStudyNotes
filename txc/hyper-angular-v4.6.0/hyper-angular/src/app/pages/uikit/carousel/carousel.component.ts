import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';


// caption type
type carouselCaptionSlide = {
  slideTitle: string;
  image: string;
  subTitle: string;
}

@Component({
  selector: 'app-ui-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  carouselImages: string[] = [];
  caroselCaptionSlides: carouselCaptionSlide[] = [];

  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  pauseOnHover = true;
  pauseOnFocus = true;


  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Carousel', path: '/', active: true }];
    this.carouselImages = [1, 2, 3].map((n) => `assets/images/small/small-${n}.jpg`);

    this.caroselCaptionSlides = [
      {
        slideTitle: 'First slide label',
        image: 'assets/images/small/small-4.jpg',
        subTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      {
        slideTitle: 'Second slide label',
        image: 'assets/images/small/small-1.jpg',
        subTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      {
        slideTitle: 'Third slide label',
        image: 'assets/images/small/small-3.jpg',
        subTitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      }
    ];
  }

  /**
   * toggle carousel 
   */
  togglePaused(): void {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }

}
