import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AnimalHumaneSocietyService } from './animal-humane-society.service'

@Injectable({
  providedIn: 'root'
})
export class ShelterService {

  constructor(private animalHumaneSocietyService: AnimalHumaneSocietyService) { }

  getPets(type:string) {
    return this.animalHumaneSocietyService.getPets(type);
  }
}