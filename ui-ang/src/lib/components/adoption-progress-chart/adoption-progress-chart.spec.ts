import { ComponentFixture, TestBed } from "@angular/core/testing";

import { beforeEach, describe, expect, it } from "vitest";

import {
  AdoptionProgressChart,
  AdoptionProgressItem,
} from "./adoption-progress-chart";

const MOCK_ITEMS: readonly AdoptionProgressItem[] = [
  {
    id: "paas",
    label: "Payment as a service",
    adopted: 10,
    total: 12,
    iconUrl:
      "/assets/images/bb-illustration-ui/ic_asset_payments_as_service.svg",
  },
  {
    id: "waas",
    label: "Wallet as a service",
    adopted: 10,
    total: 12,
    iconUrl: "/assets/images/dashboard/ic_asset_waas.svg",
  },
  {
    id: "caas",
    label: "Cards as a service",
    adopted: 3,
    total: 12,
    iconUrl: "/assets/images/dashboard/ic_asset_caas.svg",
  },
];

describe("AdoptionProgressChart", () => {
  let fixture: ComponentFixture<AdoptionProgressChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptionProgressChart],
    }).compileComponents();

    fixture = TestBed.createComponent(AdoptionProgressChart);
    fixture.componentRef.setInput("title", "API Adoption (Per Service)");
    fixture.componentRef.setInput("items", MOCK_ITEMS);
    fixture.componentRef.setInput("listAriaLabel", "API adoption by service");
    fixture.componentRef.setInput("barGradient", [
      { offset: "0%", color: "rgba(0,136,129,1)" },
      { offset: "45%", color: "rgba(4,233,237,1)" },
      { offset: "100%", color: "rgba(0,136,129,1)" },
    ]);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it("should render title, items, icons, and badges", () => {
    const root = fixture.nativeElement.querySelector(
      "[data-testid='inm-adoption-progress-chart']",
    ) as HTMLElement;

    expect(root.textContent).toContain("API Adoption (Per Service)");
    expect(root.textContent).toContain("Payment as a service");
    expect(root.textContent).toContain("Wallet as a service");
    expect(root.textContent).toContain("Cards as a service");

    const icons = root.querySelectorAll("img");
    expect(icons).toHaveLength(3);
    expect(icons[0].getAttribute("src")).toContain(
      "ic_asset_payments_as_service.svg",
    );
    expect(icons[1].getAttribute("src")).toContain("ic_asset_waas.svg");
    expect(icons[2].getAttribute("src")).toContain("ic_asset_caas.svg");

    expect(
      fixture.nativeElement.querySelector(
        "[data-testid='adoption-progress-badge-paas']",
      )?.textContent,
    ).toContain("10/12");
    expect(
      fixture.nativeElement.querySelector(
        "[data-testid='adoption-progress-badge-caas']",
      )?.textContent,
    ).toContain("3/12");
  });

  it("should derive percent rows from adopted/total", () => {
    const rows = fixture.componentInstance.rows();
    expect(rows).toHaveLength(3);
    expect(rows[0].percent).toBeCloseTo((10 / 12) * 100);
    expect(rows[2].percent).toBeCloseTo((3 / 12) * 100);
    expect(rows[0].percent).toBeGreaterThan(rows[2].percent);
    expect(rows[0].ariaLabel).toContain("Payment as a service");
  });

  it("should render inm-progress-bar for each item", () => {
    MOCK_ITEMS.forEach((item) => {
      const host = fixture.nativeElement.querySelector(
        `[data-testid='adoption-progress-bar-${item.id}']`,
      ) as HTMLElement;
      const bar = host.querySelector("[data-testid='inm-progress-bar']");
      expect(bar).not.toBeNull();
      expect(bar?.getAttribute("aria-label")).toContain(item.label);
    });
  });

  it("should recompute rows when items input changes", () => {
    fixture.componentRef.setInput("items", [MOCK_ITEMS[0], MOCK_ITEMS[2]]);
    fixture.detectChanges();

    expect(fixture.componentInstance.rows()).toHaveLength(2);
    expect(
      fixture.nativeElement.querySelector(
        "[data-testid='adoption-progress-badge-waas']",
      ),
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelector(
        "[data-testid='adoption-progress-badge-caas']",
      )?.textContent,
    ).toContain("3/12");
  });

  it("should pass custom bar gradient to progress bars", () => {
    fixture.componentRef.setInput("barGradient", [
      { offset: "0%", color: "#111111" },
      { offset: "100%", color: "#eeeeee" },
    ]);
    fixture.detectChanges();

    const fill = fixture.nativeElement.querySelector(
      "[data-testid='adoption-progress-bar-paas'] [data-testid='inm-progress-bar-fill']",
    ) as HTMLElement;

    const background = fill.style.backgroundImage || fill.style.background;
    expect(background).toContain("linear-gradient");
    expect(background).toMatch(/rgb\(17,\s*17,\s*17\)|#111111/i);
    expect(background).toMatch(/rgb\(238,\s*238,\s*238\)|#eeeeee/i);
  });

  it("should treat zero total as 0 percent", () => {
    fixture.componentRef.setInput("items", [
      {
        ...MOCK_ITEMS[0],
        adopted: 5,
        total: 0,
      },
    ]);
    fixture.detectChanges();

    expect(fixture.componentInstance.rows()[0].percent).toBe(0);
  });
});
