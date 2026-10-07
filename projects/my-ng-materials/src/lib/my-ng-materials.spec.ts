import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyNgMaterials } from './my-ng-materials';

describe('MyNgMaterials', () => {
  let component: MyNgMaterials;
  let fixture: ComponentFixture<MyNgMaterials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyNgMaterials],
    }).compileComponents();

    fixture = TestBed.createComponent(MyNgMaterials);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
