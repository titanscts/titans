export class ApplicantRegistrationRequest {
  constructor(
    fullName,
    email,
    password,
    mobile,
    skills,
    isExperienced,
    experience,
    address,
    education,
    employment
  ) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.mobile = mobile;
    this.skills = skills;
    this.isExperienced = isExperienced;
    this.experience = experience;
    this.address = address;
    this.education = education;
    this.employment = employment;
  }
}

export class Address {
  constructor(line1, line2, city, state, country, postalcode) {
    this.line1 = line1;
    this.line2 = line2;
    this.city = city;
    this.state = state;
    this.country = country;
    this.postalcode = postalcode;
  }
}

export class Employment {
  constructor(
    currEmployer,
    currDesignation,
    currJobDescription,
    currExpInMonths,
    prevEmployer,
    prevJobDescription,
    prevExpInMonths
  ) {
    this.currEmployer = currEmployer;
    this.currDesignation = currDesignation;
    this.currJobDescription = currJobDescription;
    this.currExpInMonths = currExpInMonths;
    this.prevEmployer = prevEmployer;
    this.prevJobDescription = prevJobDescription;
    this.prevExpInMonths = prevExpInMonths;
  }
}

export class Education {
  constructor(
    university,
    passingYear,
    graduated,
    graduateSchool,
    noOfYearsAttended,
    skills_qualification,
    certification
  ) {
    this.university = university;
    this.passingYear = passingYear;
    this.graduated = graduated;
    this.graduateSchool = graduateSchool;
    this.noOfYearsAttended = noOfYearsAttended;
    this.skills_qualification = skills_qualification;
    this.certification = certification;
  }
}
