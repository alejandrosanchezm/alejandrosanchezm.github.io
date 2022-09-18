export class PersonalData {

    name: String;
    f_surname: String;
    s_surname: String;

    email: String;
    phone: String;
    position: String;

    linkedin: String;
    github: String;
    

    constructor(
        name: String, 
        f_surname: String,
        s_surname: String,
        email: String,
        phone: String,
        position: String,
        linkedin: String,
        github: String
    ) {
        this.name = name;
        this.f_surname = f_surname;
        this.s_surname = s_surname;
        this.email = email;
        this.phone = phone;
        this.position = position;
        this.linkedin = linkedin;
        this.github = github;
    }
}
