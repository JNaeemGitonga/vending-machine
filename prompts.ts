import Table from 'cli-table'
import prompts from 'prompts';
import VendingMachine from './vending-machine';

const table = new Table({
    head: ['Item Id', "Item Name", "Price"],
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});

VendingMachine.choices.forEach(item => table.push([item.id, item.description, item.price]) )
console.log(table.toString());

let vendingMachine: VendingMachine;
class Prompts {
    static async startVending() {
        await prompts({
            type: 'number',
            name: 'value',
            message: 'Insert your cash?',
            validate: value => Prompts.insertCash(value)
          });
    }

    static async insertCash(value: number): Promise<boolean> {
        if (typeof value !== 'number') {
            console.log('We only accept US currency')
            return false;
        }
        vendingMachine = new VendingMachine(value);
        console.log(`      Your balance is $${value}`)
        return true;
    }
}

(async () => {
    try {
        await prompts(
            [{
                type: 'number',
                name: 'value',
                message: 'Insert your cash...',
                format: value => Prompts.insertCash(value)
            },
            {
                type: 'number',
                name: 'value',
                message: 'Make selection by entering an item Id',
                format: value => vendingMachine.makeSelection(value)
            }]
        );

    } catch (e) {
        console.log(e)
    }
})();
