import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ShelterService } from "./services/shelter.service";
import { ChromeStorageService } from "./services/chrome-storage.service";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "PetWatch";

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private shelterService: ShelterService,
    private chromeStorageService: ChromeStorageService,
    private spinnerService: Ng4LoadingSpinnerService
  ) {}

  pets = [];
  noPetsFound = false;

  selectedPetType: string;
  zip = "";

  filterListTypes = [
    { value: "all", viewValue: "All Types" },
    { value: "dog", viewValue: "Dog" },
    { value: "cat", viewValue: "Cat" },
    // {value: 'other', viewValue: 'Other Small Animals'},
  ];

  openShelterSite(site: string) {
    window.open(site, "_blank");
  }

  ngOnInit() {
    this.chromeStorageService.getSearchCriteria().then((value: any) => {
      this.zip = value.zipCode;
      this.selectedPetType = value.filterType;
      this.validateZipAndCall();
    });
  }

  updatePetList() {
    this.spinnerService.show();

    this.chromeStorageService.setZip(this.zip);
    this.chromeStorageService.setFilterType(this.selectedPetType);

    this.shelterService.getPets(this.zip, this.selectedPetType).then(
      (value: object[]) => {
        this.pets = [];
        this.pets = this.pets.concat(value);

        if (value.length === 0) {
          this.noPetsFound = true;
        } else {
          this.noPetsFound = false;
        }

        this.changeDetectorRef.detectChanges();
        this.spinnerService.hide();
      },
      (error) => {
        this.noPetsFound = true;
      }
    );
  }

  hidePet(index, pet) {
    this.chromeStorageService.dismissPet(pet.id, pet.type);

    this.pets.splice(index, 1);
    this.changeDetectorRef.detectChanges();
  }

  watchPetToggle(pet) {
    if (pet.status === "W") {
      pet.status = "";
      this.chromeStorageService.removeFromWatchedList(pet.id, pet.type);
      this.chromeStorageService.setPetInfo(pet);
    } else {
      pet.status = "W";
      this.chromeStorageService.addToWatchedList(pet.id, pet.type);
      this.chromeStorageService.setPetInfo(pet);
    }

    this.changeDetectorRef.detectChanges();
  }

  validateZipAndCall() {
    if (this.zip.length === 5) {
      this.noPetsFound = false;
      this.updatePetList();
    } else {
      this.pets = [];
    }
  }
}
