import { Component, OnInit } from '@angular/core';
import { ParserService } from 'src/app/services/parser/parser.service';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent implements OnInit {

  constructor(
    private parser: ParserService
  ) { }

  ngOnInit(): void {
    this.parser.parseFoodRecipePage().subscribe();
  }

}
