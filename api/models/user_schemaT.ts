export class UserSchema {
    id_?:string;
    email:string;
    pfname:string;
    plname:string;
    company_name:string;
    address:{
        place_no:string;
        street:string;
        locality:string;
        city:string;
        state:string;
        pincode:number;
    };
    hash:string;
    salt:string;
}