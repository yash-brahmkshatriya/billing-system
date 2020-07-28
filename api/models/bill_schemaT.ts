export class billSchema { 
    id_?:string;
    user_id:string;
    party_name:string;
    bill:{
        num:number;
        date:Date;
    };
    dc:{
        num:number;
        date:Date;
    };
    po:{
        num:number;
        date:Date;
    };
    items:[Object];
}