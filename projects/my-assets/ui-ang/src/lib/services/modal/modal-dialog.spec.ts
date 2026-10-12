import { TestBed } from "@angular/core/testing";

import { ModalDialog } from "./modal-dialog";

describe("ModalDialog", () => {
  let service: ModalDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalDialog);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
