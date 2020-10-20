import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ShelterService } from './services/shelter.service';
import { PetfinderApiService } from './services/petfinder-api.service';
import { ChromeStorageService } from './services/chrome-storage.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PetWatch';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private shelterService: ShelterService,
    private chromeStorageService: ChromeStorageService,
    private petfinderApiService: PetfinderApiService,
    private spinner: NgxSpinnerService
  ) {}

  pets = [];
  noPetsFound = false;

  selectedPetType: string;
  zip = '';
  selectedAge = '';
  selectedBreed = '';

  filterListTypes = [
    { value: 'all', viewValue: 'All Types' },
    { value: 'dog', viewValue: 'Dog' },
    { value: 'cat', viewValue: 'Cat' },
    // {value: 'other', viewValue: 'Other Small Animals'},
  ];

  filterAgeTypes = [
    { value: 'baby', viewValue: 'Baby' },
    { value: 'young', viewValue: 'Young' },
    { value: 'adult', viewValue: 'Adult' },
    { value: 'senior', viewValue: 'Senior' },
  ];

  dogBreedOptions = [];
  catBreedOptions = [];

  ageFormControl = new FormControl();
  breedFormControl = new FormControl();

  openShelterSite(site: string) {
    window.open(site, '_blank');
  }

  ngOnInit() {
    this.chromeStorageService.getSearchCriteria().then((value: any) => {
      this.zip = value.zipCode;
      this.selectedPetType = value.filterType;
      this.validateZipAndCall();
    });

    // populate hidden breed list
    this.petfinderApiService.getAllPetfinderBreeds('dog').then((value: any) => {
      this.dogBreedOptions = value;
    });

    this.petfinderApiService.getAllPetfinderBreeds('cat').then((value: any) => {
      this.catBreedOptions = value;
    });
  }

  updatePetList() {
    this.spinner.show();

    this.chromeStorageService.setZip(this.zip);
    this.chromeStorageService.setFilterType(this.selectedPetType);

    this.shelterService.getPets(this.zip, this.selectedPetType, this.selectedAge, this.selectedBreed).then(
      (value: object[]) => {
        this.pets = [];
        this.pets = this.pets.concat(value);

        if (value.length === 0) {
          this.noPetsFound = true;
        } else {
          this.noPetsFound = false;
        }

        this.changeDetectorRef.detectChanges();
        this.spinner.hide();
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
    if (pet.status === 'W') {
      pet.status = '';
      this.chromeStorageService.removeFromWatchedList(pet.id, pet.type);
      this.chromeStorageService.setPetInfo(pet);
    } else {
      pet.status = 'W';
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

  changeTypeAndCall() {
    this.selectedBreed = '';
    this.noPetsFound = false;
    this.validateZipAndCall();
  }

  detectChange() {
    this.changeDetectorRef.detectChanges();
  }
}
