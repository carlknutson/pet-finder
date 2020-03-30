import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ShelterService } from './services/shelter.service';
import { ChromeStorageService } from './services/chrome-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'PetWatch';

  constructor(private changeDetectorRef: ChangeDetectorRef, private shelterService: ShelterService, 
              private chromeStorageService: ChromeStorageService){ }

  pets = [];
  noPetsFound = false;

  selectedPetType: string;
  zip: string = '';

  filterListTypes = [
    {value: 'all', viewValue: 'All Types'},
    {value: 'dog', viewValue: 'Dog'},
    {value: 'cat', viewValue: 'Cat'},
    // {value: 'other', viewValue: 'Other Small Animals'},
  ];

  openShelterSite(site:string) {
    window.open(site, "_blank");
  };

  ngOnInit() {
    this.chromeStorageService.getSearchCriteria().then((value:object) => {
      this.zip = value['zipCode'];
      this.selectedPetType = value['filterType'];
      this.validateZipAndCall();
    });
  };

  updatePetList() {
    this.chromeStorageService.setZip(this.zip);
    this.chromeStorageService.setFilterType(this.selectedPetType);

    this.shelterService.getPets(this.zip, this.selectedPetType).then((value: object[]) => {
      this.pets = [];
      this.pets = this.pets.concat(value);
      
      if (value.length == 0) {
        this.noPetsFound = true;
      } else {
        this.noPetsFound = false;
      }

      this.changeDetectorRef.detectChanges();
    },
    error => {
      this.noPetsFound = true;
    });
  };

  hidePet(index, id) {
    this.chromeStorageService.dismissPet(id);

    this.pets.splice(index, 1);
    this.changeDetectorRef.detectChanges();
  };

  watchPetToggle(index, id, status) {

    // TODO: would boolean take up 4 char in storage?
    if (status == "") {
      status = "W";
    } else {
      status = "";
    }

    this.chromeStorageService.watchPet(id, status);

    this.pets[index].status = status;
    this.changeDetectorRef.detectChanges();
  }

  validateZipAndCall() {
    if (this.zip.length == 5) {
      this.noPetsFound = false;
      this.updatePetList();
    } else {
      this.pets = [];
    }
  }

}
