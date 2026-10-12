import { Directive, inject, TemplateRef } from "@angular/core";

/**
 * `inmCarouselSlide`
 *
 * Structural directive that marks content as a carousel slide.
 * Place it on an `<ng-template>` inside `<app-carousel>`.
 *
 * @example
 * ```html
 * <app-carousel>
 *   <ng-template inmCarouselSlide>
 *     <img src="hero.jpg" alt="Hero image" />
 *   </ng-template>
 *
 *   <ng-template inmCarouselSlide>
 *     <div class="card">Slide two</div>
 *   </ng-template>
 * </app-carousel>
 * ```
 */
@Directive({
  selector: "[inmCarouselSlide]",
})
export class CarouselSlide {
  readonly template = inject(TemplateRef<void>);
}
