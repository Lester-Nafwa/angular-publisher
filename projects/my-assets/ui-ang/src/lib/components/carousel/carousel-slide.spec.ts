import { Component, TemplateRef, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CarouselSlide } from "./carousel-slide";

@Component({
  template: ` <ng-template inmCarouselSlide>
    <div>Slide content</div>
  </ng-template>`,
  standalone: true,
  imports: [CarouselSlide],
})
class TestHostComponent {
  @ViewChild(CarouselSlide) carouselSlide!: CarouselSlide;
}

describe("CarouselSlide", () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    fixture = TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create an instance", () => {
    expect(component.carouselSlide).toBeTruthy();
    expect(component.carouselSlide.template).toBeInstanceOf(TemplateRef);
  });
});
