import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Food, ParserService } from 'src/app/services/parser/parser.service';

@Component({
  selector: 'app-foods-list',
  templateUrl: './foods-list.component.html',
  styleUrls: ['./foods-list.component.scss']
})
export class FoodsListComponent implements OnInit, OnDestroy {

  foodsListSubscription: Subscription;
  foodsList: Array<Food>;

  constructor(
    private parser: ParserService
  ) { }

  ngOnInit(): void {
    this.foodsListSubscription = this.parser.parseFoodItemsPage().subscribe(foodsList => {
      this.foodsList = foodsList;
    });
  }

  ngOnDestroy(): void {
      this.foodsListSubscription.unsubscribe();
  }
}
