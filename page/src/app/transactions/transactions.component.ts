import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { faMagnifyingGlass, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import transactions from '../../assets/data.json';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  
  @ViewChild('inputtext') textinput: any;

  transactions: Array<Transaction>;
  filtered_transactions: Array<Transaction>;
  faMagnifyingGlass = faMagnifyingGlass;
  faArrowLeft = faArrowLeft;
  searching: boolean = false;
  blocked: boolean = false;

  constructor() {
    this.transactions = new Array<Transaction>();
    this.filtered_transactions = new Array<Transaction>();
  }

  ngOnInit(): void {
    this.transactions = transactions.transactions;
    this.filtered_transactions = this.transactions;
  }

  enableSearch() {
    if (!this.blocked) this.searching = true;
  }
  
  disableSearch() {
    this.textinput.nativeElement.value = null;
    this.blocked = true;
    this.searching = false;
    this.filtered_transactions = this.transactions;
    setTimeout(() => {
      this.blocked = false;
    }, 200);
  }

  filterTransactions(value: any) {
    this.filtered_transactions = this.transactions.filter(x => JSON.stringify(x).toLowerCase().includes(value.value.toLowerCase()));
  }

  getTime(from: any, to: any) {

    var tmp1 = from.split(",");
    var tmp2 = to.split(",");

    var date1 = this.getMonthFromString(String(tmp1[0]).toLowerCase(), tmp1[1]);

    if (to.toLowerCase() === 'now') {
      var date2 = new Date();
    }
    else {
      var date2 = this.getMonthFromString(String(tmp2[0]).toLowerCase(), tmp2[1]);
    }
    
    let result = this.getDiffBetweenDates(date1,date2);
    if (result >= 12) {
      var tmp = String(result / 12) + " year";
      if (result % 12 > 0) {
        tmp += " and " + String(result % 12) + " months";
      }
      return tmp;
    }
    else {
      return String(result) + " months";
    }
  }
  
  getMonthFromString(month: String, year: String){
    return new Date(Date.parse(month +" 1, " + year));
 }

  getDiffBetweenDates(d1: Date, d2: Date) { 
    var months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  openModal() {

  }

}
