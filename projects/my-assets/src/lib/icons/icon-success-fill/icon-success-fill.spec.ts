import { ComponentFixture, TestBed } from "@angular/core/testing";

import { IconSuccessFill } from "./icon-success-fill";

describe("IconSuccessFill", () => {
  let component: IconSuccessFill;
  let fixture: ComponentFixture<IconSuccessFill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconSuccessFill],
    }).compileComponents();

    fixture = TestBed.createComponent(IconSuccessFill);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
