import { ExactChange } from './vending-machine-interfaces'
export default class VendingMachine {

    amount: number;
    selection: { id: number, description: string, qty: number, price: number };

    static choices = [
        {
            id: 1,
            description: "bag of cashews",
            qty: 20,
            price: 1.25,
        },
        {
            id: 2,
            description: "power bar",
            qty: 20,
            price: 1.25,
        },
        {
            id: 3,
            description: "box of cookies",
            qty: 20,
            price: 1.25,
        },
        {
            id: 4,
            description: "veggie sub",
            qty: 20,
            price: 5.25,
        }
    ];

    change = [
        { value: 0.25, amt: 200 },
        { value: 1, amt: 200 },
        { value: 0.1, amt: 200 },
        { value: 0.05, amt: 200 },
        { value: 5, amt: 200 },
        { value: 10, amt: 200 },
    ];

    constructor(cash) {
        this.amount = cash;
    }

    insertCash(amt): void {
        this.amount = amt;
    }

    returnMoney():void {
        this.dispenseChange(0);
    }

    makeSelection(selectionId): boolean {
      this.selection = VendingMachine.choices.find(s => s.id == selectionId);
      const inStock = this.selection.qty > 0;
      if (!inStock) {
          this.returnMoney();
          this.selection = undefined;
          return;
      }
      const isEnough = this.isEnough()
      if (!isEnough) {
        //todo make smart enough to display amount missing;
        console.log('  Please add more money');
        this.returnMoney();
        return false;
      }

      console.log(`    Please wait while we deliver your: ${this.selection.description}`);
      this.dispenseChange(this.selection.price);
      return true;
    }

    dispenseItem(selectionId): void {
        const selection = VendingMachine.choices.find(s => s.id === selectionId);
        selection.qty -= 1;
        this.selection = undefined;
        console.log(`Enjoy your ${selection.description}!`);
    }

    isEnough(): boolean {
      return this.amount > this.selection.price;
    }

    dispenseChange(price: number): ExactChange {
        let change = this.amount - price;
        const [dollars, cents] = change.toFixed(2).split('.');
        let cents$ = Number(`.${cents}`);
        let dollars$ = Number(dollars);
        let exactChange = { quarters: 0, nickles: 0, dimes: 0, one$: 0, ten$: 0, five$: 0 };

    while (dollars$ > 0) {
        if (dollars$ >= 10) {
            dollars$ -= 10;
            dollars$ = Number(dollars$.toFixed(2));
            this.change[5].amt -= 1;
            exactChange.ten$ += 1;
        }

        if (dollars$ >= 5) {
            dollars$ -= 5;
            dollars$ = Number(dollars$.toFixed(2));
            this.change[4].amt -= 1;
            exactChange.five$ += 1;
        }
    
        if (dollars$ >= 1) {
            dollars$ -= 1;
            dollars$ = Number(dollars$.toFixed(2));
            this.change[1].amt -= 1;
            exactChange.one$ += 1;
        }
    }

    while (cents$ > 0) {
        if (cents$ >= 0.25) {
            cents$ -= 0.25;
            cents$ = Number(cents$.toFixed(2));
            this.change[0].amt -= 1;
            exactChange.quarters += 1;
        }

        if (cents$ >= 0.1) {
            cents$ -= 0.1;
            cents$ = Number(cents$.toFixed(2));
            this.change[2].amt -= 1;
            exactChange.dimes += 1;
        }

        if (cents$ >= 0.05) {
            cents$ -= 0.05;
            cents$ = Number(cents$.toFixed(2));
            this.change[3].amt -= 1;
            exactChange.nickles += 1;
        }
    }
    this.dispenseItem(this.selection.id);
    console.log(`Here\'s your change! $${change}`, exactChange);
    return exactChange;
  }
}
