export class RecruiterRegistrationRequest {
  constructor(name, email, password, mobile, bio, companyName) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.mobile = mobile;
    this.bio = bio;
    this.companyName = companyName;
  }
}

export class PostJobRequest {
  constructor(
    _id,
    jobId,
    jobTitle,
    role,
    responsibility,
    companyName,
    experience,
    minSalary,
    maxSalary,
    noOfPositions,
    location,
    skillsAndQualification,
    degree,
    companyInfo,
    employmentType,
    industryType,
    searchKeyword,
    jobDesc
  ) {
    this._id = _id;
    this.jobId = jobId;
    this.jobTitle = jobTitle;
    this.role = role;
    this.responsibility = responsibility;
    this.companyName = companyName;
    this.experience = experience;
    this.minSalary = minSalary;
    this.maxSalary = maxSalary;
    this.noOfPositions = noOfPositions;
    this.location = location;
    this.skillsAndQualification = skillsAndQualification;
    this.degree = degree;
    this.companyInfo = companyInfo;
    this.employmentType = employmentType;
    this.industryType = industryType;
    this.searchKeyword = searchKeyword;
    this.jobDesc = jobDesc;
  }
}
