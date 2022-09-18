export class Transaction {

    date_from: any;
    date_to: any;

    enterprise_name: String;
    enterprise_logo: any;

    description: String;
    position: String;

    constructor(
        date_from: any, 
        date_to: any,
        enterprise_name: String,
        enterprise_logo: any,
        description: String,
        position: String
    ) {
        this.date_from = date_from;
        this.date_to = date_to;
        this.enterprise_name = enterprise_name;
        this.enterprise_logo = enterprise_logo;
        this.description = description;
        this.position = position;
    }
}
