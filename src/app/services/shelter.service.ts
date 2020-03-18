import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnimalHumaneSocietyService } from './animal-humane-society.service'

@Injectable({
  providedIn: 'root'
})
export class ShelterService {

  constructor(private animalHumaneSocietyService: AnimalHumaneSocietyService) { }

  // searchCriteriaConversion() {
  //   {value: '', viewValue: 'All Types'},
  //   {value: 'animal_type%3ADog', viewValue: 'Dog'},
  //   {value: 'animal_type%3ACat', viewValue: 'Cat'},
  //   {value: 'animal_type%3ASmall%26Furry', viewValue: 'Other Small Animals'},
  // }
  
  getPets(type) {
    return this.animalHumaneSocietyService.getPets(type);
  }
}
